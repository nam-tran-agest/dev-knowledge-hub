"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTABtnV2 } from "@/components/common/ui/other/CTABtn";
import { ShowcaseSectionProps } from "@/types/section/showcase";
import { getStrapiMedia } from "@/components/common/media/StrapiImage";
import Image from "next/image";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const ShowcaseSection = ({ title1, title2, items = [], cta }: ShowcaseSectionProps) => {

    return (
        <section className={LAYOUT.container + " py-10"}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24 space-y-2">
                    <h2 className={TYPOGRAPHY.sectionTitle}>
                        {title1}
                    </h2>
                    {title2 && (
                        <h2 className={TYPOGRAPHY.sectionTitle + " opacity-60"}>
                            {title2}
                        </h2>
                    )}
                </div>

                {/* Features Loop */}
                <div className="flex flex-col gap-12 lg:gap-24 relative">
                    {/* Decorative Background for the grid */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 -z-10 blur-3xl rounded-full opacity-50" />

                    {items.map((feature, idx) => {
                        const isEven = idx % 2 === 0;
                        const imageUrl = feature.image ? getStrapiMedia(feature.image.url) : null;

                        return (
                            <motion.div
                                key={feature.id || idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mx-auto"
                            >
                                {/* Image / Visual Column */}
                                <div className={`relative w-full ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                    <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black/20 backdrop-blur-sm relative group">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={feature.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-white/5 to-white/10">
                                                <span className="text-4xl font-bold opacity-20">{idx + 1}</span>
                                                <span className="text-sm font-medium mt-2">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className={`flex flex-col gap-6 ${isEven ? "lg:order-2 items-start text-left" : "lg:order-1 items-end text-right"}`}>
                                    <Card
                                        className="w-full lg:max-w-xl bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors duration-300"
                                    >
                                        <CardHeader>
                                            <CardTitle className={TYPOGRAPHY.cardTitle}>
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={TYPOGRAPHY.bodySub}>
                                            {feature.sub_title}
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                {cta && (
                    <div className="flex justify-center pt-20">
                        <CTABtnV2
                            id={cta.id}
                            href={cta.url || cta.Url}
                            label={cta.label}
                        />
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default ShowcaseSection;
