'use client';

import { ParticlesBackground } from '@/components/ui/particles-background';

import { motion } from "motion/react";
import { CTAButton } from '@/components/ui/cta-btn';
import { TYPOGRAPHY } from '@/lib/constants';

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
        <section className="relative min-h-screen py-10 flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/90 via-slate-950 to-blue-950">
                <ParticlesBackground className="absolute inset-0 z-0" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4 max-w-4xl mx-auto">
                <motion.h1
                    className={`${TYPOGRAPHY.heroTitle}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    className={`${TYPOGRAPHY.bodyMain} !text-white/50`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    {subtitle}
                </motion.p>

                {ctaLabel && ctaUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <CTAButton
                            href={ctaUrl}
                            label={ctaLabel}
                            variant="premium"
                            className="text-lg px-8 py-6"
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
