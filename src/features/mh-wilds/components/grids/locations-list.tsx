import { MapPin } from 'lucide-react';
import type { Location as MHLocation } from '../../types';
import { GridLayout } from '../ui/shared';
import { CARD_CLS } from '../../constants';

export function LocationsList({ locations }: { locations: MHLocation[] }) {
    return (
        <GridLayout cols={2}>
            {locations.map(loc => (
                <div key={loc.id} className={`${CARD_CLS} flex flex-col h-full font-mono`}>
                    {/* Location header with cyber border */}
                    <div className="bg-[#04060f]/90 p-4 border-b border-primary/20 shrink-0">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider">{loc.name}</h3>
                                    <p className="text-[10px] text-primary/60 uppercase">// {loc.zoneCount} SECTORS</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loc.camps?.length > 0 ? (
                        <div className="p-4 space-y-1.5 mt-auto flex-1 bg-[#04060f]/50">
                            <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold mb-2">// ESTABLISHED_OUTPOSTS ({loc.camps.length})</p>
                            {loc.camps.map(camp => (
                                <div key={camp.id} className="flex items-center justify-between text-xs bg-primary/[0.03] cyber-clip-button px-3 py-2 border border-primary/20">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 ${camp.risk === 'safe' ? 'bg-primary shadow-[0_0_6px_var(--color-primary)]' : 'bg-amber-400'}`} />
                                        <span className="text-slate-200 uppercase">{camp.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase ${camp.risk === 'safe' ? 'text-primary' : 'text-amber-400'}`}>[ {camp.risk} ]</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 bg-[#04060f]/50"></div>
                    )}
                </div>
            ))}
        </GridLayout>
    );
}
