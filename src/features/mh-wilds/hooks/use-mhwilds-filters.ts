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
