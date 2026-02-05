"use client";

import { useRef, useState } from "react";
import { getMediaUrl } from "@/components/common/media/AppImage";
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

    const handleSelect = (idx: number, scrollToSection = false) => {
        if (isAnimating) return; // Prevent rapid clicks
        setIsAnimating(true);
        setCurrentIndex(idx);
        if (swiperRef.current && swiperRef.current.swiper.activeIndex !== idx) {
            swiperRef.current.swiper.slideTo(idx);
        }
        if (scrollToSection) {
            sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        // Reset after animation duration
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? caseStudies.length - 1 : currentIndex - 1;
        handleSelect(newIndex, false); // No scroll on desktop arrows
    };

    const handleNext = () => {
        const newIndex = currentIndex === caseStudies.length - 1 ? 0 : currentIndex + 1;
        handleSelect(newIndex, false); // No scroll on desktop arrows
    };

    if (!caseStudies || caseStudies.length === 0) return null;

    const currentCase = caseStudies[currentIndex];
    const imageUrl = currentCase?.image ?? "";

    const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Dashboard
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",     // Data Analysis
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", // Meeting
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80", // Wireframe
    ];

    return (
        <section ref={sectionRef} className={cn(LAYOUT.container, "py-12 flex flex-col items-center")}>
            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={TYPOGRAPHY.sectionTitle + " text-center mb-4 xl:mb-12"}
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
                            <div className="flex flex-col gap-6">
                                <Link href={caseStudy.slug} className="w-full rounded-3xl overflow-hidden shadow-lg block aspect-video relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getMediaUrl(caseStudy.image) || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                        alt={caseStudy.title}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                                        {caseStudy.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-justify line-clamp-4">
                                        {caseStudy.description}
                                    </p>
                                    <Link
                                        href={caseStudy.slug}
                                        className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                                        aria-label="Read more about this case study"
                                    >
                                        {readMoreLabel}
                                        <ChevronRight className="size-5" />
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
            <div className="relative max-w-screen-xl mx-auto hidden xl:block w-full">
                <div className="grid xl:grid-cols-2 gap-12 items-center xl:px-4 2xl:px-2">
                    {/* Left - Image */}
                    <motion.div
                        key={`image-${currentIndex}`}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="order-2 xl:order-1 flex justify-center xl:justify-start"
                    >
                        <Link href={currentCase.slug} className="w-full max-w-xl rounded-3xl overflow-hidden shadow-lg block aspect-[4/3] relative group">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getMediaUrl(imageUrl) || FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length]}
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
                        className="space-y-6 order-1 xl:order-2"
                    >
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                            {currentCase.title}
                        </h3>

                        <p className="text-gray-600 text-lg leading-relaxed text-justify">
                            {currentCase.description}
                        </p>

                        <Link
                            href={currentCase.slug}
                            className="inline-flex items-center gap-2 text-primary text-lg font-semibold hover:gap-3 transition-all"
                            aria-label="Read more about this case study"
                        >
                            {readMoreLabel}
                            <ChevronRight className="size-5" />
                        </Link>
                    </motion.div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-center gap-4 mt-8 xl:mt-0 xl:absolute xl:inset-y-1/2 xl:-translate-y-1/2 xl:left-0 xl:right-0 xl:justify-between pointer-events-none w-full z-20">
                    <button
                        onClick={handlePrev}
                        className="size-12 xl:size-14 pointer-events-auto grid place-items-center rounded-full border border-gray-200 bg-white shadow-lg hover:bg-gray-50 transition-colors xl:-ml-14 2xl:-ml-24"
                        aria-label="Previous case study"
                    >
                        <ChevronLeft className="size-6 text-gray-700" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="size-12 xl:size-14 pointer-events-auto grid place-items-center rounded-full border border-gray-200 bg-white shadow-lg hover:bg-gray-50 transition-colors xl:-mr-14 2xl:-mr-24"
                        aria-label="Next case study"
                    >
                        <ChevronRight className="size-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </section>
    );
}
