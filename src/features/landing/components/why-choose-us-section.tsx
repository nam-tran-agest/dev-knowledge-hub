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
        <section className="py-10 bg-gradient-to-br from-[#122550] via-[#2a5ca8] to-[#0a1430]">
            <div className={LAYOUT.container}>
                <div className="flex flex-col justify-center items-center gap-5 mb-10">
                    <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-20 items-center md:items-start">
                    {/* Right side - Accordion */}
                    <Accordion
                        type="multiple"
                        defaultValue={["item-0"]}
                        className="flex flex-col gap-4 md:gap-8 w-full md:w-[45%]"
                    >
                        {items.map((item, index) => (
                            <AccordionItem
                                key={item.id}
                                value={`item-${index}`}
                                className="border-0"
                            >
                                <AccordionTrigger className="group flex items-center justify-between w-full px-4 md:px-6 py-3 md:py-4 rounded-full border border-[#D5D6D8] bg-white hover:bg-gray-50 hover:no-underline data-[state=open]:text-primary data-[state=open]:shadow-sm [&>svg]:hidden">
                                    <span className={TYPOGRAPHY.label + " normal-case text-left text-gradient"}>
                                        {item.title}
                                    </span>
                                    <span className="relative rounded-full p-1.5 md:p-2 border flex items-center justify-center bg-white border-[#D5D6D8] text-secondary group-data-[state=open]:border-primary group-data-[state=open]:text-primary">
                                        <Plus strokeWidth={3} size={16} className="md:w-[18px] md:h-[18px] group-data-[state=open]:hidden" />
                                        <Minus strokeWidth={3} size={16} className="md:w-[18px] md:h-[18px] hidden group-data-[state=open]:block" />
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className={TYPOGRAPHY.bodySub + " text-white/90 font-semibold px-4 md:px-6 pb-4 pt-2"}>
                                    {item.subTitle}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Left side - Image */}
                    <div className="relative w-full md:w-[50%] flex justify-center self-start">
                        <div className="max-w-[625px] w-full overflow-hidden rounded-xl shadow-lg border">
                            <Image
                                src={why1}
                                alt="Why Choose Us"
                                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                                placeholder="blur"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
