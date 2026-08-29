'use client';

import dynamic from 'next/dynamic';
const ParticlesBackground = dynamic(() => import('@/components/ui/particles-background').then(mod => mod.ParticlesBackground), { ssr: false });

import { motion } from "motion/react";
import { CTAButton } from '@/components/ui/cta-btn';
import { TYPOGRAPHY } from '@/lib/constants';
import { Sparkles, ArrowRight } from 'lucide-react';

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
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
            {/* Ambient Background & Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#07090e]/80 to-[#07090e]" />
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                <ParticlesBackground className="absolute inset-0 z-0 opacity-40" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-4 max-w-5xl mx-auto">
                {/* Modern Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>Next-Generation Knowledge & Workspace Hub</span>
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
                    className={`${TYPOGRAPHY.bodyMain} max-w-2xl text-slate-400`}
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
                            className="text-base px-8 py-5 rounded-full font-semibold shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2"
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
