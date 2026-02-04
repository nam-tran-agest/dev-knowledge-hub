"use client";

import { MarqueeSectionProps } from "@/types/section/marquee";
import StrapiImage from "@/components/common/media/StrapiImage";
import Marquee from "react-fast-marquee";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/lib/constants";

const MarqueeSection: React.FC<MarqueeSectionProps> = ({
    title,
    logos,
    background_image,
}) => {
    return (
        <section className="flex flex-col gap-4 h-[300px] sm:h-[380px] px-0 py-10 relative overflow-hidden">
            {/* Background Overlay if Image Provided */}
            {background_image && (
                <div className="absolute inset-0 w-full h-full -z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
                    <StrapiImage
                        documentId={background_image.documentId}
                        url={background_image.url}
                        alternativeText={background_image.alternativeText || title}
                        className="object-cover opacity-20 w-full h-full"
                        fill
                    />
                </div>
            )}

            <div className="relative h-full flex flex-col justify-center gap-10">
                <div className="flex flex-col justify-center items-center gap-5 z-20 px-4">
                    {/* Section Title */}
                    <h2 className={TYPOGRAPHY.label + " text-gradient text-center"}>{title}</h2>
                </div>

                {logos && logos.length > 0 && (
                    <Marquee autoFill gradient={false} speed={40}>
                        {logos.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative size-24 md:size-32 mx-8 md:mx-12 opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer"
                            >
                                <StrapiImage
                                    url={item.url}
                                    documentId={item.documentId}
                                    alternativeText={item.alternativeText || `Logo-${idx}`}
                                    className="object-contain"
                                    fill
                                />
                            </div>
                        ))}
                    </Marquee>
                )}
            </div>
        </section>
    );
};

export default MarqueeSection;
