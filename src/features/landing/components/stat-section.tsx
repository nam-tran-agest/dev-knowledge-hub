"use client";

import { motion } from "motion/react";
import AnimatedCounter from "@/components/ui/animated-counter";
import { CTABtnV2 as CTABtn } from "@/components/ui/cta-btn";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { WhyChooseUsSection as WhyChooseUsSectionProps } from "@/features/landing/types/section/why-choose-us";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const StatSection = ({ title, stats, features, cta }: WhyChooseUsSectionProps) => {

    return (
        <section className="relative overflow-hidden py-24">
            {/* Ambient Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-20">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6 sm:p-8 rounded-3xl bg-[#070d1e]/50 border border-white/10 backdrop-blur-xl shadow-lg glare-top group hover:border-indigo-500/40 hover:bg-[#0c142c]/60 transition-all duration-300"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-2 font-mono tracking-tight">
                                    {stat.value > 0 && <AnimatedCounter from={0} to={stat.value} />}
                                    {stat.suffix}
                                </div>
                                <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide uppercase font-mono">{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Grid (Cards) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, idx) => (
                            <Card
                                key={feature.id || idx}
                                className="p-7 flex flex-col justify-between rounded-3xl bg-[#070d1e]/40 border-white/10 hover:border-indigo-500/40 hover:bg-[#0c142c]/60 transition-all duration-300 shadow-xl glare-top group"
                            >
                                <div>
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 mb-5 shadow-[0_0_12px_rgba(99,102,241,0.8)] group-hover:scale-125 transition-transform" />
                                    <CardTitle className="text-lg font-bold text-white mb-2.5 group-hover:text-indigo-200 transition-colors">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
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
                                className="text-base px-9 py-5 rounded-full font-bold shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] transition-all cursor-pointer"
                            />
                        </div>
                    )}
                </motion.div>
            </div >
        </section >
    );
};

export default StatSection;
