// === Element Colors & Icons (used by monster-card, weapon-card, monster-detail) ===

export const ELEMENT_COLORS: Record<string, string> = {
    fire: 'bg-red-500/20 text-red-400 border-red-500/30',
    water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    thunder: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dragon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    poison: 'bg-green-500/20 text-green-400 border-green-500/30',
    sleep: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    paralysis: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    blast: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    stun: 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30',
};

export const ELEMENT_ICONS: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    thunder: '⚡',
    ice: '❄️',
    dragon: '🐉',
    poison: '☠️',
    sleep: '😴',
    paralysis: '⚡',
    blast: '💥',
};

// === Species Labels ===

export const SPECIES_LABELS: Record<string, string> = {
    'flying-wyvern': 'Flying Wyvern',
    'brute-wyvern': 'Brute Wyvern',
    'fanged-wyvern': 'Fanged Wyvern',
    'piscine-wyvern': 'Piscine Wyvern',
    'bird-wyvern': 'Bird Wyvern',
    'elder-dragon': 'Elder Dragon',
    'herbivore': 'Herbivore',
    'fanged-beast': 'Fanged Beast',
    'leviathan': 'Leviathan',
    'temnoceran': 'Temnoceran',
    'neopteron': 'Neopteron',
    'carapaceon': 'Carapaceon',
};

// === Weapon Kind Labels ===

export const WEAPON_KIND_LABELS: Record<string, string> = {
    'great-sword': 'Great Sword',
    'long-sword': 'Long Sword',
    'sword-and-shield': 'Sword & Shield',
    'dual-blades': 'Dual Blades',
    'hammer': 'Hammer',
    'hunting-horn': 'Hunting Horn',
    'lance': 'Lance',
    'gunlance': 'Gunlance',
    'switch-axe': 'Switch Axe',
    'charge-blade': 'Charge Blade',
    'insect-glaive': 'Insect Glaive',
    'light-bowgun': 'Light Bowgun',
    'heavy-bowgun': 'Heavy Bowgun',
    'bow': 'Bow',
};

// === Rarity Colors ===

export const RARITY_COLORS: Record<number, string> = {
    1: 'bg-slate-600', 2: 'bg-slate-500', 3: 'bg-green-600', 4: 'bg-blue-600',
    5: 'bg-purple-600', 6: 'bg-amber-600', 7: 'bg-orange-600', 8: 'bg-red-600',
    9: 'bg-pink-600', 10: 'bg-cyan-600',
};

export const RARITY_TEXT_COLORS: Record<number, string> = {
    1: 'text-slate-400', 2: 'text-slate-300', 3: 'text-green-400',
    4: 'text-blue-400', 5: 'text-purple-400', 6: 'text-amber-400',
    7: 'text-orange-400', 8: 'text-red-400', 9: 'text-pink-400', 10: 'text-cyan-400',
};

// === Armor Kind Icons ===

export const ARMOR_KIND_ICONS: Record<string, string> = {
    head: '🪖',
    chest: '🛡️',
    arms: '🧤',
    waist: '🩱',
    legs: '👢',
};

// === Sorting ===

export type SortOption = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name A→Z' },
    { value: 'name-desc', label: 'Name Z→A' },
    { value: 'rarity-asc', label: 'Rarity ↑' },
    { value: 'rarity-desc', label: 'Rarity ↓' },
];

export const PER_PAGE = 24;

// === Element Resistance Color Helper ===

export const ELEMENT_RES_COLORS = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-600',
};
