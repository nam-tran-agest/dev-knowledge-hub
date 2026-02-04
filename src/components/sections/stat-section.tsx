"use client";

import { motion } from "motion/react";
import AnimatedCounter from "@/components/common/ui/other/AnimatedCounter";
import { CTABtnV2 as CTABtn } from "@/components/common/ui/other/CTABtn";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { WhyChooseUsSection as WhyChooseUsSectionProps } from "@/types/section/why-choose-us";
import { getStrapiMedia } from "@/components/common/media/StrapiImage";
import Image from "next/image";
import { TYPOGRAPHY, LAYOUT, EFFECTS } from "@/lib/constants";

const StatSection = ({ title, stats, features, cta }: WhyChooseUsSectionProps) => {


    return (
        <section className="relative overflow-hidden my-1 py-10 bg-gradient-landing-blue">
            <div className={LAYOUT.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Title */}
                    <h2 className={TYPOGRAPHY.sectionTitle + " text-center mb-16 w-full max-w-4xl mx-auto flex items-center justify-center"}>
                        {title}
                    </h2>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 md:gap-12 mb-20 md:mb-24">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div
                                    className="text-5xl md:text-6xl xl:text-7xl font-bold text-[#0069AC] mb-2 text-center text-stroke-white"
                                >
                                    <AnimatedCounter from={0} to={stat.value} />
                                    {stat.suffix}
                                </div>
                                <p className={TYPOGRAPHY.bodyMain + " text-center leading-tight"}>{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Grid (Cards) */}
                    <div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-8 mb-16 justify-items-center">
                        {features.map((feature, idx) => {
                            const iconUrl = feature.image ? getStrapiMedia(feature.image.url) : null;

                            return (
                                <motion.div
                                    key={feature.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <Card
                                        className={`w-full md:w-[297px] h-[300px] xl:w-[320px] xl:h-[340px] p-6 flex flex-col items-start text-left ${EFFECTS.glass}`}
                                    >
                                        <div className="mb-2 w-full">
                                            <div className="pb-2">
                                                {iconUrl ? (
                                                    <Image
                                                        src={iconUrl}
                                                        alt={feature.title}
                                                        width={40}
                                                        height={40}
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold">
                                                        {idx + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <CardTitle className={TYPOGRAPHY.cardTitle}>
                                                {feature.title}
                                            </CardTitle>
                                        </div>
                                        <div className="w-full">
                                            <CardDescription className={TYPOGRAPHY.bodySub + " mt-2 block"}>
                                                {feature.sub_title}
                                            </CardDescription>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {cta && (
                        <div className="text-center">
                            <CTABtn
                                id={cta.id}
                                label={cta.label}
                                href={cta.url || cta.Url || '#'}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default StatSection;
