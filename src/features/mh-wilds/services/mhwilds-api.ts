import type { Monster, Weapon, Armor, Skill, Item, Decoration, Charm, Location, Ailment, ArmorSet, MotionValue } from '../types';

const BASE_URL = 'https://wilds.mhdb.io/en';

async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error(`MH Wilds API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

// === Monsters ===
export async function getMonsters(): Promise<Monster[]> {
    return fetchApi<Monster[]>('/monsters');
}

export async function getMonster(id: number): Promise<Monster> {
    return fetchApi<Monster>(`/monsters/${id}`);
}

// === Weapons ===
export async function getWeapons(): Promise<Weapon[]> {
    return fetchApi<Weapon[]>('/weapons');
}

export async function getWeapon(id: number): Promise<Weapon> {
    return fetchApi<Weapon>(`/weapons/${id}`);
}

// === Armor ===
export async function getArmor(): Promise<Armor[]> {
    return fetchApi<Armor[]>('/armor');
}

export async function getArmorPiece(id: number): Promise<Armor> {
    return fetchApi<Armor>(`/armor/${id}`);
}

// === Armor Sets ===
export async function getArmorSets(): Promise<ArmorSet[]> {
    return fetchApi<ArmorSet[]>('/armor/sets');
}

// === Skills ===
export async function getSkills(): Promise<Skill[]> {
    return fetchApi<Skill[]>('/skills');
}

// === Items ===
export async function getItems(): Promise<Item[]> {
    return fetchApi<Item[]>('/items');
}

// === Decorations ===
export async function getDecorations(): Promise<Decoration[]> {
    return fetchApi<Decoration[]>('/decorations');
}

// === Charms ===
export async function getCharms(): Promise<Charm[]> {
    return fetchApi<Charm[]>('/charms');
}

// === Locations ===
export async function getLocations(): Promise<Location[]> {
    return fetchApi<Location[]>('/locations');
}

// === Ailments ===
export async function getAilments(): Promise<Ailment[]> {
    return fetchApi<Ailment[]>('/ailments');
}

// === Motion Values ===
export async function getMotionValues(): Promise<MotionValue[]> {
    return fetchApi<MotionValue[]>('/motion-values');
}
