"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTAButton } from "@/components/common/ui/other/CTABtn";
import { ShowcaseSectionProps } from "@/types/section/showcase";
import { getStrapiMedia } from "@/components/common/media/StrapiImage";
import Image from "next/image";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const ShowcaseSection = ({ title1, title2, items = [], cta }: ShowcaseSectionProps) => {

    const FALLBACK_SHOWCASE_IMAGES = [
        "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=800&q=80", // Web UI
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80", // Mobile App
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Analytics
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80", // Code
    ];

    return (
        <section className={LAYOUT.container + " py-10"}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Section Header */}
                <div className="text-center mb-12">
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
                <div className="flex flex-col gap-12 bg-gradient-to-b from-blue-50/30 to-blue-100/30 rounded-[40px] p-8 md:p-12">
                    {items.map((feature, idx) => {
                        const isEven = idx % 2 === 0;
                        const imageUrl = (feature.image ? getStrapiMedia(feature.image.url) : null) || FALLBACK_SHOWCASE_IMAGES[idx % FALLBACK_SHOWCASE_IMAGES.length];

                        return (
                            <motion.div
                                key={feature.id || idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-center lg:w-[95%] xl:w-[85%] mx-auto"
                            >
                                {/* Image / Visual Column */}
                                <div className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                    <div className="w-full rounded-3xl overflow-hidden shadow-sm bg-white/40 backdrop-blur-sm">
                                        <Image
                                            src={imageUrl}
                                            alt={feature.title}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className={`${isEven ? "lg:order-2" : "lg:order-1 flex justify-end"}`}>
                                    <Card
                                        style={{
                                            backgroundImage: "linear-gradient(#fff, #fff), linear-gradient(180deg, #80D2E7 0%, #1690FD 100%)",
                                            backgroundOrigin: "border-box",
                                            backgroundClip: "padding-box, border-box",
                                            border: "2px solid transparent",
                                        }}
                                        className="w-full !gap-2 lg:w-[450px] lg:min-h-[167px] h-auto rounded-[30px] flex flex-col justify-center py-8 px-6 transition-all duration-300 shadow-none hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <CardHeader className="p-0 mb-2">
                                            <CardTitle className={TYPOGRAPHY.cardTitle + " text-[#111827] font-semibold"}>
                                                {feature.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className={TYPOGRAPHY.bodySub + " p-0 text-slate-600 font-medium"}>
                                            {feature.sub_title}
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Bottom CTA */}
                    {cta && (
                        <div className="flex justify-center pt-20">
                            <CTAButton
                                id={cta.id}
                                href={cta.url || cta.Url}
                                label={cta.label}
                                variant="premium"
                                className="!px-8 !py-6 text-lg border-0"
                            />
                        </div>
                    )}
                </div>

            </motion.div>
        </section>
    );
};

export default ShowcaseSection;
