import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { FileQuestion, Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('common.notFound')

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-blue-500/10 p-3">
              <FileQuestion className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl">{t('title')}</CardTitle>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <p className="text-6xl font-bold text-blue-500/20">404</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t('back')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
