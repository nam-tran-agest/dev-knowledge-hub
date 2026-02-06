import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "../globals.css"; // Fixed path
import { Link } from "@/i18n/routing"; // Localized Link
import { CC_STYLES } from "@/lib/constants";
import { MainNav } from "@/components/layout/main-nav";
import { FooterData } from '@/types/base';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/common/ui/navigation/ScrollToTop';
import Image from "next/image";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';


const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'layout.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/img/home/nav_ico.svg'
    }
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  const footerData = (messages as any).footer as FooterData;

  const fontClass = locale === 'vi'
    ? 'font-[family-name:"Times_New_Roman",Times,serif]'
    : `${playfair.variable} font-serif`;

  return (
    <html lang={locale}>
      <body className={`${fontClass} antialiased bg-main-gradient`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <header className={`fixed top-0 z-30 flex h-16 w-full items-center justify-center px-6 ${CC_STYLES.header}`}>
                <Link href="/" className="absolute left-6 flex h-16 items-center gap-3">
                  <Image
                    src="/img/home/nav_ico.svg"
                    alt="Dev Hub Logo"
                    width={48}
                    height={48}
                    className="rounded-lg shadow-lg"
                  />
                </Link>

                <MainNav />
              </header>
              <main className="w-full">
                {children}
              </main>
              <Footer footer={footerData} />
              <ScrollToTop />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
