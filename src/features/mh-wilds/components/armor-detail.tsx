import { Package } from 'lucide-react';
import type { Armor } from '../types';
import { getArmorKindIconUrl } from '../constants';
import { DrawerLayout, Section, StatRow, DETAIL_PANEL_CLS } from './detail-drawers';

export function ArmorDetail({ armor, onClose }: { armor: Armor, onClose: () => void }) {
    const resEntries = [
        { key: 'fire', icon: '🔥', label: 'Fire', value: armor.resistances?.fire ?? 0 },
        { key: 'water', icon: '💧', label: 'Water', value: armor.resistances?.water ?? 0 },
        { key: 'thunder', icon: '⚡', label: 'Thunder', value: armor.resistances?.thunder ?? 0 },
        { key: 'ice', icon: '❄️', label: 'Ice', value: armor.resistances?.ice ?? 0 },
        { key: 'dragon', icon: '🐉', label: 'Dragon', value: armor.resistances?.dragon ?? 0 },
    ];

    return (
        <DrawerLayout
            title={armor.name}
            icon={
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getArmorKindIconUrl(armor.kind, armor.rarity)} alt={armor.kind} className="w-6 h-6 object-contain" />
            }
            subtitle={
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400 capitalize">{armor.kind}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs text-amber-400 font-bold">Rarity {armor.rarity}</span>
                    {armor.armorSet && (
                        <>
                            <span className="text-slate-600">·</span>
                            <span className="text-xs text-blue-400">{armor.armorSet.name}</span>
                        </>
                    )}
                </div>
            }
            onClose={onClose}
        >
            {/* Defense & Slots */}
            <div className="grid grid-cols-2 gap-4">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Defense</p>
                    <StatRow label="Base" value={<span className="text-white font-bold">{armor.defense?.base ?? 0}</span>} />
                    <StatRow label="Max" value={<span className="text-emerald-400 font-bold">{armor.defense?.max ?? 0}</span>} />
                </div>
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Properties</p>
                    <StatRow label="Rank" value={<span className="capitalize text-amber-400">{armor.rank}</span>} />
                    <StatRow label="Slots" value={
                        armor.slots?.length > 0
                            ? <span className="text-cyan-400 tracking-widest">{armor.slots.map(s => '◆'.repeat(s)).join(' ')}</span>
                            : 'None'
                    } />
                </div>
            </div>

            {/* Elemental Resistances */}
            <Section title="Elemental Resistances">
                <div className="grid grid-cols-5 gap-2">
                    {resEntries.map(res => (
                        <div key={res.key} className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 text-center">
                            <span className="text-lg">{res.icon}</span>
                            <p className={`text-sm font-bold mt-1 ${res.value > 0 ? 'text-emerald-400' : res.value < 0 ? 'text-red-400' : 'text-slate-600'}`}>
                                {res.value > 0 ? '+' : ''}{res.value}
                            </p>
                            <p className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">{res.label}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Skills */}
            {armor.skills?.length > 0 && (
                <Section title="Skills">
                    <div className="space-y-2">
                        {armor.skills.map(s => (
                            <div key={s.id} className="flex gap-3 bg-white/[0.04] border border-white/[0.08] rounded-lg p-3">
                                <span className="shrink-0 w-10 text-center font-bold text-emerald-400 bg-emerald-500/10 rounded py-1 text-xs">Lv {s.level}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white">{s.skill.name}</p>
                                    {s.description && <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Crafting Materials */}
            {armor.crafting && armor.crafting.materials?.length > 0 && (
                <Section title="Crafting Materials">
                    <div className={`${DETAIL_PANEL_CLS} relative overflow-hidden`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="space-y-2 relative z-10">
                            {armor.crafting.materials.map(mat => (
                                <div key={mat.id} className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-200 font-medium">{mat.item.name}</span>
                                    </div>
                                    <span className="text-amber-400 font-bold">×{mat.quantity}</span>
                                </div>
                            ))}
                        </div>
                        {armor.crafting.zennyCost > 0 && (
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs relative z-10">
                                <span className="text-slate-500">Zenny Cost</span>
                                <span className="text-amber-400 font-bold">{armor.crafting.zennyCost.toLocaleString()}z</span>
                            </div>
                        )}
                    </div>
                </Section>
            )}
        </DrawerLayout>
    );
}
