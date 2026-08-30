import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|callback|.*\\..*).*)',
    ]
}

const intlMiddleware = createMiddleware(routing)

const PROTECTED_ROUTES = ['/planner', '/working', '/media/youtube']
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
    // 1. Run intl middleware first to handle routing/locales
    const response = intlMiddleware(request)

    // 2. Run Supabase auth logic
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
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Refresh session if needed
    const { data: { user } } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(?:vi|en)/, '') || '/'
    const locale = pathname.startsWith('/en') ? 'en' : 'vi'

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    )

    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
    )

    // Redirect unauthenticated users from protected routes to login
    if (!user && isProtectedRoute) {
        const loginUrl = new URL(`/${locale}/login`, request.url)
        loginUrl.searchParams.set('next', pathname)
        const redirectResponse = NextResponse.redirect(loginUrl)
        // Copy cookies from response to redirectResponse
        response.cookies.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    // Redirect authenticated users away from login/signup to home
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
