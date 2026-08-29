'use client';

import dynamic from 'next/dynamic';
const ParticlesBackground = dynamic(() => import('@/components/ui/particles-background').then(mod => mod.ParticlesBackground), { ssr: false });

import { motion } from "motion/react";
import { Layers, Newspaper, Flame, Calendar, Terminal, Cpu } from 'lucide-react';
import { Link } from '@/i18n/routing';

import { RadarHUD } from '@/components/ui/cyber/radar-hud';
import { TacticalActionButton } from '@/components/ui/cyber/tactical-action-button';
import { MODULE_THEMES } from '@/lib/constants/styles';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaLabel?: string;
    ctaUrl?: string;
}

export function HeroSection({
    title,
    subtitle,
}: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            {/* Ambient Cyberpunk Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-secondary/5 to-transparent blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full" />
                <ParticlesBackground className="absolute inset-0 z-0 opacity-40" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-10">
                {/* Dashboard Header with Radar HUD */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-primary/20 pb-8 relative">
                    {/* Top Right Corner Notches */}
                    <div className="absolute top-0 right-0 w-8 h-2 border-t-2 border-r-2 border-primary pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-2 max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 cyber-clip-button bg-primary/10 border border-primary/30 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">SYS_ONLINE // PROTOCOL_NEO</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-mono font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white/70">
                            {title}
                        </h1>
                        <p className="text-primary/70 font-mono text-xs sm:text-sm max-w-xl uppercase tracking-wide">
                            // {subtitle}
                        </p>
                    </motion.div>

                    {/* Quick System Stats + Radar HUD */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-6"
                    >
                        <div className="hidden sm:block">
                            <RadarHUD className="w-24 h-24" />
                        </div>
                        <div className="flex flex-col gap-2 text-xs font-mono text-primary/80">
                            <div className="glass-panel px-3.5 py-1.5 cyber-clip-button flex items-center gap-2 border border-primary/30">
                                <Cpu className="w-3.5 h-3.5 text-primary" />
                                <span>KERNEL: V2.5.0-NEO</span>
                            </div>
                            <div className="glass-panel px-3.5 py-1.5 cyber-clip-button flex items-center gap-2 border border-emerald-500/30 text-emerald-400">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                <span>STATUS: ENCRYPTED // ACTIVE</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bento Grid Command Center */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* Primary Widget: Planner */}
                    <Link href="/planner/today" className="lg:col-span-2 group">
                        <div className={`cyber-clip glass-panel h-full p-7 sm:p-8 border ${MODULE_THEMES.planner.cardBorder} flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${MODULE_THEMES.planner.cardHoverShadow} ${MODULE_THEMES.planner.cardHoverBorder}`}>
                            <div className={`absolute inset-0 ${MODULE_THEMES.planner.bracketsClass} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
                            <div className={`absolute top-4 right-6 px-3 py-1 ${MODULE_THEMES.planner.tagBg} border ${MODULE_THEMES.planner.tagBorder} cyber-clip-tag text-[10px] uppercase tracking-widest ${MODULE_THEMES.planner.tagText} font-mono font-bold`}>
                                // SYS_PLANNER
                            </div>
                            <div className={`absolute top-0 right-0 w-64 h-64 ${MODULE_THEMES.planner.blurBlob} blur-[80px] rounded-full transition-colors pointer-events-none`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 cyber-clip-button ${MODULE_THEMES.planner.iconBg} flex items-center justify-center ${MODULE_THEMES.planner.iconColor} mb-6 group-hover:scale-110 transition-transform border ${MODULE_THEMES.planner.iconBorder} ${MODULE_THEMES.planner.iconShadow}`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h2 className={`text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono group-hover:${MODULE_THEMES.planner.iconColor} transition-colors`}>{MODULE_THEMES.planner.name}</h2>
                                <p className="text-slate-300 font-mono text-sm leading-relaxed max-w-xl">Manage your tasks, track your schedule, and optimize your productivity.</p>
                            </div>

                            <TacticalActionButton
                                label={MODULE_THEMES.planner.actionLabel}
                                moduleCode={MODULE_THEMES.planner.code}
                                color={MODULE_THEMES.planner.color}
                                size="lg"
                            />
                        </div>
                    </Link>

                    {/* Secondary Widget: Working Hub */}
                    <Link href="/working" className="group">
                        <div className={`cyber-clip glass-panel h-full p-7 sm:p-8 border ${MODULE_THEMES.working.cardBorder} flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${MODULE_THEMES.working.cardHoverShadow} ${MODULE_THEMES.working.cardHoverBorder}`}>
                            <div className={`absolute inset-0 ${MODULE_THEMES.working.bracketsClass} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
                            <div className={`absolute top-4 right-6 px-3 py-1 ${MODULE_THEMES.working.tagBg} border ${MODULE_THEMES.working.tagBorder} cyber-clip-tag text-[10px] uppercase tracking-widest ${MODULE_THEMES.working.tagText} font-mono font-bold`}>
                                // SYS_WORKING
                            </div>
                            <div className={`absolute top-0 right-0 w-48 h-48 ${MODULE_THEMES.working.blurBlob} blur-[60px] rounded-full transition-colors pointer-events-none`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 cyber-clip-button ${MODULE_THEMES.working.iconBg} flex items-center justify-center ${MODULE_THEMES.working.iconColor} mb-6 group-hover:scale-110 transition-transform border ${MODULE_THEMES.working.iconBorder} ${MODULE_THEMES.working.iconShadow}`}>
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h2 className={`text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono group-hover:${MODULE_THEMES.working.iconColor} transition-colors`}>{MODULE_THEMES.working.name}</h2>
                                <p className="text-slate-300 font-mono text-sm leading-relaxed">Active projects and kanban boards.</p>
                            </div>

                            <TacticalActionButton
                                label={MODULE_THEMES.working.actionLabel}
                                moduleCode={MODULE_THEMES.working.code}
                                color={MODULE_THEMES.working.color}
                                size="md"
                            />
                        </div>
                    </Link>

                    {/* Media & News */}
                    <Link href="/media/youtube" className="group">
                        <div className={`cyber-clip glass-panel h-full p-7 sm:p-8 border ${MODULE_THEMES.media.cardBorder} flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${MODULE_THEMES.media.cardHoverShadow} ${MODULE_THEMES.media.cardHoverBorder}`}>
                            <div className={`absolute inset-0 ${MODULE_THEMES.media.bracketsClass} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
                            <div className={`absolute top-4 right-6 px-3 py-1 ${MODULE_THEMES.media.tagBg} border ${MODULE_THEMES.media.tagBorder} cyber-clip-tag text-[10px] uppercase tracking-widest ${MODULE_THEMES.media.tagText} font-mono font-bold`}>
                                // SYS_MEDIA
                            </div>
                            <div className={`absolute bottom-0 right-0 w-48 h-48 ${MODULE_THEMES.media.blurBlob} blur-[60px] rounded-full transition-colors pointer-events-none`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 cyber-clip-button ${MODULE_THEMES.media.iconBg} flex items-center justify-center ${MODULE_THEMES.media.iconColor} mb-6 group-hover:scale-110 transition-transform border ${MODULE_THEMES.media.iconBorder} ${MODULE_THEMES.media.iconShadow}`}>
                                    <Newspaper className="w-6 h-6" />
                                </div>
                                <h2 className={`text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono group-hover:${MODULE_THEMES.media.iconColor} transition-colors`}>{MODULE_THEMES.media.name}</h2>
                                <p className="text-slate-300 font-mono text-sm leading-relaxed">YouTube bookmarks, Spotify integrations, and RSS News.</p>
                            </div>

                            <TacticalActionButton
                                label={MODULE_THEMES.media.actionLabel}
                                moduleCode={MODULE_THEMES.media.code}
                                color={MODULE_THEMES.media.color}
                                size="md"
                            />
                        </div>
                    </Link>

                    {/* MH Wilds Vault */}
                    <Link href="/mh-wilds" className="lg:col-span-2 group">
                        <div className={`cyber-clip glass-panel h-full p-7 sm:p-8 border ${MODULE_THEMES.mhWilds.cardBorder} flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${MODULE_THEMES.mhWilds.cardHoverShadow} ${MODULE_THEMES.mhWilds.cardHoverBorder}`}>
                            <div className={`absolute inset-0 ${MODULE_THEMES.mhWilds.bracketsClass} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
                            <div className={`absolute top-4 right-6 px-3 py-1 ${MODULE_THEMES.mhWilds.tagBg} border ${MODULE_THEMES.mhWilds.tagBorder} cyber-clip-tag text-[10px] uppercase tracking-widest ${MODULE_THEMES.mhWilds.tagText} font-mono font-bold`}>
                                // SYS_MH_WILDS
                            </div>
                            <div className={`absolute bottom-0 right-0 w-64 h-64 ${MODULE_THEMES.mhWilds.blurBlob} blur-[80px] rounded-full transition-colors pointer-events-none`} />
                            <div className="relative z-10">
                                <div className={`w-12 h-12 cyber-clip-button ${MODULE_THEMES.mhWilds.iconBg} flex items-center justify-center ${MODULE_THEMES.mhWilds.iconColor} mb-6 group-hover:scale-110 transition-transform border ${MODULE_THEMES.mhWilds.iconBorder} ${MODULE_THEMES.mhWilds.iconShadow}`}>
                                    <Flame className="w-6 h-6" />
                                </div>
                                <h2 className={`text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono group-hover:${MODULE_THEMES.mhWilds.iconColor} transition-colors`}>{MODULE_THEMES.mhWilds.name}</h2>
                                <p className="text-slate-300 font-mono text-sm leading-relaxed max-w-xl">Comprehensive database for weapons, armors, and monster weaknesses.</p>
                            </div>

                            <TacticalActionButton
                                label={MODULE_THEMES.mhWilds.actionLabel}
                                moduleCode={MODULE_THEMES.mhWilds.code}
                                color={MODULE_THEMES.mhWilds.color}
                                size="lg"
                            />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
