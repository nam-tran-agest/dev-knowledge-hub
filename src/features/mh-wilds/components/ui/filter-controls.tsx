import { ArrowUpDown } from 'lucide-react';
import type { Weapon } from '../../types';
import { SORT_OPTIONS, WEAPON_KIND_LABELS, type SortOption } from '../../constants';
import type { Category } from '../../hooks/use-mhwilds-filters';

interface FilterControlsProps {
    activeCategory: Category;
    sortBy: SortOption;
    setSortBy: (v: SortOption) => void;
    setPage: (p: number) => void;
    currentData: unknown[];
    // Monster filters
    monsterKindFilter: string;
    setMonsterKindFilter: (v: string) => void;
    monsterWeaknessFilter: string;
    setMonsterWeaknessFilter: (v: string) => void;
    monsterWeaknesses: string[];
    groupBySpecies: boolean;
    setGroupBySpecies: (v: boolean) => void;
    // Weapon filters
    weaponTypeFilter: string;
    setWeaponTypeFilter: (v: string) => void;
    weaponElementFilter: string;
    setWeaponElementFilter: (v: string) => void;
    weaponTypes: string[];
    weaponElements: string[];
    groupByWeaponType: boolean;
    setGroupByWeaponType: (v: boolean) => void;
    // Skill filter
    skillKindFilter: string;
    setSkillKindFilter: (v: string) => void;
    // Deco filter
    decoSlotFilter: string;
    setDecoSlotFilter: (v: string) => void;
}

export function FilterControls(props: FilterControlsProps) {
    const {
        activeCategory, sortBy, setSortBy, setPage, currentData,
        monsterKindFilter, setMonsterKindFilter, monsterWeaknessFilter, setMonsterWeaknessFilter,
        monsterWeaknesses, groupBySpecies, setGroupBySpecies,
        weaponTypeFilter, setWeaponTypeFilter, weaponElementFilter, setWeaponElementFilter,
        weaponTypes, weaponElements, groupByWeaponType, setGroupByWeaponType,
        skillKindFilter, setSkillKindFilter,
        decoSlotFilter, setDecoSlotFilter,
    } = props;

    return (
        <div className="flex flex-wrap gap-2">
            {/* Sort dropdown — always visible */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg px-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortOption); setPage(1); }} className="bg-transparent text-sm text-slate-300 py-2 focus:outline-none cursor-pointer">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            {/* Monster filters */}
            {activeCategory === 'monsters' && (
                <>
                    <select value={monsterKindFilter} onChange={e => { setMonsterKindFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
                        <option value="all">All Sizes</option>
                        <option value="large">🔴 Large</option>
                        <option value="small">⚪ Small</option>
                    </select>
                    <select value={monsterWeaknessFilter} onChange={e => { setMonsterWeaknessFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 capitalize">
                        <option value="all">Any Weakness</option>
                        {monsterWeaknesses.map(w => (
                            <option key={w} value={w}>{w}</option>
                        ))}
                    </select>
                    <button onClick={() => setGroupBySpecies(!groupBySpecies)} className={`text-xs px-3 py-2 rounded-lg border transition-colors font-medium ${groupBySpecies ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border-white/5'}`}>
                        Group by Species
                    </button>
                </>
            )}

            {/* Weapon filters */}
            {activeCategory === 'weapons' && (
                <>
                    {weaponTypes.length > 0 && (
                        <select value={weaponTypeFilter} onChange={e => { setWeaponTypeFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
                            <option value="all">All Types ({(currentData as Weapon[]).length})</option>
                            {weaponTypes.map(t => <option key={t} value={t}>{WEAPON_KIND_LABELS[t] || t}</option>)}
                        </select>
                    )}
                    <select value={weaponElementFilter} onChange={e => { setWeaponElementFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 capitalize">
                        <option value="all">Any Element/Status</option>
                        {weaponElements.map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                    <button onClick={() => setGroupByWeaponType(!groupByWeaponType)} className={`text-xs px-3 py-2 rounded-lg border transition-colors font-medium ${groupByWeaponType ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.03] text-slate-400 border-white/5'}`}>
                        Group by Type
                    </button>
                </>
            )}

            {/* Skill filter */}
            {activeCategory === 'skills' && (
                <select value={skillKindFilter} onChange={e => { setSkillKindFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
                    <option value="all">All Kinds</option>
                    <option value="armor">🛡 Armor</option>
                    <option value="weapon">⚔ Weapon</option>
                    <option value="set-bonus">💎 Set Bonus</option>
                    <option value="group-bonus">👥 Group Bonus</option>
                </select>
            )}

            {/* Deco filter */}
            {activeCategory === 'decorations' && (
                <select value={decoSlotFilter} onChange={e => { setDecoSlotFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
                    <option value="all">All Slots</option>
                    <option value="1">◆ Slot [1]</option>
                    <option value="2">◆◆ Slot [2]</option>
                    <option value="3">◆◆◆ Slot [3]</option>
                </select>
            )}
        </div>
    );
}
