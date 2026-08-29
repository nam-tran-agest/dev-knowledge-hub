"use client";

import { useRef, useState, useEffect } from "react";
import { getMediaUrl } from "@/components/common/media/AppImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ServiceCaseStudiesProps } from "@/features/landing/types/section/case-study";
import "swiper/css";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import CarouselDot from "@/components/ui/carousel-dot";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

import beethoven from "@/assets/images/music/beethoven.webp";
import mozart from "@/assets/images/music/mozart.webp";
import debussy from "@/assets/images/music/debussy.webp";
import chopin from "@/assets/images/music/chopin.webp";
import dvorak from "@/assets/images/music/dvorak.webp";
import Image from "next/image";

export default function CaseStudySection({ title, readMoreLabel = "Read More", caseStudies }: ServiceCaseStudiesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperRef>(null);
    const animTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (animTimerRef.current) clearTimeout(animTimerRef.current);
        };
    }, []);

    const handleSelect = (idx: number, scrollToSection = false) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(idx);
        if (swiperRef.current && swiperRef.current.swiper.activeIndex !== idx) {
            swiperRef.current.swiper.slideTo(idx);
        }
        if (scrollToSection) {
            sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (animTimerRef.current) clearTimeout(animTimerRef.current);
        animTimerRef.current = setTimeout(() => setIsAnimating(false), 500);
    };

    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? caseStudies.length - 1 : currentIndex - 1;
        handleSelect(newIndex, false);
    };

    const handleNext = () => {
        const newIndex = currentIndex === caseStudies.length - 1 ? 0 : currentIndex + 1;
        handleSelect(newIndex, false);
    };

    if (!caseStudies || caseStudies.length === 0) return null;

    const currentCase = caseStudies[currentIndex];
    const imageUrl = currentCase?.image ?? "";

    const FALLBACK_IMAGES = [
        beethoven,
        mozart,
        debussy,
        chopin,
        dvorak,
    ];

    return (
        <section ref={sectionRef} className="relative py-20 overflow-hidden">
            <div className={cn(LAYOUT.container, "flex flex-col items-center")}>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={TYPOGRAPHY.sectionTitle + " text-center mb-16"}
                >
                    {title}
                </motion.h2>

                {/* Mobile Swiper (below xl breakpoint) */}
                <div className="w-full xl:hidden">
                    <Swiper
                        modules={[]}
                        spaceBetween={16}
                        slidesPerView={1}
                        onSlideChange={(swiper) => handleSelect(swiper.activeIndex, true)}
                        ref={swiperRef}
                    >
                        {caseStudies.map((caseStudy, idx) => (
                            <SwiperSlide key={`case-study-mobile-${idx}`}>
                                <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                                    <Link
                                        href={caseStudy.slug}
                                        target={caseStudy.slug.startsWith('http') ? "_blank" : undefined}
                                        rel={caseStudy.slug.startsWith('http') ? "noopener noreferrer" : undefined}
                                        className="w-full rounded-2xl overflow-hidden shadow-lg block aspect-video relative"
                                    >
                                        <Image
                                            src={getMediaUrl(caseStudy.image) || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                            alt={caseStudy.title}
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                            fill
                                            sizes="(max-width: 1280px) 100vw, 50vw"
                                            priority={idx < 2}
                                        />
                                    </Link>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-white">
                                            {caseStudy.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                                            {caseStudy.description}
                                        </p>
                                        <Link
                                            href={caseStudy.slug}
                                            target={caseStudy.slug.startsWith('http') ? "_blank" : undefined}
                                            rel={caseStudy.slug.startsWith('http') ? "noopener noreferrer" : undefined}
                                            className="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold hover:gap-3 transition-all pt-2"
                                            aria-label="Read more about this case study"
                                        >
                                            {readMoreLabel}
                                            <ChevronRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Dots */}
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

                {/* Desktop Layout (xl and above) */}
                <div className="relative max-w-6xl mx-auto hidden xl:block w-full">
                    <div className="grid xl:grid-cols-2 gap-12 items-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
                        {/* Left - Image */}
                        <motion.div
                            key={`image-${currentIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="order-2 xl:order-1 flex justify-center"
                        >
                            <Link
                                href={currentCase.slug}
                                target={currentCase.slug.startsWith('http') ? "_blank" : undefined}
                                rel={currentCase.slug.startsWith('http') ? "noopener noreferrer" : undefined}
                                className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl block aspect-[4/3] relative group border border-white/10"
                            >
                                <div className="absolute inset-0 bg-[#07090e]/30 group-hover:bg-transparent transition-colors z-10" />
                                <Image
                                    src={getMediaUrl(imageUrl) || FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length]}
                                    alt={currentCase.title}
                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    fill
                                    sizes="(max-width: 1280px) 100vw, 50vw"
                                    priority
                                />
                            </Link>
                        </motion.div>

                        {/* Right - Content */}
                        <motion.div
                            key={`content-${currentIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="space-y-6 order-1 xl:order-2"
                        >
                            <h3 className="text-3xl font-bold text-white leading-tight">
                                {currentCase.title}
                            </h3>

                            <p className="text-slate-300 text-base leading-relaxed">
                                {currentCase.description}
                            </p>

                            <Link
                                href={currentCase.slug}
                                target={currentCase.slug.startsWith('http') ? "_blank" : undefined}
                                rel={currentCase.slug.startsWith('http') ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-2 text-indigo-400 text-base font-semibold hover:gap-3 transition-all"
                                aria-label="Read more about this case study"
                            >
                                {readMoreLabel}
                                <ChevronRight className="size-5 text-indigo-400" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-between pointer-events-none w-full absolute top-1/2 -translate-y-1/2 -left-6 -right-6 z-20">
                        <button
                            onClick={handlePrev}
                            className="size-12 pointer-events-auto grid place-items-center rounded-full border border-white/10 bg-zinc-900/90 text-white shadow-xl hover:bg-zinc-800 hover:border-indigo-500/50 hover:scale-105 transition-all group/nav"
                            aria-label="Previous case study"
                        >
                            <ChevronLeft className="size-5 group-hover/nav:text-indigo-400 transition-colors" />
                        </button>

                        <button
                            onClick={handleNext}
                            className="size-12 pointer-events-auto grid place-items-center rounded-full border border-white/10 bg-zinc-900/90 text-white shadow-xl hover:bg-zinc-800 hover:border-indigo-500/50 hover:scale-105 transition-all group/nav"
                            aria-label="Next case study"
                        >
                            <ChevronRight className="size-5 group-hover/nav:text-indigo-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
