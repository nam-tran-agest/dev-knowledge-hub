import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin } from 'lucide-react';
import { SPECIES_LABELS, getMonsterIconUrl } from '../constants';
import { DrawerLayout } from './detail-drawers';
import { MonsterWeaknessSection } from './monster-weakness-section';
import { MonsterPartsTable } from './monster-parts-table';
import { MonsterRewardSection } from './monster-reward-section';

interface MonsterDetailProps {
    monster: Monster;
    onClose: () => void;
}

export function MonsterDetail({ monster, onClose }: MonsterDetailProps) {
    return (
        <DrawerLayout
            title={monster.name}
            icon={
                <div className="w-9 h-9 rounded-xl shrink-0 bg-[#040711]/80 border border-white/10 flex items-center justify-center shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getMonsterIconUrl(monster.name)} alt={monster.name} className="w-7 h-7 object-contain drop-shadow" />
                </div>
            }
            subtitle={
                <div>
                    <p className="text-sm text-slate-400 font-medium">
                        {SPECIES_LABELS[monster.species] || monster.species}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            HP: {monster.baseHealth?.toLocaleString()}
                        </span>
                        {monster.locations?.length > 0 && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                {monster.locations.map(l => l.name).join(', ')}
                            </span>
                        )}
                    </div>
                </div>
            }
            onClose={onClose}
        >
            {/* Description */}
            <div>
                <p className="text-sm text-slate-300 leading-relaxed">{monster.description}</p>
            </div>

            {/* Tips */}
            {monster.tips && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                    <p className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest font-bold mb-2">Hunter Tips</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{monster.tips}</p>
                </div>
            )}

            <MonsterWeaknessSection monster={monster} />
            <MonsterPartsTable monster={monster} />
            <MonsterRewardSection monster={monster} />

            {/* Variants */}
            {monster.variants?.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Variants</h4>
                    <div className="flex gap-2 flex-wrap">
                        {monster.variants.map((v) => (
                            <Badge
                                key={v.id}
                                className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs capitalize font-mono"
                            >
                                {v.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </DrawerLayout>
    );
}
