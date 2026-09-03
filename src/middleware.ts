import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|callback|live-widget|.*\\..*).*)',
    ]
}

const intlMiddleware = createMiddleware(routing)

const PROTECTED_ROUTES = ['/planner', '/working', '/media']
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

/**
 * Fast client-side JWT check: Extracts token expiry directly from cookies
 * without triggering costly remote HTTPS subrequests to Supabase.
 */
function isSessionCookieValid(cookies: { name: string; value: string }[]): boolean {
    const authCookies = cookies
        .filter(c => c.name.includes('-auth-token'))
        .sort((a, b) => a.name.localeCompare(b.name))
    
    if (authCookies.length === 0) return false

    try {
        let rawVal = authCookies.map(c => c.value).join('')
        if (rawVal.startsWith('base64-')) {
            rawVal = atob(rawVal.slice(7))
        }
        const session = JSON.parse(rawVal)
        const accessToken = session.access_token || (Array.isArray(session) ? session[0] : null)
        if (!accessToken) return false

        const parts = accessToken.split('.')
        if (parts.length !== 3) return false

        const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        const payload = JSON.parse(decoded)
        const now = Math.floor(Date.now() / 1000)

        // Return true if token is valid for at least another 10 seconds
        return typeof payload.exp === 'number' && payload.exp > now + 10
    } catch {
        return false
    }
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // 1. Auto-forward email verification / reset code to /callback if landed on any other page
    const code = request.nextUrl.searchParams.get('code')
    const token_hash = request.nextUrl.searchParams.get('token_hash')
    if ((code || token_hash) && !pathname.startsWith('/callback')) {
        const callbackUrl = new URL('/callback', request.url)
        callbackUrl.search = request.nextUrl.search
        return NextResponse.redirect(callbackUrl)
    }

    // 2. Run intl middleware first to handle routing/locales
    const response = intlMiddleware(request)

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        return response
    }

    const pathnameWithoutLocale = pathname.replace(/^\/(?:vi|en)/, '') || '/'
    const locale = pathname.startsWith('/en') ? 'en' : 'vi'

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    )

    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    )

    // 3. Fast-path: Public pages never need Supabase auth subrequests (0ms CPU, 0 subrequests)
    if (!isProtectedRoute && !isAuthRoute) {
        return response
    }

    // 4. Fast-path: Skip remote subrequests on Next.js prefetch requests (0ms CPU)
    const isPrefetch =
        request.headers.get('purpose') === 'prefetch' ||
        request.headers.get('sec-purpose') === 'prefetch' ||
        request.headers.get('x-nextjs-data') !== null ||
        request.headers.get('x-purpose') === 'prefetch'

    const allCookies = request.cookies.getAll()
    const hasAuthCookie = allCookies.some(c => c.name.includes('-auth-token'))

    // Fast-path: Unauthenticated guest accessing protected route without cookies -> redirect immediately
    if (isProtectedRoute && !hasAuthCookie) {
        const loginUrl = new URL(`/${locale}/login`, request.url)
        loginUrl.searchParams.set('next', pathname)
        const redirectResponse = NextResponse.redirect(loginUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // Fast-path: Valid non-expired JWT cookie -> Authenticated!
    // Bypasses remote Supabase HTTP call completely on normal page clicks (0ms CPU)
    const isTokenValid = hasAuthCookie && isSessionCookieValid(allCookies)

    if (isTokenValid) {
        // Authenticated user on protected route -> allow immediately!
        if (isProtectedRoute) {
            return response
        }
        // Authenticated user on auth route (/login, /signup) -> redirect to home!
        if (isAuthRoute) {
            const homeUrl = new URL(`/${locale}`, request.url)
            const redirectResponse = NextResponse.redirect(homeUrl)
            response.cookies.getAll().forEach(cookie => {
                redirectResponse.cookies.set(cookie.name, cookie.value)
            })
            return redirectResponse
        }
    }

    // Fast-path: If prefetch and token wasn't definitively verified, don't waste worker CPU
    if (isPrefetch) {
        return response
    }

    // 5. Fallback: Only call remote Supabase server if token is expired/near-expiry
    const supabase = createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return allCookies
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Redirect unauthenticated users from protected routes to login
    if (!user && isProtectedRoute) {
        const loginUrl = new URL(`/${locale}/login`, request.url)
        loginUrl.searchParams.set('next', pathname)
        const redirectResponse = NextResponse.redirect(loginUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // Redirect authenticated users away from login/signup to home (allow /reset-password)
    if (user && isAuthRoute) {
        const homeUrl = new URL(`/${locale}`, request.url)
        const redirectResponse = NextResponse.redirect(homeUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    return response
}
