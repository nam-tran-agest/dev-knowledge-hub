import type { Decoration } from '../../types';
import { RarityDots, GridLayout } from '../ui/shared';
import { CARD_CLS, getDecorationIconUrl } from '../../constants';

const slotDiamonds = (s: number) => '◆'.repeat(s) + '◇'.repeat(3 - s);

export function DecorationsGrid({ decorations }: { decorations: Decoration[] }) {
    return (
        <GridLayout>
            {decorations.map(deco => (
                <div key={deco.id} className={`${CARD_CLS} p-4 group flex flex-col h-full`}>
                    <div className="flex items-start gap-3 mb-2 shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getDecorationIconUrl(deco.slot)} alt={deco.name} className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{deco.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-amber-400 text-sm tracking-wider">{slotDiamonds(deco.slot)}</span>
                                <RarityDots rarity={deco.rarity} />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-2 flex-1">{deco.description}</p>
                    <div className="flex gap-1.5 flex-wrap mt-auto pt-2 border-t border-white/[0.02]">
                        {deco.skills.map(sk => (
                            <span key={sk.id} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">
                                {sk.skill.name} Lv{sk.level}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </GridLayout>
    );
}
