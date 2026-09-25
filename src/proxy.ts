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

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // 1. Auto-forward email verification / reset code to /callback if landed on any other page
    const code = request.nextUrl.searchParams.get('code')
    const token_hash = request.nextUrl.searchParams.get('token_hash')
    if ((code || token_hash) && !pathname.startsWith('/callback')) {
        const callbackUrl = new URL('/callback', request.url)
        callbackUrl.search = request.nextUrl.search
        return NextResponse.redirect(callbackUrl)
    }

    // Keep old bookmarked locale URLs working without exposing a language prefix.
    if (/^\/(?:en|vi)(?:\/|$)/.test(pathname)) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = pathname.replace(/^\/(?:en|vi)(?=\/|$)/, '') || '/'
        return NextResponse.redirect(redirectUrl)
    }

    // 2. Run intl middleware first to handle routing/locales
    const response = intlMiddleware(request)

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        return response
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Public pages do not need an auth request.
    if (!isProtectedRoute && !isAuthRoute) {
        return response
    }

    const allCookies = request.cookies.getAll()
    const hasAuthCookie = allCookies.some(c => c.name.includes('-auth-token'))

    // Fast-path: Unauthenticated guest accessing protected route without cookies -> redirect immediately
    if (isProtectedRoute && !hasAuthCookie) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', pathname)
        const redirectResponse = NextResponse.redirect(loginUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    if (isAuthRoute && !hasAuthCookie) {
        return response
    }

    // Cookie contents are untrusted until Supabase verifies the user.
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

    const { data } = await supabase.auth.getClaims()
    const isAuthenticated = Boolean(data?.claims?.sub)

    // Redirect unauthenticated users from protected routes to login
    if (!isAuthenticated && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', pathname)
        const redirectResponse = NextResponse.redirect(loginUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // Redirect authenticated users away from login/signup to home (allow /reset-password)
    if (isAuthenticated && isAuthRoute) {
        const homeUrl = new URL('/', request.url)
        const redirectResponse = NextResponse.redirect(homeUrl)
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    return response
}
