'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Lock, Mail, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

function LoginForm() {
    const t = useTranslations('auth.login')
    const searchParams = useSearchParams()
    const verifiedParam = searchParams.get('verified') === 'true'
    const errorParam = searchParams.get('error')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(errorParam)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch (e) {
            if ((e as Error).message === 'NEXT_REDIRECT') {
                throw e
            }
            console.error(e)
            setError('System access rejected. Check credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md cyber-panel-lg border-primary/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative z-10 p-2 sm:p-4">
            {/* Top Corner System Tag */}
            <div className="cyber-tag-header">
                // AUTH_TERMINAL_GATEWAY
            </div>
            {/* Corner Brackets */}
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
                {verifiedParam && (
                    <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 p-3 cyber-clip-button flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>{t('verifiedSuccess')}</span>
                    </div>
                )}

                {error && (
                    <div className="text-xs font-mono text-destructive bg-destructive/10 border border-destructive/30 p-3 cyber-clip-button flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                        <div>
                            <span className="font-bold">// {t('errorTitle')}:</span> {error}
                        </div>
                    </div>
                )}

                {/* Email/Password Form */}
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-primary" /> {t('emailLabel')} *
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="operator@cyberlink.net"
                            required
                            disabled={isLoading}
                            className="bg-surface-deep/80 border-primary/30 focus:border-primary text-white font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-primary" /> {t('passwordLabel')} *
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-[10px] font-mono text-primary/60 hover:text-primary transition-colors uppercase tracking-wider"
                            >
                                {t('forgotPassword')}
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            className="bg-surface-deep/80 border-primary/30 focus:border-primary text-white font-mono text-sm"
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
                <p className="text-xs font-mono text-muted-foreground">
                    {t('noAccount')}{' '}
                    <Link
                        href="/signup"
                        className="text-primary hover:underline font-bold uppercase tracking-wider ml-1"
                    >
                        [ {t('signupLink')} ]
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export function LoginContainer() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Ambient Cyber Grid & Glows */}
            <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] pointer-events-none" />

            <Suspense fallback={
                <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" /> LOADING_TERMINAL...
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
