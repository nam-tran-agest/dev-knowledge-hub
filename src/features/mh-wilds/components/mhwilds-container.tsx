'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, Bug, Swords, Shield, Gem, ScrollText, MapPin, Skull, Star, Package, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Monster, Weapon, Armor, Skill, Item, Decoration, Charm, Location as MHLocation, Ailment, ArmorSet } from '../types';
import * as api from '../services/mhwilds-api';
import { MonsterCard, SPECIES_LABELS } from './monster-card';
import { MonsterDetail } from './monster-detail';
import { WeaponDetail, ItemDetail, ArmorDetail } from './detail-drawers';
import { WeaponCard, WEAPON_KIND_LABELS, WeaponTypeIcon } from './weapon-card';
import { ArmorCard } from './armor-card';
import { WEAPON_TYPE_ICONS } from '../constants/mh-icons';

// === Category definitions ===
type Category = 'monsters' | 'weapons' | 'armor-sets' | 'skills' | 'items' | 'decorations' | 'charms' | 'locations' | 'ailments';

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'monsters', label: 'Monsters', icon: <Bug className="w-4 h-4" />, color: 'text-red-400' },
    { key: 'weapons', label: 'Weapons', icon: <Swords className="w-4 h-4" />, color: 'text-orange-400' },
    { key: 'armor-sets', label: 'Armor Sets', icon: <Shield className="w-4 h-4" />, color: 'text-blue-400' },
    { key: 'skills', label: 'Skills', icon: <Star className="w-4 h-4" />, color: 'text-yellow-400' },
    { key: 'items', label: 'Items', icon: <Package className="w-4 h-4" />, color: 'text-emerald-400' },
    { key: 'decorations', label: 'Decorations', icon: <Gem className="w-4 h-4" />, color: 'text-purple-400' },
    { key: 'charms', label: 'Charms', icon: <ScrollText className="w-4 h-4" />, color: 'text-cyan-400' },
    { key: 'locations', label: 'Locations', icon: <MapPin className="w-4 h-4" />, color: 'text-lime-400' },
    { key: 'ailments', label: 'Ailments', icon: <Skull className="w-4 h-4" />, color: 'text-pink-400' },
];

type SortOption = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name A→Z' },
    { value: 'name-desc', label: 'Name Z→A' },
    { value: 'rarity-asc', label: 'Rarity ↑' },
    { value: 'rarity-desc', label: 'Rarity ↓' },
];

const PER_PAGE = 24;

const RARITY_COLORS: Record<number, string> = {
    1: 'bg-slate-600', 2: 'bg-slate-500', 3: 'bg-green-600', 4: 'bg-blue-600',
    5: 'bg-purple-600', 6: 'bg-amber-600', 7: 'bg-orange-600', 8: 'bg-red-600',
    9: 'bg-pink-600', 10: 'bg-cyan-600',
};

