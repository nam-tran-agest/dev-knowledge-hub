import type { Monster } from '../types';
import { Swords } from 'lucide-react';

function HitzoneCell({ value, isElement }: { value: number; isElement?: boolean }) {
    const displayValue = Math.round(value * 100);
    let color = 'text-primary/30';
    if (isElement) {
        if (value >= 0.25) color = 'text-primary font-bold';
        else if (value >= 0.15) color = 'text-amber-400';
        else if (value >= 0.05) color = 'text-primary/70';
        else color = 'text-primary/30';
    } else {
        if (value >= 0.6) color = 'text-primary font-bold';
        else if (value >= 0.45) color = 'text-amber-400';
        else if (value >= 0.25) color = 'text-primary/70';
        else color = 'text-primary/30';
    }

    return (
        <td className={`text-center px-1.5 py-1.5 font-mono text-xs ${color}`}>
            {displayValue}
        </td>
    );
}

export function MonsterPartsTable({ monster }: { monster: Monster }) {
    if (monster.parts.length === 0) return null;

    return (
        <div className="space-y-2.5 font-mono">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5 text-primary" />
                // HITZONES & MULTIPLIERS
            </h4>
            <div className="overflow-x-auto cyber-clip bg-[#040711]/90 border border-primary/30 p-2">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-primary/60 border-b border-primary/20 font-mono text-[10px]">
                            <th className="text-left py-1.5 pr-2 font-bold uppercase">PART</th>
                            <th className="text-center px-1 py-1.5 font-bold uppercase">CUT</th>
                            <th className="text-center px-1 py-1.5 font-bold uppercase">BLNT</th>
                            <th className="text-center px-1 py-1.5 font-bold uppercase">SHOT</th>
                            <th className="text-center px-1 py-1.5 font-bold">🔥</th>
                            <th className="text-center px-1 py-1.5 font-bold">💧</th>
                            <th className="text-center px-1 py-1.5 font-bold">⚡</th>
                            <th className="text-center px-1 py-1.5 font-bold">❄️</th>
                            <th className="text-center px-1 py-1.5 font-bold">🐉</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monster.parts.map((part) => (
                            <tr key={part.id} className="border-b border-primary/10 hover:bg-primary/5">
                                <td className="py-1.5 pr-2 text-slate-200 font-medium capitalize font-mono text-xs">
                                    {part.kind.replace(/-/g, ' ')}
                                </td>
                                <HitzoneCell value={part.multipliers.slash} />
                                <HitzoneCell value={part.multipliers.blunt} />
                                <HitzoneCell value={part.multipliers.pierce} />
                                <HitzoneCell value={part.multipliers.fire} isElement />
                                <HitzoneCell value={part.multipliers.water} isElement />
                                <HitzoneCell value={part.multipliers.thunder} isElement />
                                <HitzoneCell value={part.multipliers.ice} isElement />
                                <HitzoneCell value={part.multipliers.dragon} isElement />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
