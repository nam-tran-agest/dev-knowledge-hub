import React from 'react';
import { Package, Hammer } from 'lucide-react';
import type { Item } from '../types';
import { DrawerLayout, Section, DETAIL_PANEL_CLS } from './detail-drawers';

export function ItemDetail({ item, onClose }: { item: Item, onClose: () => void }) {
    return (
        <DrawerLayout
            title={item.name}
            icon={<Package className="w-6 h-6 text-emerald-400" />}
            subtitle={<span className="text-amber-400 text-xs">Rarity {item.rarity}</span>}
            onClose={onClose}
        >
            <p className={`text-slate-300 leading-relaxed text-sm ${DETAIL_PANEL_CLS}`}>{item.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Value</p>
                    <p className="text-amber-400 font-bold text-lg">{item.value} <span className="text-xs text-amber-400/50">zenny</span></p>
                </div>
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Carry Limit</p>
                    <p className="text-white font-bold text-lg">{item.carryLimit}</p>
                </div>
            </div>

            {item.recipes?.length > 0 ? (
                <Section title="Crafting Recipes">
                    <div className="space-y-3">
                        {item.recipes.map(recipe => (
                            <div key={recipe.id} className={`${DETAIL_PANEL_CLS} flex flex-col gap-3 relative overflow-hidden`}>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">
                                    <Hammer className="w-3 h-3" /> Yields {recipe.amount}x
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {recipe.inputs.map((input, idx) => (
                                        <React.Fragment key={input.id}>
                                            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-2 rounded-lg relative z-10 shadow-sm">
                                                <Package className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-200">{input.name}</span>
                                            </div>
                                            {idx < recipe.inputs.length - 1 && (
                                                <span className="text-slate-500 font-bold text-lg px-1">+</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <span className="text-emerald-500/50 font-bold text-lg px-2">=</span>
                                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                        <Package className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-bold text-emerald-400">{item.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            ) : (
                <Section title="Acquisition">
                    <p className="text-xs text-slate-500">No crafting recipes available. Found in the environment or rewarded from quests.</p>
                </Section>
            )}
        </DrawerLayout>
    );
}
