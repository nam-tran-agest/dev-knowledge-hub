import { PageShell } from '@/components/layout/page-shell';
import { LandingContainer } from '@/features/landing';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Dashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell variant="landing">
      <LandingContainer locale={locale} />
    </PageShell>
  );
}
