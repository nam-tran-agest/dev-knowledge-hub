'use client';

import { useState, useCallback } from 'react';
import type { Monster, Weapon, Item, Armor } from '../types';

interface DetailSelection {
    selectedMonster: Monster | null;
    selectedWeapon: Weapon | null;
    selectedItem: Item | null;
    selectedArmor: Armor | null;
    setSelectedMonster: (m: Monster | null) => void;
    setSelectedWeapon: (w: Weapon | null) => void;
    setSelectedItem: (i: Item | null) => void;
    setSelectedArmor: (a: Armor | null) => void;
    clearAll: () => void;
}

export function useDetailSelection(): DetailSelection {
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null);

    const clearAll = useCallback(() => {
        setSelectedMonster(null);
        setSelectedWeapon(null);
        setSelectedItem(null);
        setSelectedArmor(null);
    }, []);

    return {
        selectedMonster, setSelectedMonster,
        selectedWeapon, setSelectedWeapon,
        selectedItem, setSelectedItem,
        selectedArmor, setSelectedArmor,
        clearAll,
    };
}
