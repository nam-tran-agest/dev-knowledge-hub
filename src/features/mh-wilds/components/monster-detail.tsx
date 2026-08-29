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
                <div className="w-8 h-8 cyber-clip-button shrink-0 bg-[#040711] border border-primary/30 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getMonsterIconUrl(monster.name)} alt={monster.name} className="w-6 h-6 object-contain" />
                </div>
            }
            subtitle={
                <div>
                    <p className="text-xs text-primary/70 font-mono uppercase">
                        // {SPECIES_LABELS[monster.species] || monster.species}
                    </p>
                    <div className="flex gap-4 mt-1 text-xs font-mono text-primary/60">
                        <span className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-destructive" />
                            HP: {monster.baseHealth?.toLocaleString()}
                        </span>
                        {monster.locations?.length > 0 && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
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
                <p className="text-xs text-primary/80 leading-relaxed font-mono">// {monster.description}</p>
            </div>

            {/* Tips */}
            {monster.tips && (
                <div className="bg-primary/5 border border-primary/30 cyber-clip p-3.5">
                    <p className="text-[10px] text-primary uppercase font-mono tracking-widest font-bold mb-1.5">// TACTICAL_INTEL</p>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono">{monster.tips}</p>
                </div>
            )}

            <MonsterWeaknessSection monster={monster} />
            <MonsterPartsTable monster={monster} />
            <MonsterRewardSection monster={monster} />

            {/* Variants */}
            {monster.variants?.length > 0 && (
                <div className="space-y-2.5 font-mono">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">// MONSTER_VARIANTS</h4>
                    <div className="flex gap-2 flex-wrap">
                        {monster.variants.map((v) => (
                            <Badge
                                key={v.id}
                                className="bg-primary/10 text-primary border border-primary/30 text-[10px] uppercase font-mono cyber-clip-tag"
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
