"use client";

import { motion } from "motion/react";
import AnimatedCounter from "@/components/ui/animated-counter";
import { CTABtnV2 as CTABtn } from "@/components/ui/cta-btn";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { WhyChooseUsSection as WhyChooseUsSectionProps } from "@/features/landing/types/section/why-choose-us";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const StatSection = ({ title, stats, features, cta }: WhyChooseUsSectionProps) => {

    return (
        <section className="relative overflow-hidden py-20">
            {/* Subtle Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none" />

            <div className={LAYOUT.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Title */}
                    <h2 className={TYPOGRAPHY.sectionTitle + " text-center mb-16 max-w-4xl mx-auto"}>
                        {title}
                    </h2>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md"
                            >
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-2 font-mono">
                                    {stat.value > 0 && <AnimatedCounter from={0} to={stat.value} />}
                                    {stat.suffix}
                                </div>
                                <p className="text-slate-400 text-sm sm:text-base font-medium">{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Grid (Cards) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, idx) => (
                            <Card
                                key={feature.id || idx}
                                className="p-8 flex flex-col justify-between rounded-3xl bg-white/[0.03] border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] group"
                            >
                                <div>
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 mb-6 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform" />
                                    <CardTitle className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 text-sm leading-relaxed">
                                        {feature.sub_title}
                                    </CardDescription>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {cta && (
                        <div className="text-center pt-4">
                            <CTABtn
                                id={cta.id}
                                label={cta.label}
                                href={'/media/news'}
                                variant="premium"
                                className="text-base px-8 py-5 rounded-full font-semibold shadow-[0_0_25px_rgba(99,102,241,0.3)]"
                            />
                        </div>
                    )}
                </motion.div>
            </div >
        </section >
    );
};

export default StatSection;
