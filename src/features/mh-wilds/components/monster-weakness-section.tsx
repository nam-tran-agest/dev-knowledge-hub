import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { Shield, Target } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS } from '../constants';

export function MonsterWeaknessSection({ monster }: { monster: Monster }) {
    const elementWeaknesses = monster.weaknesses.filter(w => w.kind === 'element');
    const statusWeaknesses = monster.weaknesses.filter(w => w.kind === 'status');

    return (
        <div className="space-y-4 font-mono">
            <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-destructive" />
                    // WEAKNESS_PROFILES
                </h4>
                {elementWeaknesses.length > 0 && (
                    <div>
                        <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1.5">// ELEMENTAL_VULNERABILITY</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {elementWeaknesses.map((w) => {
                                const elName = w.element || '';
                                return (
                                    <Badge
                                        key={w.id}
                                        className={`text-xs border cyber-clip-tag ${ELEMENT_COLORS[elName] || 'bg-primary/10 text-primary border-primary/30'}`}
                                    >
                                        {ELEMENT_ICONS[elName] || '○'} {elName}
                                        {w.level > 1 && <span className="ml-1 font-bold">★{w.level}</span>}
                                        {w.condition && <span className="ml-1 opacity-60">({w.condition})</span>}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                )}
                {statusWeaknesses.length > 0 && (
                    <div>
                        <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-1.5">// STATUS_AFFLICTION</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {statusWeaknesses.map((w) => {
                                const statusName = w.status || '';
                                return (
                                    <Badge
                                        key={w.id}
                                        className={`text-xs border cyber-clip-tag ${ELEMENT_COLORS[statusName] || 'bg-primary/10 text-primary border-primary/30'}`}
                                    >
                                        {ELEMENT_ICONS[statusName] || '◆'} {statusName}
                                        {w.level > 1 && <span className="ml-1 font-bold">★{w.level}</span>}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {monster.resistances.length > 0 && (
                <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        // DAMAGE_RESISTANCES
                    </h4>
                    <div className="flex gap-1.5 flex-wrap">
                        {monster.resistances.map((r) => {
                            const name = r.element || r.status || r.effect || '';
                            return (
                                <Badge
                                    key={r.id}
                                    className={`text-xs border cyber-clip-tag ${ELEMENT_COLORS[name] || 'bg-primary/10 text-primary border-primary/30'}`}
                                >
                                    {ELEMENT_ICONS[name] || '●'} {name}
                                    {r.condition && <span className="ml-1 opacity-60">({r.condition})</span>}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