// === Pagination Component ===
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
        <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
            <button disabled={current === 1} onClick={() => onChange(current - 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">←</button>
            {start > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white transition-colors">1</button>{start > 2 && <span className="text-slate-600 text-xs">…</span>}</>}
            {pages.map(p => (
                <button key={p} onClick={() => onChange(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${p === current ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]'}`}>{p}</button>
            ))}
            {end < total && <>{end < total - 1 && <span className="text-slate-600 text-xs">…</span>}<button onClick={() => onChange(total)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white transition-colors">{total}</button></>}
            <button disabled={current === total} onClick={() => onChange(current + 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">→</button>
        </div>
    );
}

// === Rarity bar ===
export function RarityDots({ rarity }: { rarity: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: Math.min(rarity, 10) }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${RARITY_COLORS[rarity] || 'bg-slate-600'}`} />
            ))}
        </div>
    );
}

// === Group Header ===
function GroupHeader({ label, count, iconNode }: { label: string; count: number; iconNode?: React.ReactNode }) {
    return (
        <div className="col-span-full flex items-center gap-3 pt-4 pb-2 first:pt-0">
            {iconNode && <span className="shrink-0">{iconNode}</span>}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-slate-600 bg-white/[0.03] rounded-full px-2 py-0.5">{count}</span>
        </div>
    );
}

// === Main Container ===
export function MHWildsContainer() {
    const [activeCategory, setActiveCategory] = useState<Category>('monsters');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);
    const [weaponTypeFilter, setWeaponTypeFilter] = useState('all');
    const [skillKindFilter, setSkillKindFilter] = useState('all');
    const [decoSlotFilter, setDecoSlotFilter] = useState('all');
    const [monsterKindFilter, setMonsterKindFilter] = useState('all');
    const [monsterWeaknessFilter, setMonsterWeaknessFilter] = useState('all');
    const [weaponElementFilter, setWeaponElementFilter] = useState('all');
    const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());
    const [expandedSets, setExpandedSets] = useState<Set<number>>(new Set());
    const [groupBySpecies, setGroupBySpecies] = useState(true);
    const [groupByWeaponType, setGroupByWeaponType] = useState(true);

    // Data cache
    const [data, setData] = useState<Record<string, unknown[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategoryData = useCallback(async (cat: Category) => {
        if (data[cat]) return;
        setLoading(true);
        setError(null);
        try {
            let result: unknown[];
            switch (cat) {
                case 'monsters': result = await api.getMonsters(); break;
                case 'weapons': result = await api.getWeapons(); break;
                case 'armor-sets': result = await api.getArmorSets(); break;
                case 'skills': result = await api.getSkills(); break;
                case 'items': result = await api.getItems(); break;
                case 'decorations': result = await api.getDecorations(); break;
                case 'charms': result = await api.getCharms(); break;
                case 'locations': result = await api.getLocations(); break;
                case 'ailments': result = await api.getAilments(); break;
                default: result = [];
            }
            setData(prev => ({ ...prev, [cat]: result }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [data]);

    useEffect(() => { fetchCategoryData(activeCategory); }, [activeCategory, fetchCategoryData]);

    useEffect(() => {
        setPage(1);
        setSearchQuery('');
        setWeaponTypeFilter('all');
        setSkillKindFilter('all');
        setDecoSlotFilter('all');
        setMonsterKindFilter('all');
        setMonsterWeaknessFilter('all');
        setWeaponElementFilter('all');
        setSortBy('name-asc');
    }, [activeCategory]);

    const currentData = data[activeCategory] || [];

    // Sort helper
    const sortItems = useCallback(<T extends { name?: string; rarity?: number }>(items: T[]): T[] => {
        return [...items].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc': return (a.name || '').localeCompare(b.name || '');
                case 'name-desc': return (b.name || '').localeCompare(a.name || '');
                case 'rarity-asc': return (a.rarity || 0) - (b.rarity || 0);
                case 'rarity-desc': return (b.rarity || 0) - (a.rarity || 0);
                default: return 0;
            }
        });
    }, [sortBy]);

    // Filtered + sorted data
    const filteredData = useMemo(() => {
        const q = searchQuery.toLowerCase();
        let result: unknown[];
        switch (activeCategory) {
            case 'monsters': {
                result = (currentData as Monster[]).filter(m => {
                    const matchesText = m.name.toLowerCase().includes(q) || m.species.toLowerCase().includes(q);
                    const matchesKind = monsterKindFilter === 'all' || m.kind === monsterKindFilter;
                    if (!matchesText || !matchesKind) return false;

                    if (monsterWeaknessFilter !== 'all') {
                        const hasWeakness = m.weaknesses?.some(w =>
                            (w.element === monsterWeaknessFilter || w.status === monsterWeaknessFilter) && w.level > 0
                        );
                        if (!hasWeakness) return false;
                    }
                    return true;
                });
                const monsters = result as Monster[];
                // When grouped by species, sort by species first then name within each group
                if (groupBySpecies) {
                    return monsters.sort((a, b) => {
                        const speciesCompare = (SPECIES_LABELS[a.species] || a.species).localeCompare(SPECIES_LABELS[b.species] || b.species);
                        if (speciesCompare !== 0) return speciesCompare;
                        return a.name.localeCompare(b.name);
                    });
                }
                return sortItems(monsters as (Monster & { rarity?: number })[]);
            }
            case 'weapons': {
                result = (currentData as Weapon[]).filter(w => {
                    const matchesText = w.name.toLowerCase().includes(q);
                    const matchesType = weaponTypeFilter === 'all' || w.kind === weaponTypeFilter;
                    if (!matchesText || !matchesType) return false;

                    if (weaponElementFilter !== 'all') {
                        const hasElement = w.specials?.some(s =>
                            s.element === weaponElementFilter || s.status === weaponElementFilter
                        );
                        if (!hasElement) return false;
                    }
                    return true;
                });
                const weapons = result as Weapon[];
                // When grouped by type, sort by type first then rarity low→high within each group
                if (groupByWeaponType && weaponTypeFilter === 'all') {
                    return weapons.sort((a, b) => {
                        const typeCompare = (WEAPON_KIND_LABELS[a.kind] || a.kind).localeCompare(WEAPON_KIND_LABELS[b.kind] || b.kind);
                        if (typeCompare !== 0) return typeCompare;
                        return a.rarity - b.rarity;
                    });
                }
                return sortItems(weapons);
            }
            case 'armor-sets':
                return (currentData as ArmorSet[]).filter(s => s.name.toLowerCase().includes(q));
            case 'skills':
                result = (currentData as Skill[]).filter(s =>
                    s.name.toLowerCase().includes(q) && (skillKindFilter === 'all' || s.kind === skillKindFilter)
                );
                return sortItems(result as (Skill & { rarity?: number })[]);
            case 'items':
                result = (currentData as Item[]).filter(i => i.name.toLowerCase().includes(q));
                return sortItems(result as Item[]);
            case 'decorations':
                result = (currentData as Decoration[]).filter(d =>
                    d.name.toLowerCase().includes(q) && (decoSlotFilter === 'all' || String(d.slot) === decoSlotFilter)
                );
                return sortItems(result as Decoration[]);
            case 'charms':
                return (currentData as Charm[]).filter(c =>
                    c.ranks.some(r => r.name.toLowerCase().includes(q))
                );
            case 'locations':
                return (currentData as MHLocation[]).filter(l => l.name.toLowerCase().includes(q));
            case 'ailments':
                return (currentData as Ailment[]).filter(a => a.name.toLowerCase().includes(q));
            default:
                return currentData;
        }
    }, [currentData, searchQuery, activeCategory, weaponTypeFilter, weaponElementFilter, skillKindFilter, decoSlotFilter, monsterKindFilter, monsterWeaknessFilter, sortBy, sortItems]);

    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    const pagedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const weaponTypes = useMemo(() => {
        if (activeCategory !== 'weapons') return [];
        return Array.from(new Set((currentData as Weapon[]).map(w => w.kind))).sort();
    }, [currentData, activeCategory]);

    const monsterWeaknesses = useMemo(() => {
        if (activeCategory !== 'monsters') return [];
        const wSet = new Set<string>();
        (currentData as Monster[]).forEach(m => {
            m.weaknesses?.forEach(w => {
                if (w.level > 0) {
                    if (w.element) wSet.add(w.element);
                    if (w.status) wSet.add(w.status);
                }
            });
        });
        return Array.from(wSet).sort();
    }, [currentData, activeCategory]);

    const weaponElements = useMemo(() => {
        if (activeCategory !== 'weapons') return [];
        const eSet = new Set<string>();
        (currentData as Weapon[]).forEach(w => {
            w.specials?.forEach(s => {
                if (s.element) eSet.add(s.element);
                if (s.status) eSet.add(s.status);
            });
        });
        return Array.from(eSet).sort();
    }, [currentData, activeCategory]);

    const toggleSkill = (id: number) => setExpandedSkills(prev => {
        const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
    });
    const toggleSet = (id: number) => setExpandedSets(prev => {
        const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
    });

    const catMeta = CATEGORIES.find(c => c.key === activeCategory)!;

    // === Render Filters ===
    const renderFilters = () => (
        <div className="flex flex-wrap gap-2">
            {/* Sort dropdown — always visible */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg px-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortOption); setPage(1); }} className="bg-transparent text-sm text-slate-300 py-2 focus:outline-none cursor-pointer">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            {/* Category-specific filters */}
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

            {activeCategory === 'skills' && (
                <select value={skillKindFilter} onChange={e => { setSkillKindFilter(e.target.value); setPage(1); }} className="bg-white/[0.03] border border-white/5 text-sm text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/30">
                    <option value="all">All Kinds</option>
                    <option value="armor">🛡 Armor</option>
                    <option value="weapon">⚔ Weapon</option>
                    <option value="set-bonus">💎 Set Bonus</option>
                    <option value="group-bonus">👥 Group Bonus</option>
                </select>
            )}

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

    // === Content Renderers ===
    const renderContent = () => {
        if (loading) return <LoadingState label={activeCategory} />;
        if (error) return <ErrorState error={error} onRetry={() => { setData(prev => { const n = { ...prev }; delete n[activeCategory]; return n; }); fetchCategoryData(activeCategory); }} />;

        switch (activeCategory) {
            case 'monsters':
                return <MonstersGrid monsters={pagedData as Monster[]} onSelect={setSelectedMonster} groupBySpecies={groupBySpecies} />;
            case 'weapons':
                return <WeaponsGrid weapons={pagedData as Weapon[]} groupByType={groupByWeaponType && weaponTypeFilter === 'all'} onSelect={setSelectedWeapon} />;
            case 'armor-sets':
                return <ArmorSetsGrid sets={pagedData as ArmorSet[]} expandedSets={expandedSets} toggleSet={toggleSet} onSelectArmor={setSelectedArmor} />;
            case 'skills':
                return <SkillsList skills={pagedData as Skill[]} expandedSkills={expandedSkills} toggleSkill={toggleSkill} />;
            case 'items':
                return <ItemsGrid items={pagedData as Item[]} onSelect={setSelectedItem} />;
            case 'decorations':
                return <DecorationsGrid decorations={pagedData as Decoration[]} />;
            case 'charms':
                return <CharmsList charms={pagedData as Charm[]} />;
            case 'locations':
                return <LocationsList locations={pagedData as MHLocation[]} />;
            case 'ailments':
                return <AilmentsList ailments={pagedData as Ailment[]} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] pt-20">
            {/* Header */}
            <div className="border-b border-white/5 bg-gradient-to-r from-emerald-600/5 via-transparent to-purple-600/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🐉</span>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Monster Hunter: Wilds</h1>
                            <p className="text-xs text-slate-500">Complete database — Monsters, Weapons, Armor, Skills & more</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-56 shrink-0 border-r border-white/5 sticky top-0 h-screen overflow-y-auto py-4 px-2">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold px-3 mb-2">Database</p>
                    <nav className="space-y-0.5">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.key
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                                    }`}
                            >
                                <span className={activeCategory === cat.key ? 'text-emerald-400' : cat.color}>{cat.icon}</span>
                                {cat.label}
                                {data[cat.key] && (
                                    <span className="ml-auto text-[10px] font-bold text-slate-600 bg-white/[0.03] rounded-full px-1.5 py-0.5">{(data[cat.key] as unknown[]).length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Mobile bottom bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-t border-white/5 overflow-x-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <div className="flex gap-1 px-2 py-2">
                        {CATEGORIES.map(cat => (
                            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                                className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${activeCategory === cat.key ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}
                            >
                                {cat.icon}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 pb-28 md:pb-6">
                    {/* Section header with icon */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${catMeta.color}`}>{catMeta.icon}</div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{catMeta.label}</h2>
                            <p className="text-xs text-slate-500">{filteredData.length} results</p>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder={`Search ${catMeta.label.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                            className="pl-10 bg-white/[0.03] border-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30"
                        />
                    </div>

                    {/* Filters + Sort */}
                    <div className="mb-5">
                        {renderFilters()}
                    </div>

                    {renderContent()}

                    {!loading && !error && filteredData.length > 0 && (
                        <Pagination current={page} total={totalPages} onChange={setPage} />
                    )}
                    {!loading && !error && filteredData.length === 0 && (
                        <div className="text-center py-16"><p className="text-slate-500">No results found.</p></div>
                    )}
                </main>
            </div>

            {selectedMonster && <MonsterDetail monster={selectedMonster} onClose={() => setSelectedMonster(null)} />}
            {selectedWeapon && <WeaponDetail weapon={selectedWeapon} onClose={() => setSelectedWeapon(null)} />}
            {selectedItem && <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
            {selectedArmor && <ArmorDetail armor={selectedArmor} onClose={() => setSelectedArmor(null)} />}
        </div>
    );
}

// === Sub-components ===

function LoadingState({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-sm text-slate-500">Loading {label}...</p>
            </div>
        </div>
    );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
                <button onClick={onRetry} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Retry</button>
            </div>
        </div>
    );
}

// === Monsters with optional species grouping ===
function MonstersGrid({ monsters, onSelect, groupBySpecies }: { monsters: Monster[]; onSelect: (m: Monster) => void; groupBySpecies: boolean }) {
    if (!groupBySpecies) {
        return (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {monsters.map(m => (
                        <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <MonsterCard monster={m} onClick={onSelect} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    }

    // Group by species
    const groups: Record<string, Monster[]> = {};
    monsters.forEach(m => {
        const sp = SPECIES_LABELS[m.species] || m.species || 'Unknown';
        if (!groups[sp]) groups[sp] = [];
        groups[sp].push(m);
    });

    return (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(groups).map(([species, mons]) => (
                <div key={species} className="contents">
                    <GroupHeader label={species} count={mons.length} />
                    <AnimatePresence mode="popLayout">
                        {mons.map(m => (
                            <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                                <MonsterCard monster={m} onClick={onSelect} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </motion.div>
    );
}

// === Weapons with optional type grouping ===
function WeaponsGrid({ weapons, groupByType, onSelect }: { weapons: Weapon[]; groupByType: boolean; onSelect: (w: Weapon) => void }) {
    if (!groupByType) {
        return (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {weapons.map(w => (
                        <motion.div key={w.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <WeaponCard weapon={w} onClick={onSelect} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        );
    }

    // Build ordered groups preserving data order (already sorted by type+rarity)
    const groups: { label: string; items: Weapon[] }[] = [];
    let currentGroup: { label: string; items: Weapon[] } | null = null;
    weapons.forEach(w => {
        const label = WEAPON_KIND_LABELS[w.kind] || w.kind;
        if (!currentGroup || currentGroup.label !== label) {
            currentGroup = { label, items: [] };
            groups.push(currentGroup);
        }
        currentGroup.items.push(w);
    });

    return (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map(group => (
                <div key={group.label} className="contents">
                    <GroupHeader label={group.label} count={group.items.length} iconNode={<WeaponTypeIcon kind={Object.entries(WEAPON_KIND_LABELS).find(([, v]) => v === group.label)?.[0] || ''} size={18} />} />
                    <AnimatePresence mode="popLayout">
                        {group.items.map(w => (
                            <motion.div key={w.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                                <WeaponCard weapon={w} onClick={onSelect} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </motion.div>
    );
}

// === Armor Sets (expandable) ===
function ArmorSetsGrid({ sets, expandedSets, toggleSet, onSelectArmor }: { sets: ArmorSet[]; expandedSets: Set<number>; toggleSet: (id: number) => void; onSelectArmor: (a: Armor) => void }) {
    return (
        <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
                {sets.map(set => {
                    const isExpanded = expandedSets.has(set.id);
                    const bonusSkill = set.bonus || set.groupBonus;
                    return (
                        <motion.div key={set.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
                            <button onClick={() => toggleSet(set.id)} className="w-full text-left p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{set.name}</h3>
                                        <p className="text-[10px] text-slate-500">{set.pieces?.length || 0} pieces</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {bonusSkill && (
                                        <span className="text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-full px-2.5 py-1 font-bold">
                                            ✨ {bonusSkill.skill.name}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {isExpanded && set.pieces && (
                                <div className="border-t border-white/5 bg-black/40 p-4 space-y-4">
                                    {bonusSkill && bonusSkill.ranks && (
                                        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-4 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                            <div className="flex items-center gap-2 mb-3">
                                                <Star className="w-4 h-4 text-purple-400" />
                                                <h4 className="text-xs text-purple-400 uppercase tracking-widest font-bold">Set Bonus — {bonusSkill.skill.name}</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {bonusSkill.ranks.map(r => (
                                                    <div key={r.id} className="flex gap-3 text-xs items-start bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                                        <span className="text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded whitespace-nowrap">{r.pieces} pcs</span>
                                                        <span className="text-slate-300 mt-0.5">{r.skill.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                                        {set.pieces.map((piece: Armor) => <ArmorCard key={piece.id} armor={piece} onClick={onSelectArmor} />)}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}

// === Skills (expandable with level bar) ===
function SkillsList({ skills, expandedSkills, toggleSkill }: { skills: Skill[]; expandedSkills: Set<number>; toggleSkill: (id: number) => void }) {
    const kindColors: Record<string, string> = {
        armor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        weapon: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
        'set-bonus': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
        'group-bonus': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    };


    return (
        <motion.div layout className="space-y-2">
            <AnimatePresence mode="popLayout">
                {skills.map(skill => {
                    const isExpanded = expandedSkills.has(skill.id);
                    const maxLevel = skill.ranks.length;
                    return (
                        <motion.div key={skill.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
                            <button onClick={() => toggleSkill(skill.id)} className="w-full text-left p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-white truncate">{skill.name}</h3>
                                            <span className={`text-[10px] rounded px-1.5 py-0.5 font-bold border capitalize ${kindColors[skill.kind] || 'bg-white/5 text-slate-400 border-white/5'}`}>
                                                {skill.kind.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Level dots */}
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: maxLevel }).map((_, i) => (
                                                    <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />
                                                ))}
                                                {Array.from({ length: Math.max(0, 7 - maxLevel) }).map((_, i) => (
                                                    <div key={i} className="w-2 h-2 rounded-full bg-white/[0.05]" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-500">Max Lv{maxLevel}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                                <div className="border-t border-white/5 bg-black/40 px-6 py-5">
                                    <p className="text-sm text-slate-400 mb-6 italic border-l-2 border-emerald-500/30 pl-3">
                                        {skill.description}
                                    </p>

                                    <div className="relative pl-3 space-y-5 before:absolute before:inset-y-2 before:left-[17px] before:w-[2px] before:bg-white/5">
                                        {skill.ranks.map((r, i) => (
                                            <div key={r.id} className="relative flex items-start gap-4">
                                                {/* Stepper Node */}
                                                <div className="relative z-10 w-[10px] h-[10px] rounded-full bg-emerald-500 border-[3px] border-[#111114] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.04] transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                            Level {r.level}
                                                        </span>
                                                        {i === skill.ranks.length - 1 && (
                                                            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 px-1.5 rounded">Max</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">
                                                        {r.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}

// === Items with icon colors and rarity dots ===
function ItemsGrid({ items, onSelect }: { items: Item[]; onSelect: (i: Item) => void }) {
    const iconColorMap: Record<string, string> = {
        green: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400',
        blue: 'bg-blue-500/15 border-blue-500/20 text-blue-400',
        red: 'bg-red-500/15 border-red-500/20 text-red-400',
        yellow: 'bg-yellow-500/15 border-yellow-500/20 text-yellow-400',
        purple: 'bg-purple-500/15 border-purple-500/20 text-purple-400',
        orange: 'bg-orange-500/15 border-orange-500/20 text-orange-400',
        white: 'bg-white/5 border-white/10 text-slate-300',
        gray: 'bg-white/5 border-white/10 text-slate-400',
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {items.map(item => {
                const iconColor = iconColorMap[item.icon?.color || ''] || 'bg-white/5 border-white/10 text-slate-400';
                return (
                    <div key={item.id} onClick={() => onSelect(item)} className="bg-[#111114] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all group cursor-pointer flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-2 shrink-0">
                            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconColor}`}>
                                <Package className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                                <RarityDots rarity={item.rarity} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2 flex-1">{item.description}</p>
                        <div className="flex items-center gap-3 text-[10px] mt-auto pt-2 border-t border-white/[0.02]">
                            <span className="text-amber-400 font-bold">{item.value}z</span>
                            <span className="text-slate-600">Carry: {item.carryLimit}</span>
                            {item.recipes.length > 0 && <span className="text-emerald-500 font-bold">⚒ Craftable</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// === Decorations with visual slot diamonds ===
function DecorationsGrid({ decorations }: { decorations: Decoration[] }) {
    const slotDiamonds = (s: number) => '◆'.repeat(s) + '◇'.repeat(3 - s);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {decorations.map(deco => (
                <div key={deco.id} className="bg-[#111114] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all group flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-2 shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Gem className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{deco.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-amber-400 text-xs tracking-wider">{slotDiamonds(deco.slot)}</span>
                                <RarityDots rarity={deco.rarity} />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 flex-1">{deco.description}</p>
                    <div className="flex gap-1.5 flex-wrap mt-auto pt-2 border-t border-white/[0.02]">
                        {deco.skills.map(sk => (
                            <span key={sk.id} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">
                                {sk.skill.name} Lv{sk.level}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// === Charms with visual rank progression ===
function CharmsList({ charms }: { charms: Charm[] }) {
    // Group charms by their base name (e.g. "Windproof Charm I" -> "Windproof Charm")
    const groupedCharms = useMemo(() => {
        const romanNumeralRegex = /\s(I|II|III|IV|V|VI|VII|VIII|IX|X)$/;
        const map = new Map<string, { baseName: string, allRanks: typeof charms[0]['ranks'] }>();

        charms.forEach(charm => {
            charm.ranks.forEach(rank => {
                const baseName = rank.name.replace(romanNumeralRegex, '');
                if (!map.has(baseName)) {
                    map.set(baseName, { baseName, allRanks: [] });
                }
                map.get(baseName)!.allRanks.push(rank);
            });
        });

        const sortedGroups = Array.from(map.values()).sort((a, b) => a.baseName.localeCompare(b.baseName));

        // Sort ranks within each group 
        sortedGroups.forEach(group => {
            group.allRanks.sort((a, b) => a.level - b.level);
        });

        return sortedGroups;
    }, [charms]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {groupedCharms.map((group) => {
                const maxRank = group.allRanks[group.allRanks.length - 1];
                return (
                    <div key={group.baseName} className="bg-[#111114] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all card-group cursor-pointer flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3 shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                <ScrollText className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{group.baseName}</h3>
                                <p className="text-[10px] text-slate-500">{group.allRanks.length} {group.allRanks.length === 1 ? 'rank' : 'ranks'}</p>
                            </div>
                        </div>
                        {/* Rank progression visual */}
                        <div className="space-y-1 mb-3 flex-1 flex flex-col justify-end">
                            {group.allRanks.map(r => (
                                <div key={r.id} className="flex items-center gap-2">
                                    <span className="text-[10px] text-emerald-400 font-bold w-5 text-center">{r.level}</span>
                                    <div className="flex-1 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${(r.level / 5) * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{r.name}</span>
                                </div>
                            ))}
                        </div>
                        {maxRank?.skills?.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mt-auto pt-3 border-t border-white/5">
                                {maxRank.skills.map(sk => (
                                    <span key={sk.id} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">
                                        {sk.skill.name} Lv{sk.level}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// === Locations with visual camp cards ===
function LocationsList({ locations }: { locations: MHLocation[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {locations.map(loc => (
                <div key={loc.id} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col h-full">
                    {/* Location header with gradient */}
                    <div className="bg-gradient-to-r from-lime-600/10 to-emerald-600/5 p-5 border-b border-white/5 shrink-0">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-lime-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{loc.name}</h3>
                                    <p className="text-xs text-slate-500">{loc.zoneCount} zones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loc.camps?.length > 0 ? (
                        <div className="p-4 space-y-1.5 mt-auto flex-1 bg-black/20">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">⛺ Camps ({loc.camps.length})</p>
                            {loc.camps.map(camp => (
                                <div key={camp.id} className="flex items-center justify-between text-xs bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/[0.03]">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${camp.risk === 'safe' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <span className="text-slate-300">{camp.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase ${camp.risk === 'safe' ? 'text-emerald-400' : 'text-amber-400'}`}>{camp.risk}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 bg-black/20"></div>
                    )}
                </div>
            ))}
        </div>
    );
}

// === Ailments with visual treatment cards ===
function AilmentsList({ ailments }: { ailments: Ailment[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {ailments.map(ail => (
                <div key={ail.id} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col h-full">
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3 shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <Skull className="w-4 h-4 text-red-400" />
                            </div>
                            <h3 className="text-base font-bold text-white">{ail.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed flex-1">{ail.description}</p>

                        <div className="space-y-3 mt-auto shrink-0">
                            {ail.recovery && (ail.recovery.actions.length > 0 || ail.recovery.items.length > 0) && (
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1.5">💚 Recovery</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.recovery.actions.map(a => (
                                            <span key={a} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold capitalize">{a}</span>
                                        ))}
                                        {ail.recovery.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 font-bold">{it.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {ail.protection && (ail.protection.skills.length > 0 || ail.protection.items.length > 0) && (
                                <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1.5">🛡 Protection</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.protection.skills.map(sk => (
                                            <span key={sk.id} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5 font-bold">{sk.name}</span>
                                        ))}
                                        {ail.protection.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 font-bold">{it.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
