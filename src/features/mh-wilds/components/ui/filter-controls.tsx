import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import type { Weapon } from '../../types';
import { SORT_OPTIONS, WEAPON_KIND_LABELS, type SortOption } from '../../constants';
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
        monsterKinds: string[];
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

const triggerCls = 'h-9 bg-[#1c1816]/60 border border-[#c8a97e]/15 text-slate-300 text-sm focus:ring-amber-500/30 [&>svg]:text-amber-700/50';
const contentCls = 'bg-[#151210]/95 border-[#c8a97e]/15 backdrop-blur-xl max-h-72';
const toggleCls = (active: boolean) => `text-xs px-3 py-2 rounded-lg border transition-all font-medium cursor-pointer ${active ? 'bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)]' : 'bg-[#1c1816]/60 text-slate-400 border-[#c8a97e]/15 hover:text-white'}`;

function FilterDropdown({ value, onValueChange, options, triggerClassName, contentClassName, icon: Icon }: any) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find((o: any) => o.value === value)?.label || value;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${triggerClassName}`}
            >
                <div className="flex items-center truncate">
                    {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0 text-amber-700/50" />}
                    <span className="truncate">{selectedLabel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-50 shrink-0 text-amber-500/80" />
            </button>
            {open && (
                <div className={`absolute left-0 top-full mt-1 z-50 w-full min-w-max rounded-lg border shadow-lg overflow-y-auto ${contentClassName}`}>
                    <div className="p-1 flex flex-col gap-0.5">
                        {options.map((o: any) => (
                            <button
                                key={o.value}
                                onClick={() => { onValueChange(o.value); setOpen(false); }}
                                className={`text-left px-2 py-1.5 rounded-md text-sm transition-colors ${value === o.value ? 'bg-amber-500/15 text-amber-500 font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function FilterControls({ activeCategory, currentData, filters: f }: FilterControlsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* Sort */}
            <FilterDropdown
                value={f.sortBy}
                onValueChange={f.setSortBy}
                options={SORT_OPTIONS}
                triggerClassName={`w-[140px] ${triggerCls}`}
                contentClassName={contentCls}
                icon={ArrowUpDown}
            />

            {/* Monster filters */}
            {activeCategory === 'monsters' && (
                <>
                    {f.monsterKinds.length > 1 && (
                        <FilterDropdown
                            value={f.monsterKindFilter}
                            onValueChange={f.setMonsterKindFilter}
                            options={[
                                { value: 'all', label: 'All Sizes' },
                                ...f.monsterKinds.map(k => ({
                                    value: k,
                                    label: k === 'large' ? '🔴 Large' : k === 'small' ? '⚪ Small' : `🟡 ${k.charAt(0).toUpperCase() + k.slice(1)}`
                                }))
                            ]}
                            triggerClassName={`w-[130px] ${triggerCls}`}
                            contentClassName={contentCls}
                        />
                    )}

                    <FilterDropdown
                        value={f.monsterWeaknessFilter}
                        onValueChange={f.setMonsterWeaknessFilter}
                        options={[
                            { value: 'all', label: 'Any Weakness' },
                            ...f.monsterWeaknesses.map(w => ({ value: w, label: w.charAt(0).toUpperCase() + w.slice(1) }))
                        ]}
                        triggerClassName={`w-[160px] capitalize ${triggerCls}`}
                        contentClassName={contentCls}
                    />

                    <button onClick={() => f.setGroupBySpecies(!f.groupBySpecies)} className={toggleCls(f.groupBySpecies)}>
                        Group by Species
                    </button>
                </>
            )}

            {/* Weapon filters */}
            {activeCategory === 'weapons' && (
                <>
                    {f.weaponTypes.length > 0 && (
                        <FilterDropdown
                            value={f.weaponTypeFilter}
                            onValueChange={f.setWeaponTypeFilter}
                            options={[
                                { value: 'all', label: `All Types (${(currentData as Weapon[]).length})` },
                                ...f.weaponTypes.map(t => ({ value: t, label: WEAPON_KIND_LABELS[t] || t }))
                            ]}
                            triggerClassName={`w-[180px] ${triggerCls}`}
                            contentClassName={contentCls}
                        />
                    )}

                    <FilterDropdown
                        value={f.weaponElementFilter}
                        onValueChange={f.setWeaponElementFilter}
                        options={[
                            { value: 'all', label: 'Any Element/Status' },
                            ...f.weaponElements.map(e => ({ value: e, label: e.charAt(0).toUpperCase() + e.slice(1) }))
                        ]}
                        triggerClassName={`w-[180px] capitalize ${triggerCls}`}
                        contentClassName={contentCls}
                    />

                    <button onClick={() => f.setGroupByWeaponType(!f.groupByWeaponType)} className={toggleCls(f.groupByWeaponType)}>
                        Group by Type
                    </button>
                </>
            )}

            {/* Skill filter */}
            {activeCategory === 'skills' && (
                <FilterDropdown
                    value={f.skillKindFilter}
                    onValueChange={f.setSkillKindFilter}
                    options={[
                        { value: 'all', label: 'All Kinds' },
                        { value: 'armor', label: '🛡 Armor' },
                        { value: 'weapon', label: '⚔ Weapon' },
                        { value: 'set-bonus', label: '💎 Set Bonus' },
                        { value: 'group-bonus', label: '👥 Group Bonus' },
                    ]}
                    triggerClassName={`w-[160px] ${triggerCls}`}
                    contentClassName={contentCls}
                />
            )}

            {/* Deco filter */}
            {activeCategory === 'decorations' && (
                <FilterDropdown
                    value={f.decoSlotFilter}
                    onValueChange={f.setDecoSlotFilter}
                    options={[
                        { value: 'all', label: 'All Slots' },
                        { value: '1', label: '◆ Slot [1]' },
                        { value: '2', label: '◆◆ Slot [2]' },
                        { value: '3', label: '◆◆◆ Slot [3]' },
                    ]}
                    triggerClassName={`w-[140px] ${triggerCls}`}
                    contentClassName={contentCls}
                />
            )}
        </div>
    );
}
