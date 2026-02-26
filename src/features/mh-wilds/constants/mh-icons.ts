// Local MHW icon paths from public/img/MHW/
// SVGs are organized by type and rank (rarity-based coloring)

const MHW_IMG = '/img/MHW';

// === Weapon Icons ===
// Pattern: /img/MHW/Weapons/{FolderName}/{FileName}_Rank_{rarity}.svg

const WEAPON_FOLDER_MAP: Record<string, string> = {
    'great-sword': 'Great_Sword',
    'long-sword': 'Long_Sword',
    'sword-and-shield': 'Sword_&_Shield',
    'dual-blades': 'Dual_Blades',
    'hammer': 'Hammer',
    'hunting-horn': 'Hunting_Horn',
    'lance': 'Lance',
    'gunlance': 'Gunlance',
    'switch-axe': 'Switch_Axe',
    'charge-blade': 'Charge_Blade',
    'insect-glaive': 'Insect_Glaive',
    'light-bowgun': 'Light_Bowgun',
    'heavy-bowgun': 'Heavy_Bowgun',
    'bow': 'Bow',
};

/** Clamp rarity to valid range 1-12 */
function clampRarity(rarity: number): string {
    const r = Math.max(1, Math.min(12, rarity || 1));
    return r.toString().padStart(2, '0');
}

/** Get weapon type icon URL by weapon kind and rarity */
export function getWeaponIconUrl(kind: string, rarity: number = 1): string {
    const folder = WEAPON_FOLDER_MAP[kind];
    if (!folder) return `${MHW_IMG}/Weapons/Great_Sword/Great_Sword_Rank_01.svg`;
    return `${MHW_IMG}/Weapons/${folder}/${folder}_Rank_${clampRarity(rarity)}.svg`;
}

// Keep old export for compatibility (used by WeaponTypeIcon)
export const WEAPON_TYPE_ICONS: Record<string, string> = Object.fromEntries(
    Object.entries(WEAPON_FOLDER_MAP).map(([kind, folder]) => [
        kind,
        `${MHW_IMG}/Weapons/${folder}/${folder}_Rank_01.svg`,
    ])
);

// === Armor Kind Icons ===
// Pattern: /img/MHW/Hunter/{Folder}/{Name}_Rank_{rarity}.svg

const ARMOR_KIND_FOLDER_MAP: Record<string, { folder: string; name: string }> = {
    head: { folder: 'Helm', name: 'Helm' },
    chest: { folder: 'Chest', name: 'Chest' },
    arms: { folder: 'Arms', name: 'Arms' },
    waist: { folder: 'Torso', name: 'Torso' },
    legs: { folder: 'Legs', name: 'Legs' },
};

/** Get armor piece icon URL by kind and rarity */
export function getArmorKindIconUrl(kind: string, rarity: number = 1): string {
    const entry = ARMOR_KIND_FOLDER_MAP[kind];
    if (!entry) return `${MHW_IMG}/Hunter/Helm/Helm_Rank_01.svg`;
    return `${MHW_IMG}/Hunter/${entry.folder}/${entry.name}_Rank_${clampRarity(rarity)}.svg`;
}

// === Armor Set Icon ===
/** Get armor set icon URL by rarity */
export function getArmorSetIconUrl(rarity: number = 1): string {
    return `${MHW_IMG}/Hunter/Set/Set_Rank_${clampRarity(rarity)}.svg`;
}

// === Charm Icon ===
/** Get charm icon URL by rarity */
export function getCharmIconUrl(rarity: number = 1): string {
    return `${MHW_IMG}/Hunter/Charm/Charm_Rank_${clampRarity(rarity)}.svg`;
}

// === Decoration Icons ===
// Pattern: /img/MHW/Decorations/Color_{XX}_Rank_{slot}.svg
// Rank corresponds to slot level (1-4), Color is for visual variety

/** Get decoration icon URL by slot level */
export function getDecorationIconUrl(slotLevel: number = 1, colorIndex: number = 0): string {
    const color = colorIndex.toString().padStart(2, '0');
    const rank = Math.max(1, Math.min(4, slotLevel));
    return `${MHW_IMG}/Decorations/Color_${color}_Rank_${rank}.svg`;
}

// === Monster Icons (still from wiki) ===
export function getMonsterIconUrl(monsterName: string): string {
    const filename = `MHWilds-${monsterName.replace(/ /g, '_')}_Icon.webp`;
    return `https://monsterhunterwiki.org/wiki/Special:FilePath/${filename}`;
}

