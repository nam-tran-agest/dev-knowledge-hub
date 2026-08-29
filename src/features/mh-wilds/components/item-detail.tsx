import React from 'react';
import { Package, Hammer } from 'lucide-react';
import type { Item } from '../types';
import { DrawerLayout, Section, DETAIL_PANEL_CLS } from './detail-drawers';

export function ItemDetail({ item, onClose }: { item: Item, onClose: () => void }) {
    return (
        <DrawerLayout
            title={item.name}
            icon={<Package className="w-5 h-5 text-primary" />}
            subtitle={<span className="text-primary font-mono text-xs uppercase font-bold">// Rarity {item.rarity}</span>}
            onClose={onClose}
        >
            <p className={`text-primary/80 font-mono leading-relaxed text-xs ${DETAIL_PANEL_CLS}`}>// {item.description}</p>

            <div className="grid grid-cols-2 gap-3 mt-3 font-mono">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1.5">// ITEM_VALUE</p>
                    <p className="text-amber-400 font-bold text-base">{item.value} <span className="text-[10px] text-primary/60">zenny</span></p>
                </div>
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1.5">// CARRY_LIMIT</p>
                    <p className="text-white font-bold text-base">{item.carryLimit}</p>
                </div>
            </div>

            {item.recipes?.length > 0 ? (
                <Section title="CRAFTING RECIPES">
                    <div className="space-y-2 font-mono">
                        {item.recipes.map(recipe => (
                            <div key={recipe.id} className={`${DETAIL_PANEL_CLS} flex flex-col gap-2`}>
                                <div className="flex items-center gap-1.5 text-[10px] text-primary uppercase tracking-widest font-bold">
                                    <Hammer className="w-3 h-3" /> Yields {recipe.amount}x
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {recipe.inputs.map((input, idx) => (
                                        <React.Fragment key={input.id}>
                                            <div className="flex items-center gap-1.5 bg-[#050714] border border-primary/20 px-2.5 py-1.5 cyber-clip-button text-xs">
                                                <Package className="w-3.5 h-3.5 text-primary/60" />
                                                <span className="font-medium text-slate-200 uppercase">{input.name}</span>
                                            </div>
                                            {idx < recipe.inputs.length - 1 && (
                                                <span className="text-primary font-bold text-sm px-0.5">+</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    <span className="text-primary/70 font-bold text-sm px-1">=</span>
                                    <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/40 px-2.5 py-1.5 cyber-clip-button text-xs">
                                        <Package className="w-3.5 h-3.5 text-primary" />
                                        <span className="font-bold text-primary uppercase">{item.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            ) : (
                <Section title="ACQUISITION">
                    <p className="text-xs text-primary/60 font-mono uppercase">// No crafting recipes indexed. Sourced directly in biome exploration or quest telemetry.</p>
                </Section>
            )}
        </DrawerLayout>
    );
}
