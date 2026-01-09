'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, CheckCircle, Sparkles } from 'lucide-react'
import { CC_STYLES, ANIMATIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [isSent, setIsSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            const supabase = createClient()

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/callback`,
                },
            })

            if (error) {
                setError(error.message)
            } else {
                setIsSent(true)
            }
        })
    }

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className={cn('w-full max-w-md', ANIMATIONS.slideUp)}>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <CheckCircle className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-xl">Check your email</CardTitle>
                        <CardDescription>
                            We sent a magic link to <span className="text-blue-400">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-gray-400">
                        <p>Click the link in your email to sign in.</p>
                        <p className="mt-2">Don&apos;t see it? Check your spam folder.</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                                setIsSent(false)
                                setEmail('')
                            }}
                        >
                            Try a different email
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className={cn('w-full max-w-md', ANIMATIONS.slideUp)}>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your Dev Knowledge Hub
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending magic link...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send magic link
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
