
import { NextRequest, NextResponse } from 'next/server';
import { saveSpotifyTokens } from '@/features/media/services/spotify';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    const expectedState = request.cookies.get('spotify_oauth_state')?.value;

    const redirect = (path: string) => {
        const response = NextResponse.redirect(new URL(path, request.url));
        response.cookies.set('spotify_oauth_state', '', { path: '/', maxAge: 0 });
        return response;
    };

    if (!state || !expectedState || state !== expectedState) {
        return redirect('/media/music?error=invalid_state');
    }

    if (error) {
        console.error('Spotify Auth Error:', error);
        return redirect('/media/music?error=access_denied');
    }

    if (!code) {
        return redirect('/media/music?error=no_code');
    }

    try {
        await saveSpotifyTokens(code);
        return redirect('/media/music?success=true');
    } catch (e) {
        console.error('Error handling Spotify callback:', e);
        return redirect('/media/music?error=callback_failed');
    }
}
