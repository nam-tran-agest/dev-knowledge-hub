'use client'

import { LoadingSpinner } from '@/components/shared'
import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('common')
  return (
    <div className="min-h-100 flex items-center justify-center">
      <LoadingSpinner size="lg" text={t('loading')} />
    </div>
  )
}
