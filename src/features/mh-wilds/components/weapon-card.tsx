import type { Weapon, Sharpness } from '../types';
import { Badge } from '@/components/ui/badge';
import { ELEMENT_COLORS, ELEMENT_ICONS } from './monster-card';
import { WEAPON_TYPE_ICONS } from '../constants/mh-icons';

const WEAPON_KIND_LABELS: Record<string, string> = {
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

const RARITY_COLORS: Record<number, string> = {
    1: 'text-slate-400', 2: 'text-slate-300', 3: 'text-green-400',
    4: 'text-blue-400', 5: 'text-purple-400', 6: 'text-amber-400',
    7: 'text-orange-400', 8: 'text-red-400', 9: 'text-pink-400', 10: 'text-cyan-400',
};

function SharpnessBar({ sharpness }: { sharpness: Sharpness }) {
    const total = Object.values(sharpness).reduce((sum, val) => sum + val, 0);
    if (total === 0) return null;
    const segments = [
        { key: 'red', value: sharpness.red, color: 'bg-red-500' },
        { key: 'orange', value: sharpness.orange, color: 'bg-orange-500' },
        { key: 'yellow', value: sharpness.yellow, color: 'bg-yellow-400' },
        { key: 'green', value: sharpness.green, color: 'bg-green-500' },
        { key: 'blue', value: sharpness.blue, color: 'bg-blue-500' },
        { key: 'white', value: sharpness.white, color: 'bg-white' },
        { key: 'purple', value: sharpness.purple, color: 'bg-purple-500' },
    ];
    return (
        <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800 w-full">
            {segments.map((seg) =>
                seg.value > 0 ? (
                    <div key={seg.key} className={`${seg.color} transition-all`} style={{ width: `${(seg.value / total) * 100}%` }} />
                ) : null
            )}
        </div>
    );
}

// Weapon type icon — real MH Wiki assets
export function WeaponTypeIcon({ kind, size = 20 }: { kind: string; size?: number }) {
    const iconUrl = WEAPON_TYPE_ICONS[kind];
    if (!iconUrl) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt={WEAPON_KIND_LABELS[kind] || kind} style={{ width: size, height: size }} className="object-contain brightness-150" loading="lazy" referrerPolicy="no-referrer" />
    );
}

export function WeaponCard({ weapon }: { weapon: Weapon }) {
    const kindLabel = WEAPON_KIND_LABELS[weapon.kind] || weapon.kind;
    const rarityColor = RARITY_COLORS[weapon.rarity] || 'text-slate-400';

    return (
        <div className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
            <div className="p-5">
                {/* Header with real weapon icon */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                            <WeaponTypeIcon kind={weapon.kind} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-white truncate">{weapon.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{kindLabel}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-bold ${rarityColor}`}>R{weapon.rarity}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Attack</p>
                        <p className="text-sm font-bold text-white mt-0.5">{weapon.damage.display}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Affinity</p>
                        <p className={`text-sm font-bold mt-0.5 ${weapon.affinity > 0 ? 'text-emerald-400' : weapon.affinity < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                            {weapon.affinity > 0 ? '+' : ''}{weapon.affinity}%
                        </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Slots</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                            {weapon.slots.length > 0 ? weapon.slots.map(s => `[${s}]`).join('') : '—'}
                        </p>
                    </div>
                </div>

                {/* Element/Status */}
                {weapon.specials.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                        {weapon.specials.map((sp) => {
                            const name = sp.element || sp.status || '';
                            return (
                                <Badge key={sp.id} className={`text-xs border ${ELEMENT_COLORS[name] || 'bg-slate-500/15 text-slate-400'} ${sp.hidden ? 'opacity-50' : ''}`}>
                                    {ELEMENT_ICONS[name] || '◆'} {name} {sp.damage.display}
                                    {sp.hidden && ' (hidden)'}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {weapon.sharpness && <SharpnessBar sharpness={weapon.sharpness} />}

                {weapon.skills.length > 0 && (
                    <div className="mt-3 flex gap-1.5 flex-wrap">
                        {weapon.skills.map((sk) => (
                            <Badge key={sk.id} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {sk.skill.name} Lv{sk.level}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export { WEAPON_KIND_LABELS };
