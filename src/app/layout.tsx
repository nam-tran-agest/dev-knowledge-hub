import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dev Knowledge Hub",
  description: "Personal knowledge base, snippets, tasks, and bug tracker for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {/* Decorative blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Main Content */}
          <div className="flex-1 lg:ml-64">
            <Header />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
