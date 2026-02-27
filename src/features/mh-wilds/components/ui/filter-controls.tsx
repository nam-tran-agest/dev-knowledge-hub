import { ArrowUpDown } from 'lucide-react';
import type { Weapon } from '../../types';
import { SORT_OPTIONS, WEAPON_KIND_LABELS, type SortOption } from '../../constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category } from '../../hooks/use-mhwilds-filters';

interface FilterControlsProps {
    activeCategory: Category;
    currentData: unknown[];
    filters: {
        sortBy: SortOption;
        setSortBy: (v: SortOption) => void;
        setPage: (p: number) => void;
        monsterKindFilter: string;
        setMonsterKindFilter: (v: string) => void;
        monsterWeaknessFilter: string;
        setMonsterWeaknessFilter: (v: string) => void;
        monsterWeaknesses: string[];
        groupBySpecies: boolean;
        setGroupBySpecies: (v: boolean) => void;
        weaponTypeFilter: string;
        setWeaponTypeFilter: (v: string) => void;
        weaponElementFilter: string;
        setWeaponElementFilter: (v: string) => void;
        weaponTypes: string[];
        weaponElements: string[];
        groupByWeaponType: boolean;
        setGroupByWeaponType: (v: boolean) => void;
        skillKindFilter: string;
        setSkillKindFilter: (v: string) => void;
        decoSlotFilter: string;
        setDecoSlotFilter: (v: string) => void;
    };
}

const triggerCls = 'h-9 bg-white/[0.08] border-white/[0.12] text-slate-300 text-sm focus:ring-emerald-500/30 [&>svg]:text-slate-500';
const contentProps = { className: 'bg-[#161b24] border-white/[0.12] backdrop-blur-xl', side: 'bottom' as const, sideOffset: 4 };
const itemCls = 'text-slate-300 focus:bg-emerald-500/15 focus:text-emerald-300';
const toggleCls = (active: boolean) => `text-xs px-3 py-2 rounded-lg border transition-colors font-medium cursor-pointer ${active ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.08] text-slate-400 border-white/[0.12] hover:text-white'}`;

export function FilterControls({ activeCategory, currentData, filters: f }: FilterControlsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* Sort */}
            <Select value={f.sortBy} onValueChange={(v) => { f.setSortBy(v as SortOption); f.setPage(1); }}>
                <SelectTrigger className={`w-[140px] ${triggerCls}`}>
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent {...contentProps}>
                    {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className={itemCls}>{o.label}</SelectItem>)}
                </SelectContent>
            </Select>

            {/* Monster filters */}
            {activeCategory === 'monsters' && (
                <>
                    <Select value={f.monsterKindFilter} onValueChange={(v) => { f.setMonsterKindFilter(v); f.setPage(1); }}>
                        <SelectTrigger className={`w-[130px] ${triggerCls}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent {...contentProps}>
                            <SelectItem value="all" className={itemCls}>All Sizes</SelectItem>
                            <SelectItem value="large" className={itemCls}>🔴 Large</SelectItem>
                            <SelectItem value="small" className={itemCls}>⚪ Small</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={f.monsterWeaknessFilter} onValueChange={(v) => { f.setMonsterWeaknessFilter(v); f.setPage(1); }}>
                        <SelectTrigger className={`w-[160px] ${triggerCls} capitalize`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent {...contentProps}>
                            <SelectItem value="all" className={itemCls}>Any Weakness</SelectItem>
                            {f.monsterWeaknesses.map(w => <SelectItem key={w} value={w} className={`${itemCls} capitalize`}>{w}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <button onClick={() => f.setGroupBySpecies(!f.groupBySpecies)} className={toggleCls(f.groupBySpecies)}>
                        Group by Species
                    </button>
                </>
            )}

            {/* Weapon filters */}
            {activeCategory === 'weapons' && (
                <>
                    {f.weaponTypes.length > 0 && (
                        <Select value={f.weaponTypeFilter} onValueChange={(v) => { f.setWeaponTypeFilter(v); f.setPage(1); }}>
                            <SelectTrigger className={`w-[180px] ${triggerCls}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent {...contentProps}>
                                <SelectItem value="all" className={itemCls}>All Types ({(currentData as Weapon[]).length})</SelectItem>
                                {f.weaponTypes.map(t => <SelectItem key={t} value={t} className={itemCls}>{WEAPON_KIND_LABELS[t] || t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={f.weaponElementFilter} onValueChange={(v) => { f.setWeaponElementFilter(v); f.setPage(1); }}>
                        <SelectTrigger className={`w-[180px] ${triggerCls} capitalize`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent {...contentProps}>
                            <SelectItem value="all" className={itemCls}>Any Element/Status</SelectItem>
                            {f.weaponElements.map(e => <SelectItem key={e} value={e} className={`${itemCls} capitalize`}>{e}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <button onClick={() => f.setGroupByWeaponType(!f.groupByWeaponType)} className={toggleCls(f.groupByWeaponType)}>
                        Group by Type
                    </button>
                </>
            )}

            {/* Skill filter */}
            {activeCategory === 'skills' && (
                <Select value={f.skillKindFilter} onValueChange={(v) => { f.setSkillKindFilter(v); f.setPage(1); }}>
                    <SelectTrigger className={`w-[160px] ${triggerCls}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...contentProps}>
                        <SelectItem value="all" className={itemCls}>All Kinds</SelectItem>
                        <SelectItem value="armor" className={itemCls}>🛡 Armor</SelectItem>
                        <SelectItem value="weapon" className={itemCls}>⚔ Weapon</SelectItem>
                        <SelectItem value="set-bonus" className={itemCls}>💎 Set Bonus</SelectItem>
                        <SelectItem value="group-bonus" className={itemCls}>👥 Group Bonus</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {/* Deco filter */}
            {activeCategory === 'decorations' && (
                <Select value={f.decoSlotFilter} onValueChange={(v) => { f.setDecoSlotFilter(v); f.setPage(1); }}>
                    <SelectTrigger className={`w-[140px] ${triggerCls}`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent {...contentProps}>
                        <SelectItem value="all" className={itemCls}>All Slots</SelectItem>
                        <SelectItem value="1" className={itemCls}>◆ Slot [1]</SelectItem>
                        <SelectItem value="2" className={itemCls}>◆◆ Slot [2]</SelectItem>
                        <SelectItem value="3" className={itemCls}>◆◆◆ Slot [3]</SelectItem>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}
