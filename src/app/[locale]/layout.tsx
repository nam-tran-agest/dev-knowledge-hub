import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Link } from "@/i18n/routing";
import { MainNav } from "@/components/layout/main-nav";
import { FooterData } from '@/types/layout';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import Image from "next/image";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import MobileMenu from "@/components/layout/mobile-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
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
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();
  const footerData = (messages as unknown as { footer: FooterData }).footer;

  return (
    <html lang={locale}>
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            {/* Desktop Header */}
            <header className="fixed top-0 z-40 hidden md:flex h-16 w-full items-center justify-between px-8 bg-background/80 backdrop-blur-2xl border-b border-border glare-top">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-sm group-hover:bg-primary/40 transition-all" />
                  <Image
                    src="/img/home/nav_ico.svg"
                    alt="Dev Hub Logo"
                    width={36}
                    height={36}
                    className="relative rounded-lg shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-primary transition-colors">
                  DEV HUB
                </span>
              </Link>

              <div className="flex items-center">
                <MainNav />
              </div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </header>

            {/* Mobile Navbar (Floating) */}
            <div className="md:hidden">
              <MobileMenu />
            </div>

            <main className="w-full flex-1">
              {children}
            </main>

            <Footer footer={footerData} />
            <ScrollToTop />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
