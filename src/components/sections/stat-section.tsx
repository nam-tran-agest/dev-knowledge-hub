"use client";

import { motion } from "motion/react";
import AnimatedCounter from "@/components/ui/animated-counter";
import { CTABtnV2 as CTABtn } from "@/components/ui/cta-btn";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { WhyChooseUsSection as WhyChooseUsSectionProps } from "@/types/section/why-choose-us";
import { TYPOGRAPHY, LAYOUT, EFFECTS } from "@/lib/constants";

const StatSection = ({ title, stats, features, cta }: WhyChooseUsSectionProps) => {

    return (
        <section className="relative overflow-hidden py-10 bg-gradient-to-b from-black/90 via-slate-950 to-blue-950">
            <div className={LAYOUT.container + " max-w-6xl xl:max-w-[1400px] mx-auto"}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Title */}
                    <h2 className={TYPOGRAPHY.sectionTitle + " text-center mb-8 w-full max-w-4xl mx-auto"}>
                        {title}
                    </h2>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20 md:mb-24">
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
                                    className="text-5xl md:text-6xl xl:text-7xl font-bold text-gradient mb-2 text-center text-stroke-white"
                                >
                                    {stat.value > 0 && <AnimatedCounter from={0} to={stat.value} />}
                                    {stat.suffix}
                                </div>
                                <p className={TYPOGRAPHY.bodyMain + " text-center text-gradient leading-tight"}>{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Grid (Cards) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-8 mb-16 justify-items-center">
                        {features.map((feature, idx) => (
                            <Card
                                key={feature.id || idx}
                                className={`w-full min-h-[300px] xl:min-h-[340px] h-full p-6 flex flex-col gap-6 items-start text-left ${EFFECTS.glass}`}
                            >
                                <CardTitle className={TYPOGRAPHY.cardTitle + " text-gradient"}>
                                    {feature.title}
                                </CardTitle>
                                <CardDescription className={TYPOGRAPHY.bodySub + " !text-white/50 mt-2 block"}>
                                    {feature.sub_title}
                                </CardDescription>
                            </Card>
                        ))}
                    </div>

                    {cta && (
                        <div className="text-center">
                            <CTABtn
                                id={cta.id}
                                label={cta.label}
                                href={'/media/news'}
                                variant="premium"
                                className="text-lg px-8 py-6"
                            />
                        </div>
                    )}
                </motion.div>
            </div >
        </section >
    );
};

export default StatSection;
