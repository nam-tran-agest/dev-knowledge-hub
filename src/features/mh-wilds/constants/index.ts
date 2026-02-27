// === MHWilds Constants ===
// Merged from shared.ts + mh-icons.ts. Single import: '../constants'

// ─── Element Colors & Icons ─────────────────────────────────
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
    fire: '🔥', water: '💧', thunder: '⚡', ice: '❄️', dragon: '🐉',
    poison: '☠️', sleep: '😴', paralysis: '⚡', blast: '💥',
};

// ─── Labels ─────────────────────────────────────────────────
export const SPECIES_LABELS: Record<string, string> = {
    'flying-wyvern': 'Flying Wyvern', 'brute-wyvern': 'Brute Wyvern',
    'fanged-wyvern': 'Fanged Wyvern', 'piscine-wyvern': 'Piscine Wyvern',
    'bird-wyvern': 'Bird Wyvern', 'elder-dragon': 'Elder Dragon',
    'herbivore': 'Herbivore', 'fanged-beast': 'Fanged Beast',
    'leviathan': 'Leviathan', 'temnoceran': 'Temnoceran',
    'neopteron': 'Neopteron', 'carapaceon': 'Carapaceon',
};

export const WEAPON_KIND_LABELS: Record<string, string> = {
    'great-sword': 'Great Sword', 'long-sword': 'Long Sword',
    'sword-shield': 'Sword & Shield', 'dual-blades': 'Dual Blades',
    'hammer': 'Hammer', 'hunting-horn': 'Hunting Horn',
    'lance': 'Lance', 'gunlance': 'Gunlance',
    'switch-axe': 'Switch Axe', 'charge-blade': 'Charge Blade',
    'insect-glaive': 'Insect Glaive', 'light-bowgun': 'Light Bowgun',
    'heavy-bowgun': 'Heavy Bowgun', 'bow': 'Bow',
};

// ─── Rarity Colors ──────────────────────────────────────────
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

export const ELEMENT_RES_COLORS = {
    positive: 'text-emerald-400', negative: 'text-red-400', neutral: 'text-slate-600',
};

// ─── Skill Kind Colors ──────────────────────────────────────
export const SKILL_KIND_COLORS: Record<string, string> = {
    armor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    weapon: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    'set-bonus': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'group-bonus': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
};

// ─── Glassmorphism Tokens ───────────────────────────────────
export const CARD_CLS = 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10';
export const STAT_BOX_CLS = 'bg-white/[0.10] backdrop-blur-sm rounded-lg';

// ─── Sorting & Pagination ───────────────────────────────────
export type SortOption = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name A→Z' }, { value: 'name-desc', label: 'Name Z→A' },
    { value: 'rarity-asc', label: 'Rarity ↑' }, { value: 'rarity-desc', label: 'Rarity ↓' },
];

export const PER_PAGE = 24;

// ─── Icon Helpers ───────────────────────────────────────────
const MHW_IMG = '/img/MHW';

function rr(rarity: number): string {
    return Math.max(1, Math.min(12, rarity || 1)).toString().padStart(2, '0');
}

const WEAPON_FOLDERS: Record<string, string> = {
    'great-sword': 'Great_Sword', 'long-sword': 'Long_Sword',
    'sword-shield': 'Sword_And_Shield', 'dual-blades': 'Dual_Blades',
    'hammer': 'Hammer', 'hunting-horn': 'Hunting_Horn',
    'lance': 'Lance', 'gunlance': 'Gunlance',
    'switch-axe': 'Switch_Axe', 'charge-blade': 'Charge_Blade',
    'insect-glaive': 'Insect_Glaive', 'light-bowgun': 'Light_Bowgun',
    'heavy-bowgun': 'Heavy_Bowgun', 'bow': 'Bow',
};

const ARMOR_FOLDERS: Record<string, [string, string]> = {
    head: ['Helm', 'Helm'], chest: ['Chest', 'Chest'], arms: ['Arms', 'Arms'],
    waist: ['Torso', 'Torso'], legs: ['Legs', 'Legs'],
};

export function getWeaponIconUrl(kind: string, rarity = 1): string {
    const f = WEAPON_FOLDERS[kind] || 'Great_Sword';
    return `${MHW_IMG}/Weapons/${f}/${f}_Rank_${rr(rarity)}.svg`;
}

export function getArmorKindIconUrl(kind: string, rarity = 1): string {
    const [folder, name] = ARMOR_FOLDERS[kind] || ['Helm', 'Helm'];
    return `${MHW_IMG}/Hunter/${folder}/${name}_Rank_${rr(rarity)}.svg`;
}

export const getArmorSetIconUrl = (rarity = 1) => `${MHW_IMG}/Hunter/Set/Set_Rank_${rr(rarity)}.svg`;
export const getCharmIconUrl = (rarity = 1) => `${MHW_IMG}/Hunter/Charm/Charm_Rank_${rr(rarity)}.svg`;

export function getDecorationIconUrl(slot = 1, color = 0): string {
    return `${MHW_IMG}/Decorations/Color_${color.toString().padStart(2, '0')}_Rank_${Math.max(1, Math.min(4, slot))}.svg`;
}

export function getMonsterIconUrl(name: string): string {
    return `https://monsterhunterwiki.org/wiki/Special:FilePath/MHWilds-${name.replace(/ /g, '_')}_Icon.webp`;
}
