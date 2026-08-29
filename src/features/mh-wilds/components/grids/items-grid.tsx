import { Package } from 'lucide-react';
import type { Item } from '../../types';
import { RarityDots, GridLayout } from '../ui/shared';
import { CARD_CLS } from '../../constants';

interface ItemsGridProps {
    items: Item[];
    onSelect: (i: Item) => void;
}

const iconColorMap: Record<string, string> = {
    green: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    blue: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    red: 'bg-destructive/15 border-destructive/30 text-destructive',
    yellow: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
    purple: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    orange: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    white: 'bg-primary/10 border-primary/30 text-primary',
    gray: 'bg-primary/5 border-primary/20 text-primary/60',
};

export function ItemsGrid({ items, onSelect }: ItemsGridProps) {
    return (
        <GridLayout>
            {items.map(item => {
                const iconColor = iconColorMap[item.icon?.color || ''] || 'bg-primary/10 border-primary/30 text-primary';
                return (
                    <div key={item.id} className={`${CARD_CLS} p-4 group flex flex-col h-full cursor-pointer font-mono`} onClick={() => onSelect(item)}>
                        <div className="flex items-start gap-3 mb-2 shrink-0">
                            <div className={`w-10 h-10 cyber-clip-button border flex items-center justify-center shrink-0 ${iconColor}`}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors uppercase">{item.name}</h3>
                                <RarityDots rarity={item.rarity} />
                            </div>
                        </div>
                        <p className="text-xs text-primary/60 line-clamp-2 mb-2 flex-1">{item.description}</p>
                        <div className="flex items-center gap-3 text-[10px] mt-auto pt-2 border-t border-primary/20 text-primary/70">
                            <span className="text-amber-400 font-bold">{item.value}z</span>
                            <span>CARRY: {item.carryLimit}</span>
                            {item.recipes.length > 0 && <span className="text-primary font-bold">[ CRAFTABLE ]</span>}
                        </div>
                    </div>
                );
            })}
        </GridLayout>
    );
}
