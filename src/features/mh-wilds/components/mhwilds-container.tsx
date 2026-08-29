'use client';

import React, { useState } from 'react';
import { Search, Bug, Swords, Shield, Gem, ScrollText, MapPin, Skull, Star, Package, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Monster, Weapon, Armor, Item, ArmorSet, Skill, Decoration, Charm, Location as MHLocation, Ailment } from '../types';

import { useMHWildsData } from '../hooks/use-mhwilds-data';
import { useMHWildsFilters, type Category } from '../hooks/use-mhwilds-filters';

import { LoadingState, ErrorState } from './ui/shared';
import { FilterControls } from './ui/filter-controls';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

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

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'monsters', label: 'Monsters', icon: <Bug className="w-4 h-4" />, color: 'text-primary' },
    { key: 'weapons', label: 'Weapons', icon: <Swords className="w-4 h-4" />, color: 'text-secondary' },
    { key: 'armor-sets', label: 'Armor Sets', icon: <Shield className="w-4 h-4" />, color: 'text-primary' },
    { key: 'skills', label: 'Skills', icon: <Star className="w-4 h-4" />, color: 'text-yellow-400' },
    { key: 'items', label: 'Items', icon: <Package className="w-4 h-4" />, color: 'text-emerald-400' },
    { key: 'decorations', label: 'Decorations', icon: <Gem className="w-4 h-4" />, color: 'text-purple-400' },
    { key: 'charms', label: 'Charms', icon: <ScrollText className="w-4 h-4" />, color: 'text-cyan-400' },
    { key: 'locations', label: 'Locations', icon: <MapPin className="w-4 h-4" />, color: 'text-lime-400' },
    { key: 'ailments', label: 'Ailments', icon: <Skull className="w-4 h-4" />, color: 'text-pink-400' },
];

type DetailTarget =
    | { type: 'monster'; data: Monster }
    | { type: 'weapon'; data: Weapon }
    | { type: 'item'; data: Item }
    | { type: 'armor'; data: Armor }
    | { type: 'skill'; data: Skill }
    | null;

export function MHWildsContainer() {
    const [activeCategory, setActiveCategory] = useState<Category>('monsters');
    const [detail, setDetail] = useState<DetailTarget>(null);

    const { data, currentData, loading, error, refetch } = useMHWildsData(activeCategory);
    const filters = useMHWildsFilters(activeCategory, currentData);

    const catMeta = CATEGORIES.find(c => c.key === activeCategory)!;
    const closeDetail = () => setDetail(null);

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
        <div className="min-h-screen pt-18 text-white relative bg-background">
            <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

            {/* Header Deck */}
            <div className="border-b border-primary/20 bg-[#04060f]/90 backdrop-blur-2xl">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/img/MHW/MHWilds_logo.webp" alt="MHWilds Logo" className="w-12 h-12 object-contain brightness-125 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase tracking-wider">
                                MH_WILDS // ARCHIVE_VAULT
                            </h1>
                            <p className="text-[11px] font-mono text-primary/60 uppercase">
                                // Neural database index — Monsters, Weapons, Armor, Skills & Locations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex min-h-[calc(100vh-140px)]">
                {/* Sidebar */}
                <aside className="hidden md:block w-56 shrink-0 border-r border-primary/20 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto py-4 px-2 bg-[#04060f]/80 backdrop-blur-md custom-scrollbar">
                    <div className="flex items-center gap-2 px-3 mb-3">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        <p className="text-[10px] font-mono text-primary/70 uppercase tracking-widest font-bold">// ARCHIVE_INDEX</p>
                    </div>
                    <nav className="space-y-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 cyber-clip-button text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${activeCategory === cat.key
                                    ? 'bg-primary/20 text-primary border-primary shadow-[0_0_15px_rgba(0,240,255,0.25)] font-bold'
                                    : 'text-primary/70 hover:text-white hover:bg-primary/5 border-transparent hover:border-primary/20'
                                    }`}
                            >
                                <span className={activeCategory === cat.key ? 'text-primary' : cat.color}>{cat.icon}</span>
                                {cat.label}
                                {data[cat.key] && (
                                    <span className="ml-auto text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 cyber-clip-tag">
                                        {activeCategory === cat.key ? filters.filteredData.length : (data[cat.key] as unknown[]).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Mobile bottom bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050714]/95 backdrop-blur-xl border-t border-primary/30 overflow-x-auto scrollbar-none" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <div className="flex gap-1 px-2 py-2">
                        {CATEGORIES.map(cat => (
                            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                                className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 cyber-clip-button text-[10px] font-mono uppercase transition-all ${activeCategory === cat.key ? 'text-primary bg-primary/20 border border-primary' : 'text-primary/60'}`}
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
                    <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 cyber-clip-button bg-primary/10 border border-primary/30 text-primary">{catMeta.icon}</div>
                            <div>
                                <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">{catMeta.label}</h2>
                                <p className="text-[10px] font-mono text-primary/60 uppercase">// {filters.filteredData.length} records retrieved</p>
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                        <Input
                            placeholder={`SEARCH_${catMeta.label.toUpperCase()}_DATABASE...`}
                            value={filters.searchQuery}
                            onChange={e => filters.setSearchQuery(e.target.value)}
                            className="pl-9 bg-[#040612]/90 border-primary/30 text-white font-mono text-xs"
                        />
                    </div>

                    {/* Filters */}
                    <div className="mb-5">
                        <FilterControls activeCategory={activeCategory} filters={filters} currentData={currentData} />
                    </div>

                    {renderContent()}

                    {!loading && !error && filters.filteredData.length > 0 && filters.totalPages > 1 && (
                        <div className="pt-8 pb-4 font-mono">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => filters.setPage(Math.max(1, filters.page - 1))}
                                            disabled={filters.page === 1}
                                            className={filters.page === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer cyber-clip-button'}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: filters.totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === filters.totalPages || Math.abs(p - filters.page) <= 1)
                                        .map((p, i, arr) => (
                                            <React.Fragment key={p}>
                                                {i > 0 && arr[i - 1] !== p - 1 && (
                                                    <PaginationItem>
                                                        <span className="px-3 text-primary/40">...</span>
                                                    </PaginationItem>
                                                )}
                                                <PaginationItem>
                                                    <PaginationLink
                                                        isActive={filters.page === p}
                                                        onClick={() => filters.setPage(p)}
                                                        className="cursor-pointer cyber-clip-button"
                                                    >
                                                        {p}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            </React.Fragment>
                                        ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => filters.setPage(Math.min(filters.totalPages, filters.page + 1))}
                                            disabled={filters.page === filters.totalPages}
                                            className={filters.page === filters.totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer cyber-clip-button'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                    {!loading && !error && filters.filteredData.length === 0 && (
                        <div className="text-center py-16 font-mono text-xs uppercase text-primary/50">
                            // NO_MATCHING_RECORDS_FOUND
                        </div>
                    )}
                </main>
            </div>

            {renderDetail()}
        </div>
    );
}
