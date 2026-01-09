import { LoadingSpinner } from '@/components/shared'

export default function Loading() {
  return (
    <div className="min-h-100 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading notes..." />
    </div>
  )
}
