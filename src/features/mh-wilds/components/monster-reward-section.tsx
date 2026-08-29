import type { Monster } from '../types';

export function MonsterRewardSection({ monster }: { monster: Monster }) {
    if (monster.rewards.length === 0) return null;

    const rewardsByRank: Record<string, typeof monster.rewards> = {};
    monster.rewards.forEach((reward) => {
        reward.conditions.forEach((cond) => {
            const rank = cond.rank || 'unknown';
            if (!rewardsByRank[rank]) rewardsByRank[rank] = [];
            if (!rewardsByRank[rank].find(r => r.id === reward.id)) {
                rewardsByRank[rank].push(reward);
            }
        });
    });

    return (
        <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">// REWARDS & FIELD_DROPS</h4>
            {Object.entries(rewardsByRank).map(([rank, rewards]) => (
                <div key={rank} className="space-y-1.5">
                    <p className="text-[10px] text-primary/70 font-mono uppercase tracking-widest font-bold">// {rank} RANK</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {rewards.slice(0, 8).map((reward) => (
                            <div key={reward.id} className="flex items-center gap-2 bg-[#040711]/80 border border-primary/20 cyber-clip-button px-2.5 py-1.5">
                                <span className="text-primary font-mono text-xs">★{reward.item.rarity}</span>
                                <span className="text-xs text-slate-200 truncate uppercase">{reward.item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
