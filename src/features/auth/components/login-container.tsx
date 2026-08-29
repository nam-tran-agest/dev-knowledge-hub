'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Lock, Mail, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

export function LoginContainer() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch (e) {
            // Ignore redirect errors which are actually successful navigations
            if ((e as Error).message === 'NEXT_REDIRECT') {
                throw e
            }
            console.error(e)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-card">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <Card className="w-full max-w-md bg-card border border-white/10 shadow-2xl backdrop-blur-2xl rounded-3xl relative z-10 p-2 sm:p-4 glare-top">
                <CardHeader className="space-y-3 text-center pb-6">
                    <Link href="/" className="inline-flex items-center justify-center mx-auto mb-2">
                        <div className="relative h-12 w-12 transition-transform hover:scale-105">
                            <Image
                                src="/img/home/nav_ico.svg"
                                alt="Dev Hub Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm">
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                disabled={isLoading}
                                className="bg-card border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500/50 py-5 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="bg-card border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500/50 py-5 text-sm"
                            />
                        </div>
                        {error && (
                            <div className="text-xs text-rose-300 font-semibold text-center bg-rose-500/15 border border-rose-500/30 p-3 rounded-xl">
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button
                            className="w-full font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] rounded-xl py-5 cursor-pointer transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Sign In
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
