"use client";

import { useRef, useState } from "react";
import { getStrapiMedia } from "@/components/common/media/StrapiImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ServiceCaseStudiesProps } from "@/types/section/case-study";
import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import CarouselDot from "@/components/common/ui/data-display/CarouselDot";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

export default function CaseStudySection({ title, readMoreLabel = "Read More", caseStudies }: ServiceCaseStudiesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperRef>(null);

    const handleSelect = (idx: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(idx);
        if (swiperRef.current && swiperRef.current.swiper.activeIndex !== idx) {
            swiperRef.current.swiper.slideTo(idx);
        }
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? caseStudies.length - 1 : currentIndex - 1;
        handleSelect(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex === caseStudies.length - 1 ? 0 : currentIndex + 1;
        handleSelect(newIndex);
    };

    if (!caseStudies || caseStudies.length === 0) return null;

    const currentCase = caseStudies[currentIndex];
    const imageUrl = currentCase?.image ?? "";

    return (
        <section ref={sectionRef} className={cn(LAYOUT.container, "py-10")}>
            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={TYPOGRAPHY.sectionTitle + " text-center mb-12"}
            >
                {title}
            </motion.h2>

            {/* Mobile Swiper */}
            <div className="w-full xl:hidden">
                <Swiper
                    spaceBetween={16}
                    slidesPerView={1}
                    onSlideChange={(swiper) => handleSelect(swiper.activeIndex)}
                    ref={swiperRef}
                >
                    {caseStudies.map((caseStudy, idx) => (
                        <SwiperSlide key={`case-study-mobile-${idx}`}>
                            <div className="flex flex-col gap-6 bg-white/5 border border-white/10 rounded-3xl p-6">
                                <Link href={caseStudy.slug} className="w-full rounded-2xl overflow-hidden aspect-video relative block">
                                    {/* Fallback for Image */}
                                    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getStrapiMedia(caseStudy.image) || "https://placehold.co/600x400/1e293b/white?text=Case+Study"}
                                        alt={caseStudy.title}
                                        className="w-full h-full object-cover relative z-10"
                                    />
                                </Link>
                                <div className="space-y-4">
                                    <h3 className={TYPOGRAPHY.cardTitle + " leading-relaxed"}>
                                        {caseStudy.title}
                                    </h3>
                                    <p className={TYPOGRAPHY.bodySub + " line-clamp-4 text-justify"}>
                                        {caseStudy.description}
                                    </p>
                                    <Link
                                        href={caseStudy.slug}
                                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                                    >
                                        {readMoreLabel}
                                        <ChevronRight className="size-5" />
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex justify-center gap-2 mt-6">
                    {caseStudies.map((_, idx) => (
                        <CarouselDot
                            key={`dot-${idx}`}
                            isActive={currentIndex === idx}
                            onClick={() => swiperRef.current?.swiper.slideTo(idx)}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="relative max-w-screen-xl mx-auto hidden xl:block">
                <div className="grid xl:grid-cols-2 gap-12 items-center">
                    {/* Left - Image */}
                    <motion.div
                        key={`image-${currentIndex}`}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="order-2 xl:order-1"
                    >
                        <Link href={currentCase.slug} className="w-full rounded-3xl overflow-hidden shadow-2xl block border border-white/10 relative aspect-[4/3] group">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getStrapiMedia(imageUrl) || "https://placehold.co/800x600/1e293b/white?text=Case+Study"}
                                alt={currentCase.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </Link>
                    </motion.div>

                    {/* Right - Content */}
                    <motion.div
                        key={`content-${currentIndex}`}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="space-y-8 order-1 xl:order-2 p-8"
                    >
                        <h3 className={TYPOGRAPHY.heroTitle + " text-3xl md:text-4xl text-slate-900"}>
                            {currentCase.title}
                        </h3>

                        <p className={TYPOGRAPHY.bodyMain + " text-justify"}>
                            {currentCase.description}
                        </p>

                        <Link
                            href={currentCase.slug}
                            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            {readMoreLabel}
                            <ChevronRight className="ml-2 size-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none w-full px-4 -mx-16">
                    <button
                        onClick={handlePrev}
                        className="size-14 pointer-events-auto grid place-items-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all text-white"
                    >
                        <ChevronLeft className="size-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="size-14 pointer-events-auto grid place-items-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg hover:bg-white/20 transition-all text-white"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
