import type { Decoration } from '../../types';
import { RarityDots, GridLayout } from '../ui/shared';
import { CARD_CLS, getDecorationIconUrl } from '../../constants';

const slotDiamonds = (s: number) => '◆'.repeat(s) + '◇'.repeat(3 - s);

export function DecorationsGrid({ decorations }: { decorations: Decoration[] }) {
    return (
        <GridLayout>
            {decorations.map(deco => (
                <div key={deco.id} className={`${CARD_CLS} p-4 group flex flex-col h-full font-mono`}>
                    <div className="flex items-start gap-3 mb-2 shrink-0">
                        <div className="w-10 h-10 cyber-clip-button bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getDecorationIconUrl(deco.slot)} alt={deco.name} className="w-5 h-5 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors uppercase">{deco.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-primary text-xs tracking-wider">{slotDiamonds(deco.slot)}</span>
                                <RarityDots rarity={deco.rarity} />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-primary/60 mb-2 flex-1 line-clamp-2">{deco.description}</p>
                    <div className="flex gap-1.5 flex-wrap mt-auto pt-2 border-t border-primary/20">
                        {deco.skills.map(sk => (
                            <span key={sk.id} className="text-[10px] bg-primary/10 text-primary border border-primary/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">
                                {sk.skill.name} Lv{sk.level}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </GridLayout>
    );
}
