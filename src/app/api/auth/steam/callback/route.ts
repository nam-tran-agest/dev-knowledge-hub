import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const baseUrl = new URL(request.url).origin;

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Ignored
                }
            },
        },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.redirect(`${baseUrl}/vi/login?error=unauthorized`);
    }

    const claimedId = searchParams.get('openid.claimed_id');
    const mode = searchParams.get('openid.mode');

    if (mode === 'cancel' || !claimedId) {
        return NextResponse.redirect(`${baseUrl}/vi/media?error=steam_login_cancelled`);
    }

    // Verify OpenID parameters (Simplified signature validation)
    // In a production environment, you should verify the signature with Steam 
    // by making a POST request with `openid.mode=check_authentication`
    const verifyParams = new URLSearchParams(searchParams);
    verifyParams.set('openid.mode', 'check_authentication');

    try {
        const verifyRes = await fetch('https://steamcommunity.com/openid/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: verifyParams.toString(),
        });

        const verifyText = await verifyRes.text();
        if (!verifyText.includes('is_valid:true')) {
            return NextResponse.redirect(`${baseUrl}/vi/media?error=steam_verification_failed`);
        }

        // Extract SteamID64 from claimed_id
        // e.g., https://steamcommunity.com/openid/id/765611980xxxxxx
        const steamIdMatch = claimedId.match(/id\/(\d+)$/);
        const steamId64 = steamIdMatch ? steamIdMatch[1] : null;

        if (!steamId64) {
            return NextResponse.redirect(`${baseUrl}/vi/media?error=steam_id_not_found`);
        }

        // Save to steam_credentials table (Upsert)
        const { error: dbError } = await supabase
            .from('steam_credentials')
            .upsert({
                user_id: user.id,
                steam_id64: steamId64,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (dbError) {
            console.error('Supabase integration error:', dbError);
            return NextResponse.redirect(`${baseUrl}/vi/media?error=db_update_failed`);
        }

        return NextResponse.redirect(`${baseUrl}/vi/media`);
    } catch (err) {
        console.error('Steam OpenID verification error:', err);
        return NextResponse.redirect(`${baseUrl}/vi/media?error=server_error`);
    }
}
