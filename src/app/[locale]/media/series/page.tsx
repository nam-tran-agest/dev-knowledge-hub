import { getTranslations } from 'next-intl/server';

export default async function SeriesPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const tNav = await getTranslations({ locale, namespace: 'navigation.items.media' });

    return (
        <div className="min-h-screen pt-32 bg-[#050505] flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-600 tracking-tighter">
                    {tNav('items.series')}
                </h1>
                <p className="text-slate-500 text-lg">
                    Your TV series collection will be organized here shortly.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl opacity-20 pointer-events-none">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="aspect-[16/9] rounded-lg bg-white/5 border border-white/10" />
                ))}
            </div>
        </div>
    );
}
