"use client";

import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import type { NavigationOptions, Swiper as SwiperType } from "swiper/types";

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { NewsItem } from '@/types/news';
import { useTranslations } from 'next-intl';
import CarouselDot from '@/components/common/ui/data-display/CarouselDot';

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
                className="rounded-3xl !overflow-y-visible scrollbar-none h-fit ring-1 ring-white/10"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.link}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative block h-[320px] md:h-[500px] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent z-10" />
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title || "Featured"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                                />
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20 space-y-4 md:space-y-6">
                                <div className="space-y-4">
                                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 uppercase text-[10px] md:text-xs">{t('badge')}</Badge>
                                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-3xl leading-[1.2] md:leading-[1.1]">{item.title}</h1>
                                    <p className="text-slate-400 max-w-2xl text-sm md:text-lg leading-relaxed line-clamp-2 hidden sm:line-clamp-2">{item.excerpt}</p>
                                </div>
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-emerald-500/50 bg-white p-0.5">
                                            <AvatarImage
                                                src={item.sourceLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.author}`}
                                                className="object-contain"
                                            />
                                            <AvatarFallback>VN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-[9px] md:text-sm gap-0.5">
                                            <div className="font-bold text-slate-500 text-[8px] md:text-[10px] uppercase leading-none">{t('editor')}</div>
                                            <div className="font-bold leading-tight">{item.author}</div>
                                        </div>
                                    </div>
                                    <Separator orientation="vertical" className="h-6 md:h-8 bg-white/10" />
                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-sm font-bold">
                                        <Clock className="w-3 h-3 md:w-4 md:h-4" /> <TimeDisplay isoDate={item.isoDate} />
                                    </div>
                                    <div className="ml-auto p-2 md:p-3 bg-white/10 group-hover:bg-emerald-500 group-hover:text-white rounded-full transition-all border border-white/5">
                                        <ExternalLink className="size-4 md:size-5" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="absolute right-10 top-10 z-30 hidden xl:flex gap-3">
                    <button
                        type="button"
                        ref={prevRef}
                        aria-label="Previous article"
                        className="size-10 flex items-center justify-center rounded-full border border-white/10 bg-black/40 text-white hover:bg-emerald-500 transition-all backdrop-blur-md cursor-pointer group/btn"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        ref={nextRef}
                        aria-label="Next article"
                        className="size-10 flex items-center justify-center rounded-full border border-white/10 bg-black/40 text-white hover:bg-emerald-500 transition-all backdrop-blur-md cursor-pointer group/btn"
                    >
                        <ArrowRight className="size-5" />
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
                        activeClassName="bg-emerald-500"
                    />
                ))}
            </div>
        </section>
    );
}
