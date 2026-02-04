'use client';

import { motion } from "motion/react";
import { CTAButton } from '@/components/common/ui/other/CTABtn';
import { TYPOGRAPHY, LAYOUT } from '@/lib/constants';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    ctaLabel?: string;
    ctaUrl?: string;
    backgroundVideoUrl?: string;
}

export function HeroSection({
    title,
    subtitle,
    ctaLabel,
    ctaUrl,
    backgroundVideoUrl
}: HeroSectionProps) {
    return (
        <section className="relative min-h-screen py-10 flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {backgroundVideoUrl ? (
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={backgroundVideoUrl}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-100" />
                )}
                <div />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4 max-w-4xl mx-auto">
                <motion.h1
                    className={TYPOGRAPHY.heroTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {title}
                </motion.h1>

                <motion.p
                    className={TYPOGRAPHY.bodyMain}
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
                            className="text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
