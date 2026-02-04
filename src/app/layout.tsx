import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CC_STYLES } from "@/lib/constants";
import { MainNav } from "@/components/layout/main-nav";
import { FooterData } from '@/types/base';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/common/ui/navigation/ScrollToTop';
import Image from "next/image";
import { t, tObject } from "@/lib/i18n";




const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: t("layout.metadata.title"),
  description: t("layout.metadata.description"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} font-serif antialiased bg-main-gradient`}>
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
            <main className="max-w-7xl mx-auto">
              {children}
            </main>
            <Footer footer={tObject<FooterData>("footer")} />
            <ScrollToTop />
          </div>
        </div>
      </body>
    </html>
  );
}
