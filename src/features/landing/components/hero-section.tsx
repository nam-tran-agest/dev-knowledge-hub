'use client';

import dynamic from 'next/dynamic';
const ParticlesBackground = dynamic(() => import('@/components/ui/particles-background').then(mod => mod.ParticlesBackground), { ssr: false });

import { motion } from "motion/react";
import { Layers, Newspaper, Flame, Calendar, Terminal, Cpu } from 'lucide-react';
import { Link } from '@/i18n/routing';

import { RadarHUD } from '@/components/ui/cyber/radar-hud';

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
                                <span>KERNEL: V2.4.0-NEO</span>
                            </div>
                            <div className="glass-panel px-3.5 py-1.5 cyber-clip-button flex items-center gap-2 border border-destructive/30 text-destructive">
                                <Terminal className="w-3.5 h-3.5 text-destructive" />
                                <span>ACCESS: ROOT_PRIVILEGE</span>
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
                        <div className="cyber-clip glass-panel h-full p-8 border border-primary/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_var(--color-primary)] hover:border-primary/50">
                            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[10px] uppercase tracking-widest text-primary/70 font-mono">
                                // SYS_PLANNER
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 cyber-clip-button bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform border border-primary/30">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono">Daily Planner</h2>
                                <p className="text-primary/60 font-mono">Manage your tasks, track your schedule, and optimize your productivity.</p>
                            </div>
                            <div className="relative z-10 mt-8 flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                <span>Launch Module</span>
                                <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Secondary Widget: Working Hub */}
                    <Link href="/working" className="group">
                        <div className="cyber-clip glass-panel h-full p-8 border border-secondary/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_var(--color-secondary)] hover:border-secondary/50">
                            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-4 px-2 bg-background border-x border-secondary/30 text-[10px] uppercase tracking-widest text-secondary/70 font-mono">
                                // SYS_WORKING
                            </div>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 blur-[60px] rounded-full group-hover:bg-secondary/20 transition-colors pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 cyber-clip-button bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform border border-secondary/30">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono">Working Hub</h2>
                                <p className="text-secondary/60 font-mono">Active projects and kanban boards.</p>
                            </div>
                            <div className="relative z-10 mt-8 flex items-center gap-2 text-secondary font-mono text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                <span>Access</span>
                                <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Media & News */}
                    <Link href="/media/youtube" className="group">
                        <div className="cyber-clip glass-panel h-full p-8 border border-[#ff007f]/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] hover:border-[#ff007f]/50">
                            <div className="absolute inset-0 cyber-brackets-red pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-4 px-2 bg-background border-x border-[#ff007f]/30 text-[10px] uppercase tracking-widest text-[#ff007f]/70 font-mono">
                                // SYS_MEDIA
                            </div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#ff007f]/10 blur-[60px] rounded-full group-hover:bg-[#ff007f]/20 transition-colors pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 cyber-clip-button bg-[#ff007f]/10 flex items-center justify-center text-[#ff007f] mb-6 group-hover:scale-110 transition-transform border border-[#ff007f]/30">
                                    <Newspaper className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono">Media Center</h2>
                                <p className="text-[#ff007f]/60 font-mono">YouTube bookmarks, Spotify integrations, and RSS News.</p>
                            </div>
                            <div className="relative z-10 mt-8 flex items-center gap-2 text-[#ff007f] font-mono text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                <span>Browse</span>
                                <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* MH Wilds Vault */}
                    <Link href="/mh-wilds" className="lg:col-span-2 group">
                        <div className="cyber-clip glass-panel h-full p-8 border border-destructive/20 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_var(--color-destructive)] hover:border-destructive/50">
                            <div className="absolute inset-0 cyber-brackets-red pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-4 px-2 bg-background border-x border-destructive/30 text-[10px] uppercase tracking-widest text-destructive/70 font-mono">
                                // SYS_MH_WILDS
                            </div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-destructive/10 blur-[80px] rounded-full group-hover:bg-destructive/20 transition-colors pointer-events-none" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 cyber-clip-button bg-destructive/10 flex items-center justify-center text-destructive mb-6 group-hover:scale-110 transition-transform border border-destructive/30">
                                    <Flame className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest font-mono">MH Wilds Vault</h2>
                                <p className="text-destructive/60 font-mono">Comprehensive database for weapons, armors, and monster weaknesses.</p>
                            </div>
                            <div className="relative z-10 mt-8 flex items-center gap-2 text-destructive font-mono text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                                <span>Open Vault</span>
                                <span className="text-lg">→</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
