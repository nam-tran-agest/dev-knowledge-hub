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

const triggerCls = 'h-9 bg-[#050714] border border-primary/30 text-slate-200 text-xs font-mono uppercase tracking-wider cyber-clip-button focus:border-primary [&>svg]:text-primary/70 cursor-pointer';
const contentCls = 'bg-[#050714]/95 border-primary/30 backdrop-blur-2xl max-h-72 cyber-clip shadow-[0_0_25px_rgba(0,0,0,0.9)]';
const toggleCls = (active: boolean) => `text-xs font-mono uppercase tracking-wider px-3 py-2 cyber-clip-button border transition-all cursor-pointer ${active ? 'bg-primary/20 text-primary border-primary shadow-[0_0_12px_rgba(0,240,255,0.25)] font-bold' : 'bg-[#050714] text-primary/60 border-primary/20 hover:text-white hover:border-primary/40'}`;

interface FilterOption<T = string> {
    value: T;
    label: string;
}

interface FilterDropdownProps<T extends string = string> {
    value: T;
    onValueChange: (v: T) => void;
    options: FilterOption<T>[];
    triggerClassName?: string;
    contentClassName?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

function FilterDropdown<T extends string = string>({ value, onValueChange, options, triggerClassName, contentClassName, icon: Icon }: FilterDropdownProps<T>) {
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

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between px-3 py-2 ${triggerClassName}`}
            >
                <div className="flex items-center truncate">
                    {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0 text-primary" />}
                    <span className="truncate">{selectedLabel}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 ml-2 opacity-70 shrink-0 text-primary" />
            </button>
            {open && (
                <div className={`absolute left-0 top-full mt-1 z-50 w-full min-w-max border shadow-2xl overflow-y-auto ${contentClassName}`}>
                    <div className="p-1 flex flex-col gap-0.5">
                        {options.map(o => (
                            <button
                                key={o.value}
                                onClick={() => { onValueChange(o.value); setOpen(false); }}
                                className={`text-left px-3 py-1.5 cyber-clip-button text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${value === o.value ? 'bg-primary/20 text-primary font-bold' : 'text-slate-300 hover:bg-primary/10 hover:text-white'}`}
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
                        triggerClassName={`w-[160px] ${triggerCls}`}
                        contentClassName={contentCls}
                    />

                    <button onClick={() => f.setGroupBySpecies(!f.groupBySpecies)} className={toggleCls(f.groupBySpecies)}>
                        [ GROUP_SPECIES ]
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
                        triggerClassName={`w-[180px] ${triggerCls}`}
                        contentClassName={contentCls}
                    />

                    <button onClick={() => f.setGroupByWeaponType(!f.groupByWeaponType)} className={toggleCls(f.groupByWeaponType)}>
                        [ GROUP_TYPE ]
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
