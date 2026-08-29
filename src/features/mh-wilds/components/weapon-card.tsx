import type { Weapon, Sharpness } from '../types';
import { Badge } from '@/components/ui/badge';
import { ELEMENT_COLORS, ELEMENT_ICONS, WEAPON_KIND_LABELS, RARITY_TEXT_COLORS, CARD_CLS, STAT_BOX_CLS, getWeaponIconUrl } from '../constants';

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
        <div className="flex h-2 cyber-clip-sm overflow-hidden bg-[#04060f] w-full border border-primary/20">
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
    const rarityColor = RARITY_TEXT_COLORS[weapon.rarity] || 'text-primary/70';

    return (
        <div
            className={`${CARD_CLS} ${onClick ? 'cursor-pointer' : ''} font-mono`}
            onClick={() => onClick?.(weapon)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                            <WeaponTypeIcon kind={weapon.kind} size={22} rarity={weapon.rarity} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate uppercase group-hover:text-primary transition-colors">{weapon.name}</h3>
                            <p className="text-[10px] text-primary/60 mt-0.5 uppercase">// {kindLabel}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-bold ${rarityColor} px-1.5 py-0.5 cyber-clip-tag border border-primary/30 bg-primary/5`}>R{weapon.rarity}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mb-3">
                    <div className={`${STAT_BOX_CLS} px-2.5 py-1.5 text-center`}>
                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">ATK</p>
                        <p className="text-xs font-bold text-white mt-0.5">{weapon.damage.display}</p>
                    </div>
                    <div className={`${STAT_BOX_CLS} px-2.5 py-1.5 text-center`}>
                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">AFF</p>
                        <p className={`text-xs font-bold mt-0.5 ${weapon.affinity > 0 ? 'text-primary' : weapon.affinity < 0 ? 'text-destructive' : 'text-primary/60'}`}>
                            {weapon.affinity > 0 ? '+' : ''}{weapon.affinity}%
                        </p>
                    </div>
                    <div className={`${STAT_BOX_CLS} px-2.5 py-1.5 text-center`}>
                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">SLOT</p>
                        <p className="text-xs font-bold text-white mt-0.5">
                            {weapon.slots.length > 0 ? weapon.slots.map(s => `[${s}]`).join('') : '—'}
                        </p>
                    </div>
                </div>

                {weapon.specials.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-2.5">
                        {weapon.specials.map((sp) => {
                            const name = sp.element || sp.status || '';
                            return (
                                <Badge key={sp.id} className={`text-[10px] font-mono border ${ELEMENT_COLORS[name] || 'bg-primary/10 text-primary border-primary/30'} ${sp.hidden ? 'opacity-50' : ''}`}>
                                    {ELEMENT_ICONS[name] || '◆'} {name} {sp.damage.display}
                                    {sp.hidden && ' (hid)'}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {weapon.sharpness && <SharpnessBar sharpness={weapon.sharpness} />}

                {weapon.skills.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-2.5 pt-2.5 border-t border-primary/20">
                        {weapon.skills.map((sk) => (
                            <Badge key={sk.id} className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/30">
                                {sk.skill.name} Lv{sk.level}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
