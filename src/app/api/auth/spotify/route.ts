import { NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/features/media/services/spotify-api';

export async function GET() {
    const state = crypto.randomUUID();
    const response = NextResponse.redirect(getSpotifyAuthUrl(state));

    response.cookies.set('spotify_oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 600
    });

    return response;
}
