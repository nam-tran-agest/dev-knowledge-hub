import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if expired
    await supabase.auth.getUser();

    // Protect routes - redirect to login if not authenticated
    // DISABLED for "No Login" mode requested by user
    // const isAuthPage = request.nextUrl.pathname.startsWith('/login')
    // const isCallbackPage = request.nextUrl.pathname.startsWith('/callback')
    // const isPublicPage = isAuthPage || isCallbackPage

    // if (!user && !isPublicPage) {
    //     const url = request.nextUrl.clone()
    //     url.pathname = '/login'
    //     return NextResponse.redirect(url)
    // }

    // if (user && isAuthPage) { // Fixed: isAuthPage was undefined in original context if commented out above, but here I'm commenting it all out so it's fine.
    //     const url = request.nextUrl.clone()
    //     url.pathname = '/'
    //     return NextResponse.redirect(url)
    // }

    return supabaseResponse
}
