'use client';

import dynamic from 'next/dynamic';
const ParticlesBackground = dynamic(() => import('@/components/ui/particles-background').then(mod => mod.ParticlesBackground), { ssr: false });

import { motion } from "motion/react";
import { CTAButton } from '@/components/ui/cta-btn';
import { TYPOGRAPHY } from '@/lib/constants';
import { Layers, Newspaper, Flame, CheckCircle2, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaLabel?: string;
    ctaUrl?: string;
}

export function HeroSection({
    title,
    subtitle,
    ctaLabel,
    ctaUrl,
}: HeroSectionProps) {
    return (
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">
            {/* Ambient Background & Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px]" />
                <div className="absolute bottom-10 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />
                <ParticlesBackground className="absolute inset-0 z-0 opacity-30" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-4 max-w-5xl mx-auto">
                {/* Modern Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs sm:text-sm font-medium text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] glare-top cursor-default"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="font-semibold tracking-wide">Developer Command Center & Gaming Vault</span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                    className={TYPOGRAPHY.heroTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                >
                    {title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className={`${TYPOGRAPHY.bodyMain} max-w-2xl text-slate-400 font-normal leading-relaxed`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                >
                    {subtitle}
                </motion.p>

                {/* Action CTA */}
                {ctaLabel && ctaUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-4 pt-2"
                    >
                        <CTAButton
                            href={ctaUrl}
                            label={ctaLabel}
                            variant="premium"
                            className="text-base px-9 py-5 rounded-full font-bold shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all flex items-center gap-2"
                        />
                    </motion.div>
                )}

                {/* Futuristic Interactive Command Deck Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="w-full max-w-4xl mt-12 pt-6"
                >
                    <div className="rounded-3xl border border-white/10 bg-[#060a14]/80 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.15)] glare-top">
                        {/* Mockup Header Bar */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                <span className="text-slate-500 font-mono text-[11px] ml-2">hub.namdev.internal</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                                <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Core Online</span>
                                <span>v2.4.0-neo</span>
                            </div>
                        </div>

                        {/* Quick Hub Grid Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                            <Link href="/working" className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all group">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Working Hub</h4>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Kanban & Projects</p>
                            </Link>

                            <Link href="/planner/today" className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all group">
                                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Daily Planner</h4>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Tasks & Schedule</p>
                            </Link>

                            <Link href="/media/news" className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-rose-500/40 hover:bg-white/[0.06] transition-all group">
                                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Newspaper className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">Media & News</h4>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">RSS & Trends</p>
                            </Link>

                            <Link href="/mh-wilds" className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 hover:bg-white/[0.06] transition-all group">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Flame className="w-4 h-4" />
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">MH Wilds</h4>
                                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Database Vault</p>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
