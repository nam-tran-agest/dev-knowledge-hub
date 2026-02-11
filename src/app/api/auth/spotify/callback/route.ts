
import { NextRequest, NextResponse } from 'next/server';
import { saveSpotifyTokens } from '@/features/media/services/spotify';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        console.error('Spotify Auth Error:', error);
        return NextResponse.redirect(new URL('/media/music?error=access_denied', request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/media/music?error=no_code', request.url));
    }

    try {
        await saveSpotifyTokens(code);
        return NextResponse.redirect(new URL('/media/music?success=true', request.url));
    } catch (e) {
        console.error('Error handling Spotify callback:', e);
        return NextResponse.redirect(new URL('/media/music?error=callback_failed', request.url));
    }
}
