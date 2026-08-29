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
        <section className="relative py-20 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className={LAYOUT.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-16 space-y-3">
                        <h2 className={TYPOGRAPHY.sectionTitle}>
                            {title1}
                        </h2>
                        {title2 && (
                            <p className="text-slate-400 text-lg md:text-xl font-normal max-w-2xl mx-auto">
                                {title2}
                            </p>
                        )}
                    </div>

                    {/* Features Loop */}
                    <div className="flex flex-col gap-16 md:gap-24">
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
                                    className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
                                >
                                    {/* Image / Visual Column */}
                                    <div className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative group bg-white/[0.02]">
                                            <Image
                                                src={imageUrl}
                                                alt={feature.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                                        <Card
                                            className={cn(
                                                "w-full rounded-3xl p-8 sm:p-10 transition-all duration-300 border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-indigo-500/30 hover:bg-white/[0.05] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                            )}
                                        >
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                                    {feature.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                                                {feature.sub_title}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Bottom CTA */}
                        {cta && (
                            <div className="flex justify-center pt-8">
                                <CTAButton
                                    id={cta.id}
                                    href={cta.url}
                                    label={cta.label}
                                    variant="premium"
                                    className="!px-8 !py-5 text-base rounded-full font-semibold shadow-[0_0_25px_rgba(99,102,241,0.3)]"
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
