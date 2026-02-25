// Real Monster Hunter weapon type icon URLs from MH Wiki (Fandom)
// Source: monsterhunter.fandom.com
// Note: Use referrerPolicy="no-referrer" on <img> to bypass hotlink protection

const WIKI_CDN = 'https://static.wikia.nocookie.net/monsterhunter/images';

export const WEAPON_TYPE_ICONS: Record<string, string> = {
    'great-sword': `${WIKI_CDN}/c/c2/Great_Sword_Icon_White.png/revision/latest`,
    'long-sword': `${WIKI_CDN}/1/1e/Long_Sword_Icon_White.png/revision/latest`,
    'sword-and-shield': `${WIKI_CDN}/e/e5/Sword_and_Shield_Icon_White.png/revision/latest`,
    'dual-blades': `${WIKI_CDN}/7/74/Dual_Blades_Icon_White.png/revision/latest`,
    'hammer': `${WIKI_CDN}/9/99/Hammer_Icon_White.png/revision/latest`,
    'hunting-horn': `${WIKI_CDN}/4/46/Hunting_Horn_Icon_White.png/revision/latest`,
    'lance': `${WIKI_CDN}/0/0b/Lance_Icon_White.png/revision/latest`,
    'gunlance': `${WIKI_CDN}/1/17/Gunlance_Icon_White.png/revision/latest`,
    'switch-axe': `${WIKI_CDN}/4/40/Switch_Axe_Icon_White.png/revision/latest`,
    'charge-blade': `${WIKI_CDN}/6/6c/Charge_Blade_Icon_White.png/revision/latest`,
    'insect-glaive': `${WIKI_CDN}/4/47/Insect_Glaive_Icon_White.png/revision/latest`,
    'light-bowgun': `${WIKI_CDN}/0/09/Light_Bowgun_Icon_White.png/revision/latest`,
    'heavy-bowgun': `${WIKI_CDN}/9/99/Heavy_Bowgun_Icon_White.png/revision/latest`,
    'bow': `${WIKI_CDN}/a/a4/Bow_Icon_White.png/revision/latest`,
};

// Monster icons from monsterhunterwiki.org
// Uses Special:FilePath which auto-redirects to the direct image URL
// Source: https://monsterhunterwiki.org/wiki/Category:MHWilds_Monster_Icons
// Naming: MHWilds-{MonsterName}_Icon.webp (512x512)

export function getMonsterIconUrl(monsterName: string): string {
    // Convert monster name to wiki filename format
    // e.g. "Yian Kut-Ku" → "Yian_Kut-Ku", "Gore Magala" → "Gore_Magala"
    const filename = `MHWilds-${monsterName.replace(/ /g, '_')}_Icon.webp`;
    return `https://monsterhunterwiki.org/wiki/Special:FilePath/${filename}`;
}
