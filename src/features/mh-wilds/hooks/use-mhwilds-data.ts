'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import * as api from '../services/mhwilds-api';

export type Category = 'monsters' | 'weapons' | 'armor-sets' | 'skills' | 'items' | 'decorations' | 'charms' | 'locations' | 'ailments';

export function useMHWildsData(activeCategory: Category) {
    const [data, setData] = useState<Record<string, unknown[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchKey, setRefetchKey] = useState(0);

    // Use a ref to check cache without adding `data` to callback deps
    const dataRef = useRef(data);
    dataRef.current = data;

    const fetchCategoryData = useCallback(async (cat: Category, force = false) => {
        if (!force && dataRef.current[cat]) return;
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
    }, []);

    useEffect(() => {
        fetchCategoryData(activeCategory, refetchKey > 0);
    }, [activeCategory, fetchCategoryData, refetchKey]);

    const refetch = useCallback(() => {
        setData(prev => {
            const n = { ...prev };
            delete n[activeCategory];
            return n;
        });
        setRefetchKey(k => k + 1);
    }, [activeCategory]);

    return {
        data,
        currentData: (data[activeCategory] || []) as unknown[],
        loading,
        error,
        refetch,
    };
}
