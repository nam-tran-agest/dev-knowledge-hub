import React, { useEffect } from 'react';
import { X, Sword, Package, Star, Shield, Hammer } from 'lucide-react';
import type { Weapon, Item, Skill, Armor } from '../types';
import { WEAPON_KIND_LABELS } from '../constants/shared';
import { getArmorKindIconUrl } from '../constants/mh-icons';

// Helper for the slide-over
export function DrawerLayout({ title, icon, onClose, children, subtitle }: { title: string, icon: React.ReactNode, subtitle?: React.ReactNode, onClose: () => void, children: React.ReactNode }) {
    // Escape key to close & body scroll lock
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative h-full w-full max-w-xl bg-[#0a0a0c] border-l border-white/5 overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 z-10 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-white/5 p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            {subtitle && <div className="mt-1">{subtitle}</div>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="p-6 space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}


function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">{title}</h4>
            {children}
        </div>
    );
}

function StatRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-200">{value}</span>
        </div>
    );
}

// === Weapon Detail ===
export function WeaponDetail({ weapon, onClose }: { weapon: Weapon, onClose: () => void }) {
    return (
        <DrawerLayout
            title={weapon.name}
            icon={<Sword className="w-6 h-6 text-orange-400" />}
            subtitle={<p className="text-xs text-slate-400">{WEAPON_KIND_LABELS[weapon.kind] || weapon.kind}</p>}
            onClose={onClose}
        >
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Base Stats</p>
                    <StatRow label="Damage (Raw)" value={weapon.damage.raw} />
                    <StatRow label="Damage (Display)" value={weapon.damage.display} />
                    <StatRow label="Affinity" value={`${weapon.affinity}%`} />
                    <StatRow label="Defense Bonus" value={weapon.defenseBonus} />
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Properties</p>
                    <StatRow label="Rarity" value={<span className="text-amber-400">Rarity {weapon.rarity}</span>} />
                    <StatRow label="Elderseal" value={weapon.elderseal ? <span className="capitalize">{weapon.elderseal}</span> : 'None'} />
                    <StatRow label="Slots" value={
                        weapon.slots.length > 0
                            ? <span className="text-cyan-400 tracking-widest">{weapon.slots.map(s => '◆'.repeat(s)).join(' ')}</span>
                            : 'None'
                    } />
                </div>
            </div>

            {weapon.specials?.length > 0 && (
                <Section title="Elements & Statuses">
                    <div className="flex gap-2 flex-wrap">
                        {weapon.specials.map(sp => {
                            const val = sp.element || sp.status || '';
                            return (
                                <span key={sp.id} className={`px-2.5 py-1 rounded-md text-xs font-bold border ${sp.hidden ? 'opacity-50 grayscale' : ''} bg-slate-500/10 border-slate-500/20 text-slate-300 capitalize`}>
                                    {val} : {sp.damage.display} {sp.hidden ? '(Hidden)' : ''}
                                </span>
                            );
                        })}
                    </div>
                </Section>
            )}

            {weapon.crafting && (
                <Section title="Crafting Path">
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 relative overflow-hidden">
                        {/* Background flare */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-4 relative z-10">
                            {weapon.crafting.craftable && (
                                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
                                    <Hammer className="w-3 h-3" /> Directly Craftable
                                </div>
                            )}

                            {/* Previous Node */}
                            {weapon.crafting.previous && (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-lg opacity-70">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                                            <Sword className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Upgrades From</p>
                                            <p className="text-sm text-slate-300 font-bold">{weapon.crafting.previous.name}</p>
                                        </div>
                                    </div>
                                    {/* Connecting Line */}
                                    <div className="w-0.5 h-6 bg-orange-500/30 ml-7" />
                                </div>
                            )}

                            {/* Current Node */}
                            <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                                    <Sword className="w-4 h-4 text-orange-400" />
                                </div>
                                <p className="text-sm font-bold text-orange-400">{weapon.name}</p>
                            </div>

                            {/* Branches (Next Nodes) */}
                            {weapon.crafting.branches?.length > 0 && (
                                <div className="flex flex-col mt-4">
                                    {/* Connecting Line Down */}
                                    <div className="w-0.5 h-6 bg-orange-500/30 ml-7" />

                                    <div className="space-y-2 mt-1 pl-4 border-l-2 border-white/10 ml-7 relative before:absolute before:-top-1 before:left-[-2px] before:w-2 before:h-2 before:bg-orange-500 before:rounded-full">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 ml-2">Upgrades To</p>
                                        {weapon.crafting.branches.map((b, i) => (
                                            <div key={b.id} className="relative flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-lg ml-2 hover:bg-white/[0.05] transition-colors">
                                                <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-white/10" />
                                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                                                    <Sword className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <p className="text-sm text-slate-300 font-bold">{b.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
            )}
        </DrawerLayout>
    );
}

// === Item Detail ===
export function ItemDetail({ item, onClose }: { item: Item, onClose: () => void }) {
    return (
        <DrawerLayout
            title={item.name}
            icon={<Package className="w-6 h-6 text-emerald-400" />}
            subtitle={<span className="text-amber-400 text-xs">Rarity {item.rarity}</span>}
            onClose={onClose}
        >
            <p className="text-slate-300 leading-relaxed text-sm bg-white/[0.02] border border-white/5 p-4 rounded-xl">{item.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Value</p>
                    <p className="text-amber-400 font-bold text-lg">{item.value} <span className="text-xs text-amber-400/50">zenny</span></p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Carry Limit</p>
                    <p className="text-white font-bold text-lg">{item.carryLimit}</p>
                </div>
            </div>

            {item.recipes?.length > 0 ? (
                <Section title="Crafting Recipes">
                    <div className="space-y-3">
                        {item.recipes.map(recipe => (
                            <div key={recipe.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
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

// === Skill Detail ===
export function SkillDetail({ skill, onClose }: { skill: Skill, onClose: () => void }) {
    return (
        <DrawerLayout
            title={skill.name}
            icon={<Star className="w-6 h-6 text-yellow-400" />}
            subtitle={<span className="text-slate-400 text-xs capitalize">{skill.kind.replace('-', ' ')}</span>}
            onClose={onClose}
        >
            <p className="text-slate-300 leading-relaxed text-sm bg-white/[0.02] border border-white/5 p-4 rounded-xl">{skill.description}</p>

            <Section title="Skill Levels">
                <div className="space-y-2">
                    {skill.ranks.map(r => (
                        <div key={r.id} className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-lg p-3">
                            <span className="shrink-0 w-10 text-center font-bold text-emerald-400 bg-emerald-500/10 rounded py-1 text-xs">Lv {r.level}</span>
                            <div className="flex-1">
                                {r.name && <p className="text-xs font-bold text-white mb-0.5">{r.name}</p>}
                                <p className="text-xs text-slate-300">{r.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </DrawerLayout>
    );
}

// === Armor Detail ===
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
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Defense</p>
                    <StatRow label="Base" value={<span className="text-white font-bold">{armor.defense?.base ?? 0}</span>} />
                    <StatRow label="Max" value={<span className="text-emerald-400 font-bold">{armor.defense?.max ?? 0}</span>} />
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
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
                        <div key={res.key} className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-center">
                            <span className="text-lg">{res.icon}</span>
                            <p className={`text-sm font-bold mt-1 ${res.value > 0 ? 'text-emerald-400' : res.value < 0 ? 'text-red-400' : 'text-slate-600'
                                }`}>
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
                            <div key={s.id} className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-lg p-3">
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
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 relative overflow-hidden">
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

