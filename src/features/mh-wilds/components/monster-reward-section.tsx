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
        <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Rewards & Materials</h4>
            {Object.entries(rewardsByRank).map(([rank, rewards]) => (
                <div key={rank} className="space-y-2">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold capitalize">{rank} Rank</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rewards.slice(0, 8).map((reward) => (
                            <div key={reward.id} className="flex items-center gap-2 bg-[#040711]/60 border border-white/5 rounded-xl px-3 py-2">
                                <span className="text-amber-400 font-mono text-xs">★{reward.item.rarity}</span>
                                <span className="text-xs text-slate-300 truncate">{reward.item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
