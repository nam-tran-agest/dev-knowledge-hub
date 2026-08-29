"use client";

import { Plus, Minus } from "lucide-react";
import { ServiceWhyChooseUsProps } from "@/features/landing/types/service/service";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { TYPOGRAPHY, LAYOUT } from "@/lib/constants";
import Image from "next/image";
import why1 from "@/assets/images/home/why1.webp";

export default function WhyChooseUsSection({ title = "Why Choose Us", items }: ServiceWhyChooseUsProps) {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none -translate-y-1/2" />

            <div className={LAYOUT.container}>
                <div className="flex flex-col justify-center items-center gap-3 mb-16 text-center">
                    <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
                </div>

                <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-14 items-center lg:items-start">
                    {/* Right side - Accordion */}
                    <Accordion
                        type="multiple"
                        defaultValue={["item-0"]}
                        className="flex flex-col gap-4 w-full lg:w-1/2"
                    >
                        {items.map((item, index) => (
                            <AccordionItem
                                key={item.id}
                                value={`item-${index}`}
                                className="border border-white/10 rounded-2xl overflow-hidden bg-[#070d1e]/50 backdrop-blur-xl data-[state=open]:border-indigo-500/40 data-[state=open]:bg-[#0c142c]/70 transition-all duration-300 shadow-md glare-top"
                            >
                                <AccordionTrigger className="group flex items-center justify-between w-full px-6 py-5 hover:no-underline text-white [&>svg]:hidden cursor-pointer">
                                    <span className="text-base sm:text-lg font-bold text-left text-white group-hover:text-indigo-200 transition-colors">
                                        {item.title}
                                    </span>
                                    <span className="relative rounded-full p-2 border flex items-center justify-center bg-white/[0.04] border-white/10 text-slate-400 group-data-[state=open]:border-indigo-500/50 group-data-[state=open]:bg-indigo-500/20 group-data-[state=open]:text-indigo-300 transition-all shrink-0 ml-4 shadow-sm">
                                        <Plus strokeWidth={2.5} size={15} className="group-data-[state=open]:hidden" />
                                        <Minus strokeWidth={2.5} size={15} className="hidden group-data-[state=open]:block" />
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm sm:text-base leading-relaxed px-6 pb-6 pt-1 font-normal">
                                    {item.subTitle}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Left side - Image with Glare */}
                    <div className="relative w-full lg:w-1/2 flex justify-center self-center">
                        <div className="w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-[#070b16] relative aspect-[4/3] group glare-top">
                            <Image
                                src={why1}
                                alt="Why Choose Us"
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                placeholder="blur"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent opacity-60" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
