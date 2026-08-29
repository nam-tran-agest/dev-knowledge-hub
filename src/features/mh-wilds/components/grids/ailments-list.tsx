import { Skull } from 'lucide-react';
import type { Ailment } from '../../types';
import { GridLayout } from '../ui/shared';
import { CARD_CLS } from '../../constants';

export function AilmentsList({ ailments }: { ailments: Ailment[] }) {
    return (
        <GridLayout cols={2}>
            {ailments.map(ail => (
                <div key={ail.id} className={`${CARD_CLS} flex flex-col h-full font-mono`}>
                    <div className="p-4 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-2.5 shrink-0">
                            <div className="w-10 h-10 cyber-clip-button bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                                <Skull className="w-4 h-4 text-destructive" />
                            </div>
                            <h3 className="text-base font-bold text-white uppercase tracking-wider">{ail.name}</h3>
                        </div>
                        <p className="text-xs text-primary/60 mb-3 leading-relaxed flex-1">{ail.description}</p>

                        <div className="space-y-2 mt-auto shrink-0">
                            {ail.recovery && (ail.recovery.actions.length > 0 || ail.recovery.items.length > 0) && (
                                <div className="bg-primary/5 border border-primary/20 cyber-clip-button p-2.5">
                                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">// RECOVERY_PROTOCOLS</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.recovery.actions.map(a => (
                                            <span key={a} className="text-[10px] bg-primary/10 text-primary border border-primary/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">{a}</span>
                                        ))}
                                        {ail.recovery.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-primary/10 text-primary border border-primary/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">{it.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {ail.protection && (ail.protection.skills.length > 0 || ail.protection.items.length > 0) && (
                                <div className="bg-purple-500/5 border border-purple-500/20 cyber-clip-button p-2.5">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">// DEFENSE_COUNTERMEASURES</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {ail.protection.skills.map(sk => (
                                            <span key={sk.id} className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">{sk.name}</span>
                                        ))}
                                        {ail.protection.items.map(it => (
                                            <span key={it.id} className="text-[10px] bg-primary/10 text-primary border border-primary/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">{it.name}</span>
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
