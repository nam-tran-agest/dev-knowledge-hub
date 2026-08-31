import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FileQuestion, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('common.notFound')

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

      <Card className="max-w-md w-full cyber-panel-lg border-primary/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative">
        <div className="cyber-tag-header">
          // SYS_NODE_NOT_FOUND
        </div>
        <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-60" />

        <CardHeader className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="cyber-clip-button bg-primary/15 border border-primary/40 p-2.5 text-primary">
              <FileQuestion className="h-6 w-6" />
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
        <CardContent className="space-y-6 text-center">
          <div className="py-4 border-y border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
            <p className="text-6xl font-mono font-black text-primary/30 tracking-widest">[ 404 ]</p>
            <p className="text-xs font-mono uppercase tracking-widest text-primary/60 mt-1">// TARGET_COORDINATES_INVALID</p>
          </div>
          <Button asChild className="w-full bg-primary text-black font-mono font-bold uppercase tracking-wider cyber-clip-button shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/90">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              [ {t('back')} ]
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
