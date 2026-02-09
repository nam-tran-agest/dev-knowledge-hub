import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function BookmarksPage({
    params
}: {
    params: Promise<{ locale: string; category?: string[] }>;
}) {
    const { locale, category: categoryParam } = await params;
    const category = categoryParam?.[0] || 'all';

    const validCategories = ['all', 'work', 'learn', 'inspire', 'life', 'fun'];
    if (!validCategories.includes(category)) {
        notFound();
    }

    const tNav = await getTranslations({ locale, namespace: 'navigation.items.bookmarks' });

    return (
        <div className="min-h-screen pt-32 bg-[#050505] flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                    {category === 'all' ? tNav('label') : tNav(`items.${category}`)}
                </h1>
                <p className="text-slate-500 text-lg">
                    This module is currently under development. Stay tuned for a premium bookmarking experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl opacity-40 pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/10" />
                ))}
            </div>
        </div>
    );
}
