import { Package } from 'lucide-react';
import type { Item } from '../../types';
import { RarityDots, GridLayout } from '../ui/shared';
import { CARD_CLS } from '../../constants';

interface ItemsGridProps {
    items: Item[];
    onSelect: (i: Item) => void;
}

const iconColorMap: Record<string, string> = {
    green: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/15 border-blue-500/20 text-blue-400',
    red: 'bg-red-500/15 border-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/15 border-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/15 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/15 border-orange-500/20 text-orange-400',
    white: 'bg-white/5 border-white/10 text-slate-300',
    gray: 'bg-white/5 border-white/10 text-slate-400',
};

export function ItemsGrid({ items, onSelect }: ItemsGridProps) {
    return (
        <GridLayout>
            {items.map(item => {
                const iconColor = iconColorMap[item.icon?.color || ''] || 'bg-white/5 border-white/10 text-slate-400';
                return (
                    <div key={item.id} className={`${CARD_CLS} p-4 group flex flex-col h-full cursor-pointer`} onClick={() => onSelect(item)}>
                        <div className="flex items-start gap-3 mb-2 shrink-0">
                            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${iconColor}`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                                <RarityDots rarity={item.rarity} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-2 flex-1">{item.description}</p>
                        <div className="flex items-center gap-3 text-xs mt-auto pt-2 border-t border-white/[0.02]">
                            <span className="text-amber-400 font-bold">{item.value}z</span>
                            <span className="text-slate-600">Carry: {item.carryLimit}</span>
                            {item.recipes.length > 0 && <span className="text-emerald-500 font-bold">⚒ Craftable</span>}
                        </div>
                    </div>
                );
            })}
        </GridLayout>
    );
}
