'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Monster, Weapon, Skill, Item, Decoration, Charm, Location as MHLocation, Ailment, ArmorSet } from '../types';
import { SPECIES_LABELS, WEAPON_KIND_LABELS, PER_PAGE, type SortOption } from '../constants';
import type { Category } from './use-mhwilds-data';

export type { Category };

export function useMHWildsFilters(activeCategory: Category, currentData: unknown[]) {
    const [_searchQuery, _setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [_sortBy, _setSortBy] = useState<SortOption>('name-asc');

    // Category-specific filters
    const [weaponTypeFilter, _setWeaponTypeFilter] = useState('all');
    const [weaponElementFilter, _setWeaponElementFilter] = useState('all');
    const [skillKindFilter, _setSkillKindFilter] = useState('all');
    const [decoSlotFilter, _setDecoSlotFilter] = useState('all');
    const [monsterKindFilter, _setMonsterKindFilter] = useState('all');
    const [monsterWeaknessFilter, _setMonsterWeaknessFilter] = useState('all');

    // Grouping toggles
    const [groupBySpecies, _setGroupBySpecies] = useState(true);
    const [groupByWeaponType, _setGroupByWeaponType] = useState(true);

    // Filter wrappers that auto-reset pagination
    const setSearchQuery = (v: string) => { _setSearchQuery(v); setPage(1); };
    const setSortBy = (v: SortOption) => { _setSortBy(v); setPage(1); };
    const setWeaponTypeFilter = (v: string) => { _setWeaponTypeFilter(v); setPage(1); };
    const setWeaponElementFilter = (v: string) => { _setWeaponElementFilter(v); setPage(1); };
    const setSkillKindFilter = (v: string) => { _setSkillKindFilter(v); setPage(1); };
    const setDecoSlotFilter = (v: string) => { _setDecoSlotFilter(v); setPage(1); };
    const setMonsterKindFilter = (v: string) => { _setMonsterKindFilter(v); setPage(1); };
    const setMonsterWeaknessFilter = (v: string) => { _setMonsterWeaknessFilter(v); setPage(1); };
    const setGroupBySpecies = (v: boolean) => { _setGroupBySpecies(v); setPage(1); };
    const setGroupByWeaponType = (v: boolean) => { _setGroupByWeaponType(v); setPage(1); };

    // Reset page on category change, but persist the user's filters
    useEffect(() => {
        setPage(1);
    }, [activeCategory]);

    // Sort helper
    const compareItems = useCallback((a: any, b: any) => {
        switch (_sortBy) {
            case 'name-asc': return (a.name || '').localeCompare(b.name || '') || ((a.id || 0) - (b.id || 0));
            case 'name-desc': return (b.name || '').localeCompare(a.name || '') || ((a.id || 0) - (b.id || 0));
            case 'rarity-asc': return ((a.rarity || 0) - (b.rarity || 0)) || ((a.id || 0) - (b.id || 0));
            case 'rarity-desc': return ((b.rarity || 0) - (a.rarity || 0)) || ((a.id || 0) - (b.id || 0));
            default: return ((a.id || 0) - (b.id || 0));
        }
    }, [_sortBy]);

    const sortItems = useCallback(<T extends { name?: string; rarity?: number; id?: number }>(items: T[]): T[] => {
        return [...items].sort(compareItems);
    }, [compareItems]);

    // Derived filter options
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

    const monsterKinds = useMemo(() => {
        if (activeCategory !== 'monsters') return [];
        return Array.from(new Set((currentData as Monster[]).map(m => m.kind).filter(Boolean))).sort();
    }, [currentData, activeCategory]);

    // Filtered + sorted data
    const filteredData = useMemo(() => {
        const q = _searchQuery.toLowerCase();

        switch (activeCategory) {
            case 'monsters': {
                const filtered = (currentData as Monster[]).filter(m => {
                    const matchesText = (m.name || '').toLowerCase().includes(q) || (m.species || '').toLowerCase().includes(q);
                    const matchesKind = monsterKindFilter === 'all' || m.kind === monsterKindFilter;
                    if (!matchesText || !matchesKind) return false;
                    if (monsterWeaknessFilter !== 'all') {
                        return m.weaknesses?.some(w =>
                            (w.element === monsterWeaknessFilter || w.status === monsterWeaknessFilter) && w.level > 0
                        );
                    }
                    return true;
                });
                if (groupBySpecies) {
                    return filtered.sort((a, b) => {
                        const sa = SPECIES_LABELS[a.species] || a.species;
                        const sb = SPECIES_LABELS[b.species] || b.species;
                        const diff = sa.localeCompare(sb);
                        if (diff !== 0) return diff;
                        return compareItems(a, b);
                    });
                }
                return sortItems(filtered as (Monster & { rarity?: number })[]);
            }
            case 'weapons': {
                const filtered = (currentData as Weapon[]).filter(w => {
                    const matchesText = (w.name || '').toLowerCase().includes(q);
                    if (!matchesText) return false;
                    if (weaponTypeFilter !== 'all' && w.kind !== weaponTypeFilter) return false;
                    if (weaponElementFilter !== 'all') {
                        return w.specials?.some(s => s.element === weaponElementFilter || s.status === weaponElementFilter);
                    }
                    return true;
                });
                if (groupByWeaponType) {
                    // Canonical MH weapon order + internal ID for true weapon tree relationships
                    const kindOrder = Object.keys(WEAPON_KIND_LABELS);
                    return filtered.sort((a, b) => {
                        const ia = kindOrder.indexOf(a.kind);
                        const ib = kindOrder.indexOf(b.kind);
                        if (ia !== ib) return ia - ib;
                        return compareItems(a, b);
                    });
                }
                return sortItems(filtered);
            }
            case 'armor-sets': {
                const filtered = (currentData as ArmorSet[]).filter(s => (s.name || '').toLowerCase().includes(q));
                // Sort by min rarity of pieces (low→high), then by ID to keep relationships
                return filtered.sort((a, b) => {
                    const ra = Math.min(...(a.pieces?.map(p => p.rarity) || [99]));
                    const rb = Math.min(...(b.pieces?.map(p => p.rarity) || [99]));
                    return (ra - rb) || (a.id - b.id);
                });
            }
            case 'skills': {
                const filtered = (currentData as Skill[]).filter(s => {
                    const matchesText = (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q);
                    const matchesKind = skillKindFilter === 'all' || s.kind === skillKindFilter;
                    return matchesText && matchesKind;
                });
                // Sort by kind group priority, then gameId/id
                const kindOrder: Record<string, number> = { armor: 0, weapon: 1, 'set-bonus': 2, 'group-bonus': 3 };
                return filtered.sort((a, b) => {
                    const ka = kindOrder[a.kind] ?? 99;
                    const kb = kindOrder[b.kind] ?? 99;
                    return (ka - kb) || ((a.gameId || a.id) - (b.gameId || b.id));
                });
            }
            case 'items': {
                const filtered = (currentData as Item[]).filter(i => (i.name || '').toLowerCase().includes(q));
                // Sort by rarity low→high, then gameId/id to group related items
                return filtered.sort((a, b) => (a.rarity - b.rarity) || ((a.gameId || a.id) - (b.gameId || b.id)));
            }
            case 'decorations': {
                const filtered = (currentData as Decoration[]).filter(d => {
                    const matchesText = (d.name || '').toLowerCase().includes(q);
                    const matchesSlot = decoSlotFilter === 'all' || String(d.slot) === decoSlotFilter;
                    return matchesText && matchesSlot;
                });
                // Sort by slot ascending, then rarity, then gameId
                return filtered.sort((a, b) => (a.slot - b.slot) || (a.rarity - b.rarity) || ((a.gameId || a.id) - (b.gameId || b.id)));
            }
            case 'charms': {
                // Sort by gameId/id
                return (currentData as Charm[]).filter(c =>
                    c.ranks.some(r => r.name.toLowerCase().includes(q))
                ).sort((a, b) => (a.gameId || a.id) - (b.gameId || b.id));
            }
            case 'locations': {
                return (currentData as MHLocation[]).filter(l => l.name.toLowerCase().includes(q))
                    .sort((a, b) => (a.zoneCount - b.zoneCount) || (a.id - b.id));
            }
            case 'ailments': {
                return (currentData as Ailment[]).filter(a => a.name.toLowerCase().includes(q))
                    .sort((a, b) => a.id - b.id);
            }
            default:
                return currentData;
        }
    }, [currentData, _searchQuery, activeCategory, weaponTypeFilter, weaponElementFilter, skillKindFilter, decoSlotFilter, monsterKindFilter, monsterWeaknessFilter, _sortBy, sortItems, compareItems, groupBySpecies, groupByWeaponType]);

    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    const pagedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return {
        // Search & Sort
        searchQuery: _searchQuery, setSearchQuery,
        sortBy: _sortBy, setSortBy,
        page, setPage,

        // Category-specific filters
        weaponTypeFilter, setWeaponTypeFilter,
        weaponElementFilter, setWeaponElementFilter,
        skillKindFilter, setSkillKindFilter,
        decoSlotFilter, setDecoSlotFilter,
        monsterKindFilter, setMonsterKindFilter,
        monsterWeaknessFilter, setMonsterWeaknessFilter,

        // Grouping
        groupBySpecies, setGroupBySpecies,
        groupByWeaponType, setGroupByWeaponType,

        // Derived
        weaponTypes,
        monsterKinds,
        monsterWeaknesses,
        weaponElements,
        filteredData,
        pagedData,
        totalPages,
    };
}
