"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { iconsMap } from "@/components/common/icon";
import { getMediaUrl } from "@/components/common/media/AppImage";

import RichTextRenderer from "@/components/common/ui/data-display/RichTextRenderer";
import CarouselDot from "@/components/common/ui/data-display/CarouselDot";
import CategoryTab from "@/components/common/ui/navigation/CategoryTab";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";

const FeatureSection = ({
    title,
    services, // mapped from user code, represented as 'features' in usage
}: {
    title: string;    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    services: any[]
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");
    const swiperRef = useRef<SwiperRef>(null);

    // Find the index of the selected service based on slug
    const selected = services.findIndex(s => s.slug === categoryQuery) === -1
        ? 0
        : services.findIndex(s => s.slug === categoryQuery);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSlideChange = (swiper: any) => {
        const index = swiper.activeIndex;
        const service = services[index];
        if (service && service.slug !== categoryQuery) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("category", service.slug);
            params.set("page", "1");
            router.push(`?${params.toString()}`, { scroll: false });
        }
    };

    // Sync Swiper whenever 'selected' index changes (from URL)
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper.activeIndex !== selected) {
            swiperRef.current.swiper.slideTo(selected, 500);
        }
    }, [selected]);

    return (
        <section id="features-section" className={cn(LAYOUT.container, "py-10 scroll-mt-20")}>
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex flex-col gap-10"
            >
                {/* Header */}
                <div className="flex flex-col justify-center items-center gap-5">
                    <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
                </div>

                {/* Buttons */}
                <CategoryTab
                    categories={services.map(s => ({ id: s.slug, title: s.title, slug: s.slug, icon: s.icon }))}
                    selected={categoryQuery || "all"}
                    syncId="features-section"
                />

                {/* Content Section */}
                <div className="relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/5 bg-white/5 md:h-[620px]">
                    {/* Background Video/Media */}
                    <div className="absolute inset-0 -z-10 hidden md:block">
                        <AnimatePresence mode="popLayout">
                            {services[selected]?.background_media?.url ? (
                                <motion.video
                                    key={services[selected]?.background_media?.url}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.2 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src={getMediaUrl(services[selected]?.background_media?.url) ?? ""} type="video/mp4" />
                                </motion.video>
                            ) : (
                                <motion.div
                                    key="fallback-bg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content Overlay (Mobile Swiper) */}
                    <div className="md:hidden">
                        <Swiper
                            pagination={{ enabled: false }}
                            spaceBetween={16}
                            slidesPerView={1}
                            initialSlide={selected}
                            speed={500}
                            grabCursor={true}
                            onSlideChange={handleSlideChange}
                            ref={swiperRef}
                        >
                            {services.map((service, idx) => (
                                <SwiperSlide key={`service-mobile-${idx}`}>
                                    <div className="flex flex-col p-6 gap-8 min-h-[500px]">
                                        <div className="flex gap-4 items-center">
                                            <span className="size-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary [&>svg]:w-8 [&>svg]:h-8">
                                                {iconsMap[service.icon] ? React.createElement(iconsMap[service.icon]) : <div className="w-8 h-8" />}
                                            </span>
                                            <h3 className={TYPOGRAPHY.cardTitle}>{service.title}</h3>
                                        </div>

                                        <RichTextRenderer
                                            content={service.features}
                                            className={TYPOGRAPHY.bodySub}
                                        />

                                        <Link
                                            href={service.slug}
                                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold transition-all w-fit hover:bg-gray-100"
                                        >
                                            <span>Explore {service.title}</span>
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/** Desktop (Static) */}
                    <div className="hidden md:flex z-20 w-full md:w-2/3 lg:w-1/2 p-12 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selected}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="flex flex-col gap-8 w-full justify-center"
                            >
                                <div className="flex gap-6 items-center">
                                    <span className="size-20 flex items-center justify-center rounded-3xl bg-white/10 text-white backdrop-blur-sm [&>svg]:w-10 [&>svg]:h-10 border border-white/10">
                                        {iconsMap[services[selected]?.icon] ? React.createElement(iconsMap[services[selected]?.icon]) : null}
                                    </span>
                                    <h3 className={TYPOGRAPHY.cardTitle}>{services[selected]?.title}</h3>
                                </div>

                                <div className={TYPOGRAPHY.bodyMain}>
                                    <RichTextRenderer
                                        content={services[selected]?.features}
                                    />
                                </div>

                                <Link
                                    href={services[selected]?.slug} // Using slug directly as path for now
                                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold transition-all w-fit hover:bg-gray-100 mt-4"
                                >
                                    <span>Go to {services[selected]?.title}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Dots */}
                <div className="flex justify-center gap-3 md:hidden">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {services.map((item: any, idx: number) => (
                        <CarouselDot
                            key={`${idx}-dot-service`}
                            isActive={selected === idx}
                            onClick={() => {
                                swiperRef.current?.swiper.slideTo(idx);
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default FeatureSection;
