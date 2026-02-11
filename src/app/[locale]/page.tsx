import { PageShell } from '@/components/layout/page-shell';
import { LandingContainer } from '@/features/landing/components/landing-container';

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell variant="landing">
      <LandingContainer locale={locale} />
    </PageShell>
  )
}
