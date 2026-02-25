import { RARITY_COLORS } from '../../constants/shared';

export function RarityDots({ rarity }: { rarity: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: Math.min(rarity, 10) }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${RARITY_COLORS[rarity] || 'bg-slate-600'}`} />
            ))}
        </div>
    );
}
