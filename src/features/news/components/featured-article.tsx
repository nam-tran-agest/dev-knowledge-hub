"use client";

import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import type { NavigationOptions, Swiper as SwiperType } from "swiper/types";

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { NewsItem } from '@/features/news/types';
import { useTranslations } from 'next-intl';
import CarouselDot from '@/components/ui/carousel-dot';

import { TimeDisplay } from "./time-display";

export function FeaturedArticle({ items }: { items: NewsItem[] }) {
    const t = useTranslations('media.news.featured');
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!items?.length) return null;

    const handleBeforeInit = (swiper: SwiperType) => {
        const nav = swiper.params.navigation;
        if (nav && typeof nav !== "boolean") {
            (nav as NavigationOptions).prevEl = prevRef.current;
            (nav as NavigationOptions).nextEl = nextRef.current;
        }
    };

    return (
        <section className="relative w-full overflow-visible">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={handleBeforeInit}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="rounded-3xl !overflow-y-visible scrollbar-none h-fit border border-white/10 shadow-2xl glare-top"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.link}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative block h-[340px] md:h-[520px] overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent z-10" />
                            <div className="absolute inset-0 bg-card">
                                <Image
                                    src={item.image}
                                    alt={item.title || "Featured"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
                                    unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                                />
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20 space-y-4 md:space-y-6">
                                <div className="space-y-3">
                                    <Badge className="bg-cyan-500 text-white backdrop-blur-md uppercase text-xs px-3 py-1 font-mono font-bold border-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]">{t('badge')}</Badge>
                                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-3xl leading-[1.2] md:leading-[1.1] text-white group-hover:text-cyan-200 transition-colors">{item.title}</h1>
                                    <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed line-clamp-2 hidden sm:line-clamp-2 font-normal">{item.excerpt}</p>
                                </div>
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-white/10 bg-white p-0.5 shadow-md">
                                            <AvatarImage
                                                src={item.sourceLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.author}`}
                                                className="object-contain"
                                            />
                                            <AvatarFallback>VN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-[9px] md:text-sm gap-0.5">
                                            <div className="font-semibold text-slate-400 text-[9px] md:text-[11px] uppercase tracking-wider font-mono">{t('editor')}</div>
                                            <div className="font-bold leading-tight text-white">{item.author}</div>
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className="h-6 md:h-8 bg-white/10" />
                                    <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm font-mono">
                                        <Clock className="w-3.5 h-3.5" /> <TimeDisplay isoDate={item.isoDate} />
                                    </div>
                                    <div className="ml-auto p-2.5 md:p-3 bg-white/[0.08] group-hover:bg-cyan-500 group-hover:text-white rounded-full transition-all border border-white/10 shadow-md">
                                        <ArrowUpRight className="size-4 md:size-5" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="absolute right-8 top-8 z-30 hidden xl:flex gap-2">
                    <button
                        type="button"
                        ref={prevRef}
                        aria-label="Previous article"
                        className="size-10 flex items-center justify-center rounded-full border border-white/10 bg-card text-white hover:bg-cyan-500 transition-all backdrop-blur-md cursor-pointer group/btn shadow-lg"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        ref={nextRef}
                        aria-label="Next article"
                        className="size-10 flex items-center justify-center rounded-full border border-white/10 bg-card text-white hover:bg-cyan-500 transition-all backdrop-blur-md cursor-pointer group/btn shadow-lg"
                    >
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            </Swiper>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {items.map((_, index) => (
                    <CarouselDot
                        key={index}
                        isActive={index === activeIndex}
                        onClick={() => swiperRef.current?.slideToLoop(index)}
                        activeClassName="bg-cyan-400"
                    />
                ))}
            </div>
        </section>
    );
}
