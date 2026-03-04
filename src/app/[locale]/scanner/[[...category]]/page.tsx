import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ScannerView } from '@/features/scanner/components/scanner-view';
import { MatrixRain } from '@/components/ui/matrix-rain';

export default async function ScannerPage({
    params
}: {
    params: Promise<{ locale: string; category?: string[] }>;
}) {
    const { locale, category: categoryParam } = await params;
    const category = categoryParam?.[0] || 'all';

    const validCategories = ['all', 'section-1', 'section-2', 'section-3'];
    if (!validCategories.includes(category)) {
        notFound();
    }

    const tNav = await getTranslations({ locale, namespace: 'navigation.items.scanner' });

    return (
        <div className="min-h-screen bg-[#0a0a0c] relative flex flex-col items-center">
            <MatrixRain />
            {/* Header / Title area */}
            <div className="w-full max-w-[1400px] pt-24 px-6 mb-[-2rem] relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mix-blend-lighten">
                    {category === 'all' ? tNav('label') : tNav(`items.${category.replace('-', '')}`)}
                </h1>
                <p className="text-slate-400 mt-2 text-lg mix-blend-lighten">
                    Extract text from images instantly using local OCR technology.
                </p>
            </div>

            {/* Main Scanner UI */}
            <div className="relative z-10">
                <ScannerView />
            </div>
        </div>
    );
}
