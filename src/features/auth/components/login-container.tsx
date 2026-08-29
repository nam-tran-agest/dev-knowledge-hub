'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Lock, Mail, Terminal } from 'lucide-react'
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Ambient Cyber Grid & Glows */}
            <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] pointer-events-none" />

            <Card className="w-full max-w-md bg-[#050714]/95 border border-primary/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-2xl cyber-clip-lg relative z-10 p-2 sm:p-4">
                {/* Top Corner System Tag */}
                <div className="absolute top-0 right-6 px-2.5 py-0.5 bg-[#050714] border-x border-b border-primary/40 text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
                    // AUTH_TERMINAL_GATEWAY
                </div>
                {/* Corner Brackets */}
                <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />

                <CardHeader className="space-y-3 text-center pb-6">
                    <Link href="/" className="inline-flex items-center justify-center mx-auto mb-2">
                        <div className="relative h-12 w-12 cyber-clip-button border border-primary/40 p-2 bg-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                            <Image
                                src="/img/home/nav_ico.svg"
                                alt="Dev Hub Logo"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </Link>
                    <CardTitle className="text-xl sm:text-2xl font-mono font-extrabold uppercase tracking-wider text-white">
                        AUTHENTICATE_IDENTITY
                    </CardTitle>
                    <CardDescription className="text-primary/60 font-mono text-xs uppercase tracking-wide">
                        // Enter authorized credentials to decrypt workspace
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-primary" /> Identity / Email *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="operator@cyberlink.net"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-mono font-bold text-primary/80 uppercase tracking-widest flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-primary" /> Passkey Token *
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {error && (
                            <div className="text-xs font-mono text-destructive text-center bg-destructive/10 border border-destructive/30 p-3 cyber-clip-button">
                                // ACCESS_DENIED: {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button
                            className="w-full font-mono font-bold uppercase tracking-wider bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)] cyber-clip-button py-5 cursor-pointer transition-all duration-300"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    DECRYPTING_CREDENTIALS...
                                </>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Terminal className="w-4 h-4" /> [ AUTHENTICATE ]
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
