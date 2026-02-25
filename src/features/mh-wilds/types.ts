// === Monster Types ===

export interface MonsterSize {
    base: number;
    mini: number;
    silver: number;
    gold: number;
}

export interface MonsterLocation {
    id: number;
    gameId: number;
    name: string;
    zoneCount: number;
}

export interface MonsterResistance {
    id: number;
    kind: 'element' | 'status' | 'effect';
    element?: string;
    status?: string;
    effect?: string;
    condition: string | null;
}

export interface MonsterWeakness {
    id: number;
    kind: 'element' | 'status' | 'effect';
    element?: string;
    status?: string;
    effect?: string;
    level: number;
    condition: string | null;
}

export interface DamageMultipliers {
    slash: number;
    blunt: number;
    pierce: number;
    fire: number;
    water: number;
    thunder: number;
    ice: number;
    dragon: number;
    stun: number;
}

export interface MonsterPart {
    id: number;
    kind: string;
    part: string;
    name: string;
    health: number;
    kinsectEssence: string;
    multipliers: DamageMultipliers;
}

export interface MonsterRewardCondition {
    id: number;
    kind: string;
    rank: string;
    quantity: number;
    chance: number;
    part: string | null;
}

export interface MonsterRewardItem {
    id: number;
    gameId: number;
    rarity: number;
    name: string;
    description: string;
    value: number;
    carryLimit: number;
}

export interface MonsterReward {
    id: number;
    item: MonsterRewardItem;
    conditions: MonsterRewardCondition[];
}

export interface MonsterVariant {
    id: number;
    name: string;
    kind: string;
    monster: { id: number };
}

export interface Monster {
    id: number;
    gameId: number;
    name: string;
    description: string;
    kind: 'large' | 'small';
    species: string;
    size: MonsterSize;
    baseHealth: number;
    features: string;
    tips: string;
    elements: string[];
    ailments: unknown[];
    locations: MonsterLocation[];
    resistances: MonsterResistance[];
    weaknesses: MonsterWeakness[];
    rewards: MonsterReward[];
    parts: MonsterPart[];
    variants: MonsterVariant[];
}

// === Weapon Types ===

export interface WeaponDamage {
    raw: number;
    display: number;
}

export interface WeaponSpecial {
    id: number;
    kind: 'element' | 'status';
    element?: string;
    status?: string;
    damage: WeaponDamage;
    hidden: boolean;
}

export interface Sharpness {
    red: number;
    orange: number;
    yellow: number;
    green: number;
    blue: number;
    white: number;
    purple: number;
}

export interface WeaponSkill {
    id: number;
    skill: { id: number; name: string; description?: string };
    level: number;
    description: string;
}

export interface WeaponCraftingStub {
    id: number;
    name: string;
}

export interface WeaponCrafting {
    id: number;
    craftable: boolean;
    previous: WeaponCraftingStub | null;
    branches: WeaponCraftingStub[];
    craftingMaterials: unknown[];
    upgradeMaterials: unknown[];
    craftingZennyCost: number;
    upgradeZennyCost: number;
}

export interface WeaponSeries {
    id: number;
    gameId: number;
    name: string;
}

export type WeaponKind =
    | 'great-sword' | 'long-sword' | 'sword-and-shield'
    | 'dual-blades' | 'hammer' | 'hunting-horn'
    | 'lance' | 'gunlance' | 'switch-axe'
    | 'charge-blade' | 'insect-glaive'
    | 'light-bowgun' | 'heavy-bowgun' | 'bow';

export interface Weapon {
    id: number;
    gameId: number;
    name: string;
    description: string;
    kind: WeaponKind;
    rarity: number;
    damage: WeaponDamage;
    specials: WeaponSpecial[];
    affinity: number;
    defenseBonus: number;
    elderseal: string | null;
    slots: number[];
    skills: WeaponSkill[];
    sharpness?: Sharpness;
    handicraft?: number[];
    crafting: WeaponCrafting;
    series: WeaponSeries | null;
}

// === Armor Types ===

export interface ArmorDefense {
    base: number;
    max: number;
}

