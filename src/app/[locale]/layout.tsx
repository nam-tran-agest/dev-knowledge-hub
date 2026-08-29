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
            <header className="fixed top-0 z-40 hidden md:flex h-16 w-full items-center justify-between px-8 bg-[#04060f]/90 backdrop-blur-2xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              {/* Top Neon Glare Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              
              {/* Corner Tech Brackets */}
              <div className="absolute bottom-0 left-4 w-4 h-1 border-l-2 border-b-2 border-primary/50" />
              <div className="absolute bottom-0 right-4 w-4 h-1 border-r-2 border-b-2 border-primary/50" />

              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 cyber-clip bg-primary/30 blur-sm group-hover:bg-primary/50 transition-all" />
                  <div className="relative p-1.5 cyber-clip bg-card border border-primary/40 group-hover:border-primary transition-colors">
                    <Image
                      src="/img/home/nav_ico.svg"
                      alt="Dev Hub Logo"
                      width={24}
                      height={24}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-sm tracking-widest text-white group-hover:text-primary transition-colors uppercase">
                    DEV_HUB <span className="text-primary text-xs">// SYS</span>
                  </span>
                  <span className="font-mono text-[9px] text-primary/60 tracking-wider">
                    TERMINAL_ONLINE
                  </span>
                </div>
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
