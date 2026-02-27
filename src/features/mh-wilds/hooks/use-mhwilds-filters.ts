'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Monster, Weapon, Skill, Item, Decoration, Charm, Location as MHLocation, Ailment, ArmorSet } from '../types';
import { SPECIES_LABELS, WEAPON_KIND_LABELS, PER_PAGE, type SortOption } from '../constants';
import type { Category } from './use-mhwilds-data';

export type { Category };

export function useMHWildsFilters(activeCategory: Category, currentData: unknown[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');

    // Category-specific filters
    const [weaponTypeFilter, setWeaponTypeFilter] = useState('all');
    const [weaponElementFilter, setWeaponElementFilter] = useState('all');
    const [skillKindFilter, setSkillKindFilter] = useState('all');
    const [decoSlotFilter, setDecoSlotFilter] = useState('all');
    const [monsterKindFilter, setMonsterKindFilter] = useState('all');
    const [monsterWeaknessFilter, setMonsterWeaknessFilter] = useState('all');

    // Grouping toggles
    const [groupBySpecies, setGroupBySpecies] = useState(true);
    const [groupByWeaponType, setGroupByWeaponType] = useState(true);

    // Reset on category change
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

    // Filtered + sorted data
    const filteredData = useMemo(() => {
        const q = searchQuery.toLowerCase();

        switch (activeCategory) {
            case 'monsters': {
                const filtered = (currentData as Monster[]).filter(m => {
                    const matchesText = m.name.toLowerCase().includes(q) || m.species.toLowerCase().includes(q);
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
                        return sa.localeCompare(sb) || (a.id - b.id);
                    });
                }
                return sortItems(filtered as (Monster & { rarity?: number })[]);
            }
            case 'weapons': {
                const filtered = (currentData as Weapon[]).filter(w => {
                    if (!w.name.toLowerCase().includes(q)) return false;
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
                        return (ia - ib) || (a.id - b.id);
                    });
                }
                return sortItems(filtered);
            }
            case 'armor-sets': {
                const filtered = (currentData as ArmorSet[]).filter(s => s.name.toLowerCase().includes(q));
                // Sort by min rarity of pieces (low→high), then by ID to keep relationships
                return filtered.sort((a, b) => {
                    const ra = Math.min(...(a.pieces?.map(p => p.rarity) || [99]));
                    const rb = Math.min(...(b.pieces?.map(p => p.rarity) || [99]));
                    return (ra - rb) || (a.id - b.id);
                });
            }
            case 'skills': {
                const filtered = (currentData as Skill[]).filter(s =>
                    s.name.toLowerCase().includes(q) && (skillKindFilter === 'all' || s.kind === skillKindFilter)
                );
                // Sort by kind group priority, then gameId/id
                const kindOrder: Record<string, number> = { armor: 0, weapon: 1, 'set-bonus': 2, 'group-bonus': 3 };
                return filtered.sort((a, b) => {
                    const ka = kindOrder[a.kind] ?? 99;
                    const kb = kindOrder[b.kind] ?? 99;
                    return (ka - kb) || ((a.gameId || a.id) - (b.gameId || b.id));
                });
            }
            case 'items': {
                const filtered = (currentData as Item[]).filter(i => i.name.toLowerCase().includes(q));
                // Sort by rarity low→high, then gameId/id to group related items
                return filtered.sort((a, b) => (a.rarity - b.rarity) || ((a.gameId || a.id) - (b.gameId || b.id)));
            }
            case 'decorations': {
                const filtered = (currentData as Decoration[]).filter(d =>
                    d.name.toLowerCase().includes(q) && (decoSlotFilter === 'all' || String(d.slot) === decoSlotFilter)
                );
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
    }, [currentData, searchQuery, activeCategory, weaponTypeFilter, weaponElementFilter, skillKindFilter, decoSlotFilter, monsterKindFilter, monsterWeaknessFilter, sortBy, sortItems, groupBySpecies, groupByWeaponType]);

    const totalPages = Math.ceil(filteredData.length / PER_PAGE);
    const pagedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return {
        // Search & Sort
        searchQuery, setSearchQuery,
        sortBy, setSortBy,
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
        monsterWeaknesses,
        weaponElements,
        filteredData,
        pagedData,
        totalPages,
    };
}
