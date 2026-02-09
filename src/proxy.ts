import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
    // 1. Run intl middleware first to handle routing/locales
    // This returns a response with the correct locale redirects/rewrites
    const response = intlMiddleware(request)

    // 2. Run Supabase auth logic
    // We recreate the client here to attach it to the *response* from intl
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
    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next`, `/_vercel` or `/callback`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|callback|.*\\..*).*)',
        // However, match all pathnames within `/users`, optionally with a locale prefix
        // '/([\\w-]+)?/users/(.+)'
    ],
}
