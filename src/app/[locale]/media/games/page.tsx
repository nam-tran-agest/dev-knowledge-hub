import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import {
    Gamepad2,
    Trophy,
    Clock,
    Star,
    Search,
    Users,
    Play,
    Info,
    MoreHorizontal,
    Library,
    Cloud,
    Store,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

// Mock Data
const FRIENDS = [
    { name: 'MasterGreatAxe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', lastPlayed: 'A few minutes ago', points: '280/5210', trophies: 30, time: '36.2h' },
    { name: 'LastRoar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear', lastPlayed: '19m ago', points: '1635/5210', trophies: 108, time: '186.8h' },
    { name: 'ShieldShark', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shark', lastPlayed: '27m ago', points: '1205/5210', trophies: 81, time: '236.2h' },
    { name: 'ThunderGrizzly', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grizzly', lastPlayed: '2d ago', points: '2310/5210', trophies: 153, time: '1202.2h' },
];

const RECENT_GAMES = [
    { title: 'Sea of Thieves 2024', lastPlayed: '14h ago', icon: <Gamepad2 className="w-4 h-4 text-emerald-400" /> },
    { title: 'Microsoft Flight Simulator', lastPlayed: '2d ago', icon: <Cloud className="w-4 h-4 text-blue-400" /> },
    { title: 'Forza Horizon 5', lastPlayed: '3d ago', icon: <Trophy className="w-4 h-4 text-pink-400" /> },
    { title: 'Psychonauts 2', lastPlayed: '1w ago', icon: <LayoutGrid className="w-4 h-4 text-purple-400" /> },
    { title: 'Halo Infinite', lastPlayed: '2w ago', icon: <Star className="w-4 h-4 text-blue-500" /> },
];

const ACHIEVEMENTS = [
    { title: 'Bone-Cronch', score: 10, description: 'A skeleton cronches through thick yellow peel. Attack it and kill it.', unlocked: '4/6/2018' },
    { title: 'A Titanic Ensemble', score: 10, description: 'You gave your ship a Captain’s send-off by playing a song aboard it while it sank.', unlocked: '5/12/2018' },
];

export default async function GamesPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.games' });

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200">
            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">

                {/* Local Sidebar */}
                <aside className="w-full lg:w-64 bg-[#111114] border-r border-white/5 flex flex-col overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-8">
                            <div className="space-y-2">
                                <SidebarItem icon={<ArrowUpRight className="w-5 h-5" />} label="Game Pass" active />
                                <SidebarItem icon={<Library className="w-5 h-5" />} label="My Library" />
                                <SidebarItem icon={<Cloud className="w-5 h-5" />} label="Cloud Gaming" />
                                <SidebarItem icon={<Store className="w-5 h-5" />} label="Store" />
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Most recent</span>
                                    <MoreHorizontal className="w-4 h-4 text-slate-500 cursor-pointer" />
                                </div>
                                <div className="space-y-2">
                                    {RECENT_GAMES.map((game, i) => (
                                        <RecentGameItem key={i} {...game} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#0a0a0c] custom-scrollbar">
                    {/* Top Header / Search */}
                    <div className="sticky top-0 z-20 bg-[#0a0a0c]/80 backdrop-blur-md px-8 py-4 flex items-center gap-4">
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="p-2 rounded-full hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="relative flex-1 max-w-xl text-slate-200">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                            <Input
                                type="text"
                                placeholder="Find games, add-ons and more"
                                className="w-full bg-[#1e1e24] border-none rounded-md py-2 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500 outline-none text-slate-200 placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="px-8 space-y-10 pb-12">
                        {/* Featured Banner */}
                        <section className="relative h-[450px] rounded-2xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-[#0a0a0c]/20 to-transparent z-10" />
                            <Image
                                src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
                                alt="Sea of Thieves Banner"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />

                            <div className="absolute bottom-10 left-10 z-20 space-y-6 max-w-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-slate-900/40 backdrop-blur rounded-xl border border-white/5">
                                        <Gamepad2 className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-extrabold tracking-tight">Sea of Thieves 2024 Edition</h1>
                                        <div className="flex items-center gap-6 mt-2 text-sm text-slate-400">
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last played: 14h ago</span>
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Time played: 34h</span>
                                            <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> 1720/5210</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="px-8 py-3 bg-[#107c10] hover:bg-[#159415] text-white font-bold rounded flex items-center gap-2 transition-colors">
                                        <Play className="w-5 h-5 fill-current" /> PLAY
                                    </button>
                                    <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded flex items-center gap-2 transition-colors border border-white/5">
                                        VIEW DETAILS
                                    </button>
                                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors border border-white/5">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Friends Who Play */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Friends who play</h2>
                                <div className="flex gap-2">
                                    <button className="p-1 rounded bg-white/5 hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></button>
                                    <button className="p-1 rounded bg-white/5 hover:bg-white/10"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {FRIENDS.map((friend, i) => (
                                    <FriendCard key={i} friend={friend} />
                                ))}
                            </div>
                        </section>

                        {/* Achievements Row */}
                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6 text-slate-400">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white">Achievements</h2>
                                    <button className="text-xs font-bold hover:text-white flex items-center gap-1 uppercase">Show All <ChevronRight className="w-4 h-4" /></button>
                                </div>

                                <Card className="bg-[#111114] border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle className="text-[#1e1e24] stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                                            <circle className="text-emerald-500 stroke-current" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.33)} strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-extrabold text-white">33%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-emerald-400" /> 1720/5210</span>
                                            <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-blue-400" /> 84/253</span>
                                        </div>
                                    </div>
                                    <div className="w-full pt-4 border-t border-white/5 text-left">
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Gold Hoarder Chests Cashed In</div>
                                        <div className="text-2xl font-bold text-white mb-4">12</div>
                                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Distance Saited (metres)</div>
                                        <div className="text-2xl font-bold text-white mb-4">431,562</div>
                                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-sm font-bold transition-colors">See all 6 stats</button>
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:col-span-2 space-y-6 pt-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ACHIEVEMENTS.map((ach, i) => (
                                        <AchievementCard key={i} achievement={ach} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-colors ${active ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
            {icon}
            <span className="text-sm font-bold">{label}</span>
        </div>
    );
}

function RecentGameItem({ title, lastPlayed, icon }: { title: string, lastPlayed: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 cursor-pointer group transition-colors">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-sm font-bold truncate text-slate-300 group-hover:text-white transition-colors">{title}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">{lastPlayed}</div>
            </div>
        </div>
    );
}

function FriendCard({ friend }: { friend: any }) {
    return (
        <Card className="bg-[#1e1e24] border-white/5 hover:bg-[#25252d] transition-colors cursor-pointer p-4 group">
            <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                    <Avatar className="w-12 h-12 rounded-lg">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-slate-800 text-slate-500">{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#1e1e24] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{friend.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Last played: {friend.lastPlayed}</p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> {friend.points.split('/')[0]}</span>
                        <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {friend.trophies}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {friend.time}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function AchievementCard({ achievement }: { achievement: any }) {
    return (
        <Card className="bg-[#111114] border-white/5 overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="h-28 bg-slate-800 relative">
                <Image
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                    alt={achievement.title}
                    fill
                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111114] to-transparent" />
            </div>
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{achievement.title}</h4>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Gamepad2 className="w-3 h-3" /> {achievement.score}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{achievement.description}</p>
                <div className="pt-2 space-y-2">
                    <Progress value={100} className="h-1 bg-emerald-500/20" />
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Unlocked {achievement.unlocked}</div>
                </div>
            </CardContent>
        </Card>
    );
}
