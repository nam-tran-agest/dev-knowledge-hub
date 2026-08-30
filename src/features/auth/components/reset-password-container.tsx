'use client'

import { useState, Suspense } from 'react'
import { updatePassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Lock, Terminal, AlertTriangle, CheckCircle2, ShieldCheck, User } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

function ResetPasswordForm() {
    const t = useTranslations('auth.resetPassword')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password.length < 6) {
            setError(t('passwordTooShort'))
            return
        }

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'))
            return
        }

        setIsLoading(true)

        try {
            const result = await updatePassword(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/login?verified=true')
                }, 2000)
            }
        } catch (err) {
            console.error(err)
            setError('Encryption update failed. Please retry.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md bg-[#050714]/95 border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl cyber-clip-lg relative z-10 p-4 sm:p-6 text-center">
                <div className="absolute top-0 right-6 px-2.5 py-0.5 bg-[#050714] border-x border-b border-emerald-500/50 text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    // PROFILE_UPDATED
                </div>
                <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />

                <div className="mx-auto my-4 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                </div>

                <CardTitle className="text-lg sm:text-xl font-mono font-extrabold uppercase tracking-wider text-white">
                    {t('successTitle')}
                </CardTitle>

                <p className="mt-3 text-xs font-mono text-slate-300 leading-relaxed px-2">
                    {t('successDesc')}
                </p>

                <div className="mt-6 pt-4 border-t border-emerald-500/20">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center w-full font-mono text-xs font-bold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] cyber-clip-button py-3.5 transition-all duration-300 cursor-pointer"
                    >
                        [ {t('backToLogin')} ]
                    </Link>
                </div>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md bg-[#050714]/95 border border-primary/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-2xl cyber-clip-lg relative z-10 p-2 sm:p-4">
            <div className="absolute top-0 right-6 px-2.5 py-0.5 bg-[#050714] border-x border-b border-primary/40 text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
                // PROFILE_RECONFIGURATION
            </div>
            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />

            <CardHeader className="space-y-3 text-center pb-4">
                <Link href="/" className="inline-flex items-center justify-center mx-auto mb-1">
                    <div className="relative h-12 w-12 cyber-clip-button border border-primary/40 p-2 bg-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:border-primary transition-colors">
                        <Image
                            src="/img/home/nav_ico.svg"
                            alt="Dev Hub Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                </Link>
                <CardTitle className="text-xl sm:text-2xl font-mono font-extrabold uppercase tracking-wider text-white">
                    {t('title')}
                </CardTitle>
                <CardDescription className="text-primary/60 font-mono text-xs uppercase tracking-wide">
                    {t('subtitle')}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {error && (
                    <div className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 p-3 cyber-clip-button flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                        <div>
                            <span className="font-bold">// UPDATE_REJECTED:</span> {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Display Name Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="displayName" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" /> {t('nameLabel')}
                        </Label>
                        <Input
                            id="displayName"
                            name="displayName"
                            type="text"
                            placeholder={t('namePlaceholder')}
                            disabled={isLoading}
                            className="bg-[#030712]/80 border-primary/30 focus:border-primary text-white font-mono text-sm"
                        />
                    </div>

                    {/* New Password Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-primary" /> {t('passwordLabel')} *
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            className="bg-[#030712]/80 border-primary/30 focus:border-primary text-white font-mono text-sm"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> {t('confirmPasswordLabel')} *
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            className="bg-[#030712]/80 border-primary/30 focus:border-primary text-white font-mono text-sm"
                        />
                    </div>

                    <Button
                        className="w-full font-mono font-bold uppercase tracking-wider bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)] cyber-clip-button py-5 cursor-pointer transition-all duration-300 mt-2"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('loadingButton')}
                            </>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Terminal className="w-4 h-4" /> [ {t('submitButton')} ]
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="pt-2 pb-3 border-t border-primary/15 flex justify-center text-center">
                <Link
                    href="/login"
                    className="text-xs font-mono text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
                >
                    [ {t('backToLogin')} ]
                </Link>
            </CardFooter>
        </Card>
    )
}

export function ResetPasswordContainer() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] pointer-events-none" />

            <Suspense fallback={
                <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" /> LOADING_TERMINAL...
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
