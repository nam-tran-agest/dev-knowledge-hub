import { Sword, Hammer } from 'lucide-react';
import type { Weapon } from '../types';
import { WEAPON_KIND_LABELS } from '../constants';
import { DrawerLayout, Section, StatRow, DETAIL_PANEL_CLS } from './detail-drawers';

export function WeaponDetail({ weapon, onClose }: { weapon: Weapon, onClose: () => void }) {
    return (
        <DrawerLayout
            title={weapon.name}
            icon={<Sword className="w-5 h-5 text-primary" />}
            subtitle={<p className="text-xs text-primary/60 font-mono uppercase">// {WEAPON_KIND_LABELS[weapon.kind] || weapon.kind}</p>}
            onClose={onClose}
        >
            <div className="grid grid-cols-2 gap-3 font-mono">
                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2">// BASE_PARAMETERS</p>
                    <StatRow label="Damage (Raw)" value={weapon.damage.raw} />
                    <StatRow label="Damage (Disp)" value={weapon.damage.display} />
                    <StatRow label="Affinity" value={`${weapon.affinity}%`} />
                    <StatRow label="Defense Bonus" value={weapon.defenseBonus} />
                </div>

                <div className={DETAIL_PANEL_CLS}>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2">// PROPERTIES</p>
                    <StatRow label="Rarity" value={<span className="text-primary font-bold">R{weapon.rarity}</span>} />
                    <StatRow label="Elderseal" value={weapon.elderseal ? <span className="capitalize">{weapon.elderseal}</span> : 'None'} />
                    <StatRow label="Slots" value={
                        weapon.slots.length > 0
                            ? <span className="text-primary tracking-widest">{weapon.slots.map(s => '◆'.repeat(s)).join(' ')}</span>
                            : 'None'
                    } />
                </div>
            </div>

            {weapon.specials?.length > 0 && (
                <Section title="ELEMENTS & STATUSES">
                    <div className="flex gap-2 flex-wrap font-mono">
                        {weapon.specials.map(sp => {
                            const val = sp.element || sp.status || '';
                            return (
                                <span key={sp.id} className={`px-2.5 py-1 cyber-clip-tag text-xs font-bold border ${sp.hidden ? 'opacity-50 grayscale' : ''} bg-primary/10 border-primary/30 text-primary uppercase`}>
                                    {val} : {sp.damage.display} {sp.hidden ? '(Hidden)' : ''}
                                </span>
                            );
                        })}
                    </div>
                </Section>
            )}

            {weapon.crafting && (
                <Section title="CRAFTING TREE">
                    <div className={`${DETAIL_PANEL_CLS} p-4 font-mono`}>
                        <div className="space-y-3">
                            {weapon.crafting.craftable && (
                                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 cyber-clip-tag mb-1">
                                    <Hammer className="w-3 h-3" /> [ DIRECTLY_CRAFTABLE ]
                                </div>
                            )}

                            {weapon.crafting.previous && (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 p-2.5 bg-surface border border-primary/20 cyber-clip-button opacity-70">
                                        <div className="w-7 h-7 cyber-clip-button bg-primary/10 flex items-center justify-center shrink-0">
                                            <Sword className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div>
                                             <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">// UPGRADES_FROM</p>
                                             <p className="text-xs text-slate-200 font-bold uppercase">{weapon.crafting.previous.name}</p>
                                        </div>
                                    </div>
                                    <div className="w-0.5 h-4 bg-primary/30 ml-6" />
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-2.5 bg-primary/15 border border-primary cyber-clip-button shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                <div className="w-7 h-7 cyber-clip-button bg-primary/20 flex items-center justify-center shrink-0">
                                    <Sword className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <p className="text-xs font-bold text-white uppercase">{weapon.name}</p>
                            </div>

                            {weapon.crafting.branches?.length > 0 && (
                                <div className="flex flex-col mt-2">
                                    <div className="w-0.5 h-4 bg-primary/30 ml-6" />
                                    <div className="space-y-1.5 mt-1 pl-3 border-l-2 border-primary/30 ml-6">
                                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold mb-1">// UPGRADES_TO</p>
                                        {weapon.crafting.branches.map((b) => (
                                            <div key={b.id} className="flex items-center gap-2.5 p-2 bg-surface border border-primary/20 cyber-clip-button hover:border-primary transition-colors">
                                                <div className="w-6 h-6 cyber-clip-button bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Sword className="w-3 h-3 text-primary" />
                                                </div>
                                                <p className="text-xs text-slate-300 font-bold uppercase">{b.name}</p>
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
