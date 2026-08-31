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
                <img src={getArmorKindIconUrl(armor.kind, armor.rarity)} alt={armor.kind} className="w-5 h-5 object-contain" />
            }
            subtitle={
                <div className="flex items-center gap-2 mt-0.5 font-mono">
                    <span className="text-xs text-primary/70 uppercase">// {armor.kind}</span>
                    <span className="text-primary/40">·</span>
                    <span className="text-xs text-primary font-bold">R{armor.rarity}</span>
                    {armor.armorSet && (
                        <>
                            <span className="text-primary/40">·</span>
                            <span className="text-xs text-secondary-foreground">{armor.armorSet.name}</span>
                        </>
                    )}
                </div>
            }
            onClose={onClose}
        >
            {/* Defense & Slots */}
            <div className="grid grid-cols-2 gap-3 font-mono">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2">// DEFENSE</p>
                    <StatRow label="Base" value={<span className="text-white font-bold">{armor.defense?.base ?? 0}</span>} />
                    <StatRow label="Max" value={<span className="text-primary font-bold">{armor.defense?.max ?? 0}</span>} />
                </div>
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2">// PROPERTIES</p>
                    <StatRow label="Rank" value={<span className="uppercase text-primary font-bold">{armor.rank}</span>} />
                    <StatRow label="Slots" value={
                        armor.slots?.length > 0
                            ? <span className="text-primary tracking-widest">{armor.slots.map(s => '◆'.repeat(s)).join(' ')}</span>
                            : 'None'
                    } />
                </div>
            </div>

            {/* Elemental Resistances */}
            <Section title="ELEMENTAL RESISTANCES">
                <div className="grid grid-cols-5 gap-2 font-mono">
                    {resEntries.map(res => (
                        <div key={res.key} className="bg-[#04060f]/80 border border-primary/20 cyber-clip-button p-2 text-center">
                            <span className="text-base">{res.icon}</span>
                            <p className={`text-xs font-bold mt-0.5 ${res.value > 0 ? 'text-primary' : res.value < 0 ? 'text-destructive' : 'text-primary/40'}`}>
                                {res.value > 0 ? '+' : ''}{res.value}
                            </p>
                            <p className="text-[8px] text-primary/60 uppercase tracking-wider mt-0.5">{res.label}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Skills */}
            {armor.skills?.length > 0 && (
                <Section title="SKILL MATRIX">
                    <div className="space-y-1.5 font-mono">
                        {armor.skills.map(s => (
                            <div key={s.id} className="flex gap-2.5 bg-[#04060f]/80 border border-primary/20 cyber-clip-button p-2.5">
                                <span className="shrink-0 text-center font-bold text-primary bg-primary/10 border border-primary/30 cyber-clip-tag px-2 py-0.5 text-[10px]">Lv {s.level}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-white uppercase">{s.skill.name}</p>
                                    {s.description && <p className="text-[11px] text-primary/60 mt-0.5">{s.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Crafting Materials */}
            {armor.crafting && armor.crafting.materials?.length > 0 && (
                <Section title="REQUIRED REAGENTS">
                    <div className={`${DETAIL_PANEL_CLS} font-mono`}>
                        <div className="space-y-1.5">
                            {armor.crafting.materials.map(mat => (
                                <div key={mat.id} className="flex items-center justify-between text-xs bg-surface border border-primary/20 cyber-clip-button px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-slate-200 uppercase">{mat.item.name}</span>
                                    </div>
                                    <span className="text-primary font-bold">×{mat.quantity}</span>
                                </div>
                            ))}
                        </div>
                        {armor.crafting.zennyCost > 0 && (
                            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-primary/20 text-xs">
                                <span className="text-primary/60 uppercase">// ZENNY_COST</span>
                                <span className="text-amber-400 font-bold">{armor.crafting.zennyCost.toLocaleString()}z</span>
                            </div>
                        )}
                    </div>
                </Section>
            )}
        </DrawerLayout>
    );
}
