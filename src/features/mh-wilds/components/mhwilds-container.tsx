'use client';

import { useState } from 'react';
import { Search, Bug, Swords, Shield, Gem, ScrollText, MapPin, Skull, Star, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Monster, Weapon, Armor, Item, ArmorSet, Skill, Decoration, Charm, Location as MHLocation, Ailment } from '../types';

import { useMHWildsData } from '../hooks/use-mhwilds-data';
import { useMHWildsFilters, type Category } from '../hooks/use-mhwilds-filters';

import { Pagination, LoadingState, ErrorState } from './ui/shared';
import { FilterControls } from './ui/filter-controls';

// Grid / List renderers
import { MonstersGrid } from './grids/monsters-grid';
import { WeaponsGrid } from './grids/weapons-grid';
import { ArmorSetsGrid } from './grids/armor-sets-grid';
import { SkillsGrid } from './grids/skills-list';
import { ItemsGrid } from './grids/items-grid';
import { DecorationsGrid } from './grids/decorations-grid';
import { CharmsList } from './grids/charms-list';
import { LocationsList } from './grids/locations-list';
import { AilmentsList } from './grids/ailments-list';

// Detail drawers
import { MonsterDetail } from './monster-detail';
import { WeaponDetail } from './weapon-detail';
import { ItemDetail } from './item-detail';
import { ArmorDetail } from './armor-detail';
import { SkillDetail } from './skill-detail';

// === Category definitions ===
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

// === Detail drawer union ===
type DetailTarget =
    | { type: 'monster'; data: Monster }
    | { type: 'weapon'; data: Weapon }
    | { type: 'item'; data: Item }
    | { type: 'armor'; data: Armor }
    | { type: 'skill'; data: Skill }
    | null;

// === Main Container ===
export function MHWildsContainer() {
    const [activeCategory, setActiveCategory] = useState<Category>('monsters');
    const [detail, setDetail] = useState<DetailTarget>(null);

    const { data, currentData, loading, error, refetch } = useMHWildsData(activeCategory);
    const filters = useMHWildsFilters(activeCategory, currentData);

    const catMeta = CATEGORIES.find(c => c.key === activeCategory)!;
    const closeDetail = () => setDetail(null);

    // === Content Renderer ===
    const renderContent = () => {
        if (loading) return <LoadingState label={activeCategory} />;
        if (error) return <ErrorState error={error} onRetry={refetch} />;

        switch (activeCategory) {
            case 'monsters':
                return <MonstersGrid monsters={filters.pagedData as Monster[]} onSelect={d => setDetail({ type: 'monster', data: d })} groupBySpecies={filters.groupBySpecies} />;
            case 'weapons':
                return <WeaponsGrid weapons={filters.pagedData as Weapon[]} groupByType={filters.groupByWeaponType} onSelect={d => setDetail({ type: 'weapon', data: d })} />;
            case 'armor-sets':
                return <ArmorSetsGrid sets={filters.pagedData as ArmorSet[]} onSelectArmor={d => setDetail({ type: 'armor', data: d })} />;
            case 'skills':
                return <SkillsGrid skills={filters.pagedData as Skill[]} onSelect={d => setDetail({ type: 'skill', data: d })} />;
            case 'items':
                return <ItemsGrid items={filters.pagedData as Item[]} onSelect={d => setDetail({ type: 'item', data: d })} />;
            case 'decorations':
                return <DecorationsGrid decorations={filters.pagedData as Decoration[]} />;
            case 'charms':
                return <CharmsList charms={filters.pagedData as Charm[]} />;
            case 'locations':
                return <LocationsList locations={filters.pagedData as MHLocation[]} />;
            case 'ailments':
                return <AilmentsList ailments={filters.pagedData as Ailment[]} />;
            default:
                return null;
        }
    };

    // === Detail Drawer Renderer ===
    const renderDetail = () => {
        if (!detail) return null;
        switch (detail.type) {
            case 'monster': return <MonsterDetail monster={detail.data} onClose={closeDetail} />;
            case 'weapon': return <WeaponDetail weapon={detail.data} onClose={closeDetail} />;
            case 'item': return <ItemDetail item={detail.data} onClose={closeDetail} />;
            case 'armor': return <ArmorDetail armor={detail.data} onClose={closeDetail} />;
            case 'skill': return <SkillDetail skill={detail.data} onClose={closeDetail} />;
        }
    };

    return (
        <div
            className="min-h-screen pt-18 text-white"
            style={{ background: 'linear-gradient(135deg, #0f1923 0%, #0c1018 25%, #101520 50%, #0e1a1f 75%, #0f1923 100%)' }}
        >
            {/* Header */}
            <div className="border-b border-white/5 bg-gradient-to-r from-emerald-600/5 via-transparent to-purple-600/5">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
                    <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/img/MHW/MHWilds_logo.webp" alt="MHWilds Logo" className="w-14 h-14 object-contain brightness-150 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Monster Hunter: Wilds</h1>
                            <p className="text-xs text-slate-500">Complete database — Monsters, Weapons, Armor, Skills & more</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-56 shrink-0 border-r border-white/[0.12] sticky top-0 h-screen overflow-y-auto py-4 px-2 bg-white/[0.04] backdrop-blur-md">
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
                                    <span className="ml-auto text-[10px] font-bold text-slate-600 bg-white/[0.10] rounded-full px-1.5 py-0.5">{(data[cat.key] as unknown[]).length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Mobile bottom bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/90 backdrop-blur-xl border-t border-white/[0.12] overflow-x-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${catMeta.color}`}>{catMeta.icon}</div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{catMeta.label}</h2>
                            <p className="text-xs text-slate-500">{filters.filteredData.length} results</p>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder={`Search ${catMeta.label.toLowerCase()}...`}
                            value={filters.searchQuery}
                            onChange={e => { filters.setSearchQuery(e.target.value); filters.setPage(1); }}
                            className="pl-10 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30"
                        />
                    </div>

                    {/* Filters */}
                    <div className="mb-5">
                        <FilterControls activeCategory={activeCategory} filters={filters} currentData={currentData} />
                    </div>

                    {renderContent()}

                    {!loading && !error && filters.filteredData.length > 0 && (
                        <Pagination current={filters.page} total={filters.totalPages} onChange={filters.setPage} />
                    )}
                    {!loading && !error && filters.filteredData.length === 0 && (
                        <div className="text-center py-16"><p className="text-slate-500">No results found.</p></div>
                    )}
                </main>
            </div>

            {renderDetail()}
        </div>
    );
}
