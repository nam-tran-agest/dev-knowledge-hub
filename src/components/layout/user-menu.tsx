'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/lib/actions/auth'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, LogOut, Shield } from 'lucide-react'

export function UserMenu() {
    const t = useTranslations('auth.userMenu')
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const supabase = createClient()
            if (!supabase) {
                setLoading(false)
                return
            }

            // Get initial user
            supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
                setUser(data?.user ?? null)
                setLoading(false)
            }).catch(() => {
                setLoading(false)
            })

            // Listen for auth state changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null)
                setLoading(false)
            })

            return () => {
                subscription.unsubscribe()
            }
        } catch {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <div className="h-8 w-8 cyber-clip-button border border-primary/20 bg-primary/5 flex items-center justify-center animate-pulse">
                <div className="h-3 w-3 bg-primary/40 rounded-full" />
            </div>
        )
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 cyber-clip-button bg-primary/10 hover:bg-primary/25 border border-primary/40 hover:border-primary text-xs font-mono text-primary transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
                <LogIn className="w-3.5 h-3.5" />
                <span className="font-bold uppercase tracking-wider">{t('login')}</span>
            </Link>
        )
    }

    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Operator'
    const email = user.email || 'operator@cyberlink.net'
    const initials = (displayName[0] || 'O').toUpperCase()

    async function handleLogout() {
        await logout()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex items-center gap-2 p-1 cyber-clip-button border border-primary/40 hover:border-primary bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)] focus:outline-none"
                    aria-label="User menu"
                >
                    <Avatar className="size-7">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start pr-1.5 text-left">
                        <span className="text-[11px] font-mono font-bold text-white leading-none truncate max-w-[100px]">
                            {displayName}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 leading-none mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {t('status')}
                        </span>
                    </div>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2">
                <div className="absolute top-0 right-2 px-1.5 bg-[#050714] border-x border-primary/30 text-[8px] uppercase tracking-widest text-primary/60 font-mono pointer-events-none">
                    // USER_ID
                </div>

                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col space-y-1">
                        <p className="text-xs font-mono font-bold text-white leading-none flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{displayName}</span>
                        </p>
                        <p className="text-[10px] font-mono text-primary/60 leading-none truncate">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <div className="px-2 py-1 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                    <span className="uppercase tracking-widest">// ACCESS_LEVEL</span>
                    <span className="text-primary font-bold">OPERATOR_LV1</span>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive hover:text-white hover:bg-destructive/20 focus:text-destructive focus:bg-destructive/20 cursor-pointer"
                >
                    <LogOut className="w-3.5 h-3.5 mr-2 text-destructive" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
