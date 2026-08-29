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
                className="cyber-clip !overflow-y-visible scrollbar-none h-fit border border-primary/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.link}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative block h-[340px] md:h-[500px] overflow-hidden group cursor-pointer bg-[#050714]">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#04060f] via-[#04060f]/70 to-transparent z-10" />
                            <div className="absolute inset-0 bg-[#050714]">
                                <Image
                                    src={item.image}
                                    alt={item.title || "Featured"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
                                    unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                                />
                            </div>

                            {/* Top Corner HUD Tag */}
                            <div className="absolute top-4 left-6 z-20 px-2.5 py-1 bg-background/90 border border-primary/40 text-[9px] uppercase tracking-widest text-primary font-mono cyber-clip-tag">
                                // FEATURED_BROADCAST
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20 space-y-4 md:space-y-5">
                                <div className="space-y-2">
                                    <Badge className="bg-primary/20 text-primary border border-primary/50 uppercase text-[10px] px-2.5 py-0.5 font-mono font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                                        {t('badge')}
                                    </Badge>
                                    <h1 className="text-xl md:text-3xl font-mono font-bold tracking-wide max-w-3xl leading-snug text-white group-hover:text-primary transition-colors uppercase">
                                        {item.title}
                                    </h1>
                                    <p className="text-primary/70 max-w-2xl text-xs md:text-sm font-mono leading-relaxed line-clamp-2 hidden sm:line-clamp-2">
                                        {item.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 md:gap-6 border-t border-primary/20 pt-4">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Avatar className="w-8 h-8 cyber-clip-button border border-primary/40 bg-card p-0.5">
                                            <AvatarImage
                                                src={item.sourceLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.author}`}
                                                className="object-contain"
                                            />
                                            <AvatarFallback>VN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-[9px] md:text-xs gap-0.5 font-mono">
                                            <div className="font-semibold text-primary/60 uppercase tracking-widest text-[9px]">{t('editor')}</div>
                                            <div className="font-bold text-white uppercase">{item.author}</div>
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className="h-6 md:h-8 bg-primary/20" />
                                    <div className="flex items-center gap-2 text-primary/70 text-xs font-mono">
                                        <Clock className="w-3.5 h-3.5 text-primary" /> <TimeDisplay isoDate={item.isoDate} />
                                    </div>
                                    <div className="ml-auto p-2 cyber-clip-button bg-primary/15 group-hover:bg-primary group-hover:text-black text-primary transition-all border border-primary/40 shadow-md">
                                        <ArrowUpRight className="size-4" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="absolute right-6 top-6 z-30 hidden xl:flex gap-2">
                    <button
                        type="button"
                        ref={prevRef}
                        aria-label="Previous article"
                        className="size-8 flex items-center justify-center cyber-clip-button border border-primary/40 bg-card/80 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md cursor-pointer group/btn"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        ref={nextRef}
                        aria-label="Next article"
                        className="size-8 flex items-center justify-center cyber-clip-button border border-primary/40 bg-card/80 text-primary hover:bg-primary hover:text-black transition-all backdrop-blur-md cursor-pointer group/btn"
                    >
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            </Swiper>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
                {items.map((_, index) => (
                    <CarouselDot
                        key={index}
                        isActive={index === activeIndex}
                        onClick={() => swiperRef.current?.slideToLoop(index)}
                        activeClassName="bg-primary shadow-[0_0_10px_var(--color-primary)]"
                    />
                ))}
            </div>
        </section>
    );
}
