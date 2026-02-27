import { Sword, Hammer } from 'lucide-react';
import type { Weapon } from '../types';
import { WEAPON_KIND_LABELS } from '../constants';
import { DrawerLayout, Section, StatRow, DETAIL_PANEL_CLS } from './detail-drawers';

export function WeaponDetail({ weapon, onClose }: { weapon: Weapon, onClose: () => void }) {
    return (
        <DrawerLayout
            title={weapon.name}
            icon={<Sword className="w-6 h-6 text-orange-400" />}
            subtitle={<p className="text-xs text-slate-400">{WEAPON_KIND_LABELS[weapon.kind] || weapon.kind}</p>}
            onClose={onClose}
        >
            <div className="grid grid-cols-2 gap-4">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Base Stats</p>
                    <StatRow label="Damage (Raw)" value={weapon.damage.raw} />
                    <StatRow label="Damage (Display)" value={weapon.damage.display} />
                    <StatRow label="Affinity" value={`${weapon.affinity}%`} />
                    <StatRow label="Defense Bonus" value={weapon.defenseBonus} />
                </div>

                <div className={DETAIL_PANEL_CLS}>
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
                    <div className={`${DETAIL_PANEL_CLS} p-5 relative overflow-hidden`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="space-y-4 relative z-10">
                            {weapon.crafting.craftable && (
                                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2">
                                    <Hammer className="w-3 h-3" /> Directly Craftable
                                </div>
                            )}

                            {weapon.crafting.previous && (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 p-3 bg-[#1c1816]/60 border border-[#c8a97e]/15 rounded-lg opacity-70">
                                        <div className="w-8 h-8 rounded bg-[#c8a97e]/10 flex items-center justify-center shrink-0">
                                            <Sword className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Upgrades From</p>
                                            <p className="text-sm text-slate-300 font-bold">{weapon.crafting.previous.name}</p>
                                        </div>
                                    </div>
                                    <div className="w-0.5 h-6 bg-orange-500/30 ml-7" />
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
                                    <Sword className="w-4 h-4 text-orange-400" />
                                </div>
                                <p className="text-sm font-bold text-orange-400">{weapon.name}</p>
                            </div>

                            {weapon.crafting.branches?.length > 0 && (
                                <div className="flex flex-col mt-4">
                                    <div className="w-0.5 h-6 bg-orange-500/30 ml-7" />
                                    <div className="space-y-2 mt-1 pl-4 border-l-2 border-white/10 ml-7 relative before:absolute before:-top-1 before:left-[-2px] before:w-2 before:h-2 before:bg-orange-500 before:rounded-full">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 ml-2">Upgrades To</p>
                                        {weapon.crafting.branches.map((b) => (
                                            <div key={b.id} className="relative flex items-center gap-3 p-3 bg-[#1c1816]/60 border border-[#c8a97e]/15 rounded-lg ml-2 hover:bg-[#c8a97e]/10 transition-colors">
                                                <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-[#c8a97e]/30" />
                                                <div className="w-8 h-8 rounded bg-[#c8a97e]/10 flex items-center justify-center shrink-0">
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
