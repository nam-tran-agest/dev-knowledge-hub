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
        <section className="relative py-20 overflow-hidden">
            <div className={LAYOUT.container}>
                <div className="flex flex-col justify-center items-center gap-3 mb-16 text-center">
                    <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
                </div>

                <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center lg:items-start">
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
                                className="border-0 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 data-[state=open]:border-indigo-500/30 data-[state=open]:bg-white/[0.04] transition-all"
                            >
                                <AccordionTrigger className="group flex items-center justify-between w-full px-6 py-5 hover:no-underline text-white [&>svg]:hidden">
                                    <span className="text-base sm:text-lg font-semibold text-left text-white group-hover:text-indigo-300 transition-colors">
                                        {item.title}
                                    </span>
                                    <span className="relative rounded-full p-2 border flex items-center justify-center bg-white/[0.05] border-white/10 text-slate-400 group-data-[state=open]:border-indigo-500/50 group-data-[state=open]:bg-indigo-500/20 group-data-[state=open]:text-indigo-300 transition-all shrink-0 ml-4">
                                        <Plus strokeWidth={2.5} size={16} className="group-data-[state=open]:hidden" />
                                        <Minus strokeWidth={2.5} size={16} className="hidden group-data-[state=open]:block" />
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed px-6 pb-6 pt-1 font-normal">
                                    {item.subTitle}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Left side - Image */}
                    <div className="relative w-full lg:w-1/2 flex justify-center self-center">
                        <div className="w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-white/[0.02] relative aspect-[4/3] group">
                            <Image
                                src={why1}
                                alt="Why Choose Us"
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                placeholder="blur"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/70 via-transparent to-transparent opacity-50" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
