"use client";
import { motion } from "motion/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/cta-btn";
import { ShowcaseSectionProps } from "@/features/landing/types/section/showcase";
import { getMediaUrl } from "@/components/common/media/AppImage";
import Image from "next/image";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

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
        <section className="py-10 bg-gradient-to-br from-[#122550] via-[#2a5ca8] to-[#0a1430]">
            <div className={LAYOUT.container}>
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
                    <div className="flex flex-col gap-12 p-8 md:p-12">
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
                                    className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-14 items-center lg:w-[95%] xl:w-[85%] mx-auto"
                                >
                                    {/* Image / Visual Column */}
                                    <div className={`relative ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                        <div className="w-full rounded-3xl overflow-hidden shadow-sm">
                                            <Image
                                                src={imageUrl}
                                                alt={feature.title}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                className="w-full h-auto object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className={`${isEven ? "lg:order-2" : "lg:order-1 flex justify-end"}`}>
                                        <Card
                                            style={{
                                                backgroundImage: "linear-gradient(#fff, #e1e0f6ff), linear-gradient(180deg, #80D2E7 0%, #1690FD 100%)",
                                                backgroundOrigin: "border-box",
                                                backgroundClip: "padding-box, border-box",
                                                border: "2px solid transparent",
                                            }}
                                            className="w-full !gap-2 lg:w-[450px] lg:min-h-[167px] h-auto rounded-[30px] flex flex-col justify-center py-8 px-6 transition-all duration-300 shadow-none hover:shadow-xl hover:-translate-y-1"
                                        >
                                            <CardHeader className="p-0 mb-2">
                                                <CardTitle className={TYPOGRAPHY.cardTitle + " text-gradient font-semibold"}>
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
                                    href={cta.url}
                                    label={cta.label}
                                    variant="premium"
                                    className="!px-8 !py-6 text-lg border-0"
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
