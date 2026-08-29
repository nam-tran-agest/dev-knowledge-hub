"use client";
import { motion } from "motion/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/cta-btn";
import { ShowcaseSectionProps } from "@/features/landing/types/section/showcase";
import { getMediaUrl } from "@/components/common/media/AppImage";
import Image from "next/image";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

import show1 from "@/assets/images/home/show1.webp";
import show2 from "@/assets/images/home/show2.webp";
import show3 from "@/assets/images/home/show3.webp";

const ShowcaseSection = ({ title1, title2, items = [], cta }: ShowcaseSectionProps) => {

    const FALLBACK_SHOWCASE_IMAGES = [
        show1,
        show2,
        show3,
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

            <div className={LAYOUT.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-16 space-y-4">
                        <h2 className={TYPOGRAPHY.sectionTitle}>
                            {title1}
                        </h2>
                        {title2 && (
                            <p className="text-slate-400 text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
                                {title2}
                            </p>
                        )}
                    </div>

                    {/* Features Loop */}
                    <div className="flex flex-col gap-16 md:gap-20">
                        {items.map((feature, idx) => {
                            const isEven = idx % 2 === 0;
                            const imageUrl = (feature.image ? getMediaUrl(feature.image.url) : null) || FALLBACK_SHOWCASE_IMAGES[idx % FALLBACK_SHOWCASE_IMAGES.length];

                            return (
                                <motion.div
                                    key={feature.id || idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                                >
                                    {/* Image Column */}
                                    <div className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative group bg-[#070b16] glare-top">
                                            <Image
                                                src={imageUrl}
                                                alt={feature.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                                        <Card
                                            className={cn(
                                                "w-full rounded-3xl p-8 sm:p-10 transition-all duration-300 border border-white/10 bg-[#070d1e]/50 backdrop-blur-2xl hover:border-indigo-500/40 hover:bg-[#0c142c]/60 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] glare-top group"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold">
                                                    0{idx + 1}
                                                </span>
                                            </div>
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                                                    {feature.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0 text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
                                                {feature.sub_title}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Bottom CTA */}
                        {cta && (
                            <div className="flex justify-center pt-6">
                                <CTAButton
                                    id={cta.id}
                                    href={cta.url}
                                    label={cta.label}
                                    variant="premium"
                                    className="!px-9 !py-5 text-base rounded-full font-bold shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] transition-all cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
