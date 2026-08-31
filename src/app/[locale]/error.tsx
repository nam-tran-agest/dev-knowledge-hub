'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common.error')

  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

      <Card className="max-w-md w-full cyber-panel-lg border-destructive/40 shadow-[0_0_50px_rgba(255,0,60,0.25)] relative">
        <div className="cyber-tag-header !border-destructive/40 !text-destructive">
          // SYS_CRITICAL_FAILURE
        </div>
        <div className="absolute inset-0 cyber-brackets-pink pointer-events-none opacity-60" />

        <CardHeader className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="cyber-clip-button bg-destructive/15 border border-destructive/40 p-2.5 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-mono font-bold text-white uppercase tracking-wider">
                {t('title')}
              </CardTitle>
              <CardDescription className="font-mono text-xs text-primary/60">
                // {t('description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="cyber-clip-button bg-destructive/10 border border-destructive/30 p-4">
            <p className="text-xs text-destructive font-mono break-all leading-relaxed">
              // ERROR_TRACE: {error.message || t('unknown')}
            </p>
            {error.digest && (
              <p className="text-[10px] text-primary/40 font-mono mt-2 uppercase tracking-widest">
                ID_DIGEST: [ {error.digest} ]
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={reset}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-mono text-xs font-bold uppercase tracking-wider cyber-clip-button shadow-[0_0_15px_rgba(255,0,60,0.4)]"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              [ {t('retry')} ]
            </Button>
            <Button asChild variant="outline" className="flex-1 cyber-clip-button font-mono text-xs uppercase tracking-wider text-primary border-primary/30 hover:bg-primary/10">
              <Link href="/">
                <Home className="mr-1.5 h-3.5 w-3.5" />
                [ {t('home')} ]
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
