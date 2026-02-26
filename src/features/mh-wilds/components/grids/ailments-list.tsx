import { Skull } from 'lucide-react';
import type { Ailment } from '../../types';
import { GridLayout } from '../ui/grid-layout';

export function AilmentsList({ ailments }: { ailments: Ailment[] }) {
    return (
        <GridLayout cols={2}>
            {ailments.map(ail => (
                <div key={ail.id} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col h-full">
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3 shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <Skull className="w-4 h-4 text-red-400" />
                            </div>
                            <h3 className="text-base font-bold text-white">{ail.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed flex-1">{ail.description}</p>

                        <div className="space-y-3 mt-auto shrink-0">
                            {ail.recovery && (ail.recovery.actions.length > 0 || ail.recovery.items.length > 0) && (
                                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1.5">💚 Recovery</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.recovery.actions.map(a => (
                                            <span key={a} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold capitalize">{a}</span>
                                        ))}
                                        {ail.recovery.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 font-bold">{it.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {ail.protection && (ail.protection.skills.length > 0 || ail.protection.items.length > 0) && (
                                <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1.5">🛡 Protection</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.protection.skills.map(sk => (
                                            <span key={sk.id} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5 font-bold">{sk.name}</span>
                                        ))}
                                        {ail.protection.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-2 py-0.5 font-bold">{it.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </GridLayout>
    );
}
