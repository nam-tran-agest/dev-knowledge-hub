
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/spotify/callback';

const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative'
].join(' ');

export function getSpotifyAuthUrl() {
    const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID!,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getSpotifyTokens(code: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get tokens: ${JSON.stringify(error)}`);
    }

    return response.json();
}

export async function refreshSpotifyToken(refreshToken: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to refresh token: ${JSON.stringify(error)}`);
    }

    return response.json();
}

export async function spotifyFetch(endpoint: string, accessToken: string) {
    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        return null;
    }

    return response.json();
}
