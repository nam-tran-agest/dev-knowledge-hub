import type { Monster } from '../types';
import { Swords } from 'lucide-react';

function HitzoneCell({ value, isElement }: { value: number; isElement?: boolean }) {
    const displayValue = Math.round(value * 100);
    let color = 'text-slate-600';
    if (isElement) {
        if (value >= 0.25) color = 'text-emerald-400 font-bold';
        else if (value >= 0.15) color = 'text-yellow-400';
        else if (value >= 0.05) color = 'text-slate-400';
        else color = 'text-slate-700';
    } else {
        if (value >= 0.6) color = 'text-emerald-400 font-bold';
        else if (value >= 0.45) color = 'text-yellow-400';
        else if (value >= 0.25) color = 'text-slate-400';
        else color = 'text-slate-600';
    }

    return (
        <td className={`text-center px-1.5 py-2 font-mono ${color}`}>
            {displayValue}
        </td>
    );
}

export function MonsterPartsTable({ monster }: { monster: Monster }) {
    if (monster.parts.length === 0) return null;

    return (
        <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                Hitzones & Part Multipliers
            </h4>
            <div className="overflow-x-auto rounded-2xl bg-[#040711]/60 border border-white/10 p-2">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-slate-500 border-b border-white/5 font-mono">
                            <th className="text-left py-2 pr-3 font-bold">Part</th>
                            <th className="text-center px-1.5 py-2 font-bold">✂ Cut</th>
                            <th className="text-center px-1.5 py-2 font-bold">🔨 Blunt</th>
                            <th className="text-center px-1.5 py-2 font-bold">🏹 Shot</th>
                            <th className="text-center px-1.5 py-2 font-bold">🔥</th>
                            <th className="text-center px-1.5 py-2 font-bold">💧</th>
                            <th className="text-center px-1.5 py-2 font-bold">⚡</th>
                            <th className="text-center px-1.5 py-2 font-bold">❄️</th>
                            <th className="text-center px-1.5 py-2 font-bold">🐉</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monster.parts.map((part) => (
                            <tr key={part.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                <td className="py-2 pr-3 text-slate-300 font-medium capitalize font-mono">
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
