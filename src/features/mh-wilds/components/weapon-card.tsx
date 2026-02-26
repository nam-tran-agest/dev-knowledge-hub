import type { Weapon, Sharpness } from '../types';
import { Badge } from '@/components/ui/badge';
import { ELEMENT_COLORS, ELEMENT_ICONS, WEAPON_KIND_LABELS, RARITY_TEXT_COLORS, getWeaponIconUrl } from '../constants';

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
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-800 w-full">
            {segments.map((seg) =>
                seg.value > 0 ? (
                    <div key={seg.key} className={`${seg.color} transition-all`} style={{ width: `${(seg.value / total) * 100}%` }} />
                ) : null
            )}
        </div>
    );
}

export function WeaponTypeIcon({ kind, size = 20, rarity = 1 }: { kind: string; size?: number; rarity?: number }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getWeaponIconUrl(kind, rarity)} alt={WEAPON_KIND_LABELS[kind] || kind} style={{ width: size, height: size }} className="object-contain" loading="lazy" />
    );
}

export function WeaponCard({ weapon, onClick }: { weapon: Weapon; onClick?: (w: Weapon) => void }) {
    const kindLabel = WEAPON_KIND_LABELS[weapon.kind] || weapon.kind;
    const rarityColor = RARITY_TEXT_COLORS[weapon.rarity] || 'text-slate-400';

    return (
        <div
            className={`bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={() => onClick?.(weapon)}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                            <WeaponTypeIcon kind={weapon.kind} size={24} rarity={weapon.rarity} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{weapon.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{kindLabel}</p>
                        </div>
                    </div>
                    <span className={`text-sm font-bold ${rarityColor}`}>R{weapon.rarity}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">Attack</p>
                        <p className="text-base font-bold text-white mt-0.5">{weapon.damage.display}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">Affinity</p>
                        <p className={`text-base font-bold mt-0.5 ${weapon.affinity > 0 ? 'text-emerald-400' : weapon.affinity < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                            {weapon.affinity > 0 ? '+' : ''}{weapon.affinity}%
                        </p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">Slots</p>
                        <p className="text-base font-bold text-white mt-0.5">
                            {weapon.slots.length > 0 ? weapon.slots.map(s => `[${s}]`).join('') : '—'}
                        </p>
                    </div>
                </div>

                {weapon.specials.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                        {weapon.specials.map((sp) => {
                            const name = sp.element || sp.status || '';
                            return (
                                <Badge key={sp.id} className={`text-sm border ${ELEMENT_COLORS[name] || 'bg-slate-500/15 text-slate-400'} ${sp.hidden ? 'opacity-50' : ''}`}>
                                    {ELEMENT_ICONS[name] || '◆'} {name} {sp.damage.display}
                                    {sp.hidden && ' (hidden)'}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {weapon.sharpness && <SharpnessBar sharpness={weapon.sharpness} />}

                {weapon.skills.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-white/5">
                        {weapon.skills.map((sk) => (
                            <Badge key={sk.id} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {sk.skill.name} Lv{sk.level}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