export interface ArmorResistances {
    fire: number;
    water: number;
    ice: number;
    thunder: number;
    dragon: number;
}

export interface ArmorSkill {
    id: number;
    skill: { id: number; gameId?: number; name: string };
    level: number;
    description: string;
}

export interface ArmorSetStub {
    id: number;
    name: string;
}

export interface ArmorCraftingMaterial {
    id: number;
    item: MonsterRewardItem;
    quantity: number;
}

export interface ArmorCrafting {
    id: number;
    materials: ArmorCraftingMaterial[];
    zennyCost: number;
}

export type ArmorKind = 'head' | 'chest' | 'arms' | 'waist' | 'legs';

export interface Armor {
    id: number;
    name: string;
    description: string;
    kind: ArmorKind;
    rank: string;
    rarity: number;
    defense: ArmorDefense;
    resistances: ArmorResistances;
    skills: ArmorSkill[];
    slots: number[];
    armorSet: ArmorSetStub;
    crafting: ArmorCrafting;
}

// === Skill Types ===

export interface SkillRank {
    id: number;
    skill: { id: number };
    level: number;
    name: string | null;
    description: string;
}

export interface Skill {
    id: number;
    gameId: number;
    name: string;
    kind: string;
    description: string;
    ranks: SkillRank[];
    icon?: { id: number; kind: string };
}

// === Item Types ===

export interface ItemRecipeInput {
    id: number;
    name: string;
}

export interface ItemRecipe {
    id: number;
    output: { id: number };
    amount: number;
    inputs: ItemRecipeInput[];
}

export interface ItemIcon {
    id: number;
    kind: string;
    colorId: number;
    color: string;
}

export interface Item {
    id: number;
    gameId: number;
    rarity: number;
    name: string;
    description: string;
    value: number;
    carryLimit: number;
    recipes: ItemRecipe[];
    icon?: ItemIcon;
}

// === Decoration Types ===

export interface DecorationSkill {
    id: number;
    skill: { id: number; name: string };
    level: number;
    description: string;
}

export interface Decoration {
    id: number;
    gameId: number;
    name: string;
    description: string;
    value: number;
    slot: number;
    rarity: number;
    kind: string;
    skills: DecorationSkill[];
    icon?: { color: string; colorId: number };
}

// === Charm Types ===

export interface CharmRankCrafting {
    id: number;
    craftable: boolean;
    materials: ArmorCraftingMaterial[];
    zennyCost: number;
}

export interface CharmRank {
    id: number;
    name: string;
    description: string;
    level: number;
    rarity: number;
    skills: DecorationSkill[];
    crafting: CharmRankCrafting;
}

export interface Charm {
    id: number;
    gameId: number;
    ranks: CharmRank[];
}

// === Location Types ===

export interface Camp {
    id: number;
    gameId: number;
    name: string;
    zone: number;
    floor: number;
    risk: string;
}

export interface Location {
    id: number;
    gameId: number;
    name: string;
    zoneCount: number;
    camps: Camp[];
}

// === Ailment Types ===

export interface AilmentRecovery {
    actions: string[];
    items: { id: number; name: string }[];
}

export interface AilmentProtection {
    items: { id: number; name: string }[];
    skills: { id: number; name: string; description: string }[];
}

export interface Ailment {
    id: number;
    name: string;
    description: string;
    recovery: AilmentRecovery;
    protection: AilmentProtection;
}

// === Armor Set Types ===

export interface ArmorSetBonusRank {
    id: number;
    pieces: number;
    skill: { id: number; skill: { id: number }; level: number; description: string };
}

export interface ArmorSetBonus {
    id: number;
    skill: { id: number; name: string };
    ranks: ArmorSetBonusRank[];
}

export interface ArmorSet {
    id: number;
    gameId: number;
    name: string;
    pieces: Armor[];
    bonus: ArmorSetBonus | null;
    groupBonus: ArmorSetBonus | null;
}

// === Motion Value Types ===

export interface MotionValue {
    id: number;
    name: string;
    weapon: string;
    damage: string;
    stun: number | null;
    exhaust: number | null;
    hits: number[];
}
