import { MapPin } from 'lucide-react';
import type { Location as MHLocation } from '../../types';
import { GridLayout } from '../ui/shared';
import { CARD_CLS } from '../../constants';

export function LocationsList({ locations }: { locations: MHLocation[] }) {
    return (
        <GridLayout cols={2}>
            {locations.map(loc => (
                <div key={loc.id} className={`${CARD_CLS} flex flex-col h-full`}>
                    {/* Location header with gradient */}
                    <div className="bg-gradient-to-r from-lime-600/10 to-emerald-600/5 p-5 border-b border-white/5 shrink-0">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-lime-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{loc.name}</h3>
                                    <p className="text-sm text-slate-500">{loc.zoneCount} zones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {loc.camps?.length > 0 ? (
                        <div className="p-4 space-y-1.5 mt-auto flex-1 bg-black/20">
                            <p className="text-xs text-slate-600 uppercase tracking-widest font-bold mb-2">⛺ Camps ({loc.camps.length})</p>
                            {loc.camps.map(camp => (
                                <div key={camp.id} className="flex items-center justify-between text-sm bg-white/[0.02] rounded-lg px-3 py-2.5 border border-white/[0.03]">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${camp.risk === 'safe' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <span className="text-slate-300">{camp.name}</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase ${camp.risk === 'safe' ? 'text-emerald-400' : 'text-amber-400'}`}>{camp.risk}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 bg-black/20"></div>
                    )}
                </div>
            ))}
        </GridLayout>
    );
}
