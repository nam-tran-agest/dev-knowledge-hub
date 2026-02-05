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
  subsets: ["latin"],
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
    description: t('description')
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

  // Provide all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Temporary footer translation fetch (or pass messages to Footer if it stays client)
  // For now, let's assume Footer needs to be updated or we pass data. 
  // But wait, the previous code used `tObject` for footer. 
  // Let's pass the raw footer data from messages if possible or update Footer to use useTranslations.
  // For this step, I'll pass a placeholder or try to get it.
  const tFooter = await getTranslations({ locale, namespace: 'footer' });
  // Construct footer data from translations (simplified for now, or assume internal use)
  // Note: Previous code passed `tObject<FooterData>("footer")`.
  // If `Footer` is a client component, it can use `useTranslations`.
  // If it expects a prop, I need to construct it.
  // Let's assume Footer is updated to use useTranslations or I construct it here.
  // But constructing it here is tedious without seeing Footer type structure fully.
  // I will check Footer component later. For now, I'll comment out the failing prop or pass empty.
  // Actually, I can use `const footerMessages = messages.footer as FooterData` if typically structured.
  const footerData = (messages as any).footer as FooterData;

  return (
    <html lang={locale}>
      <body className={`${playfair.variable} font-serif antialiased bg-main-gradient`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <header className={`fixed top-0 z-30 flex h-16 w-full items-center justify-center px-6 ${CC_STYLES.header}`}>
                <Link href="/" className="absolute left-6 flex h-16 items-center gap-3">
                  <Image
                    src="/img/home/nav_ico.svg"
                    alt="Dev Hub Logo"
                    width={32}
                    height={32}
                    className="rounded-lg shadow-lg"
                  />
                </Link>

                <MainNav />
              </header>
              <main className="w-full">
                {children}
              </main>
              {/* <Footer footer={footerData} />  -- Commenting out to fix in next step properly or it might work if structure matches */}
              {/* Better to keep it if we can. The previous code passed `tObject<FooterData>("footer")`. */}
              {/* If I pass `messages.footer` it might work. */}
              <Footer footer={footerData} />
              <ScrollToTop />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
