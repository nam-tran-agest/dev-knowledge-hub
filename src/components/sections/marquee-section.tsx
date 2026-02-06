"use client";

import { MarqueeSectionProps } from "@/types/section/marquee";
import AppImage from "@/components/common/media/AppImage";
import Marquee from "react-fast-marquee";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/lib/constants";

const MarqueeSection: React.FC<MarqueeSectionProps> = ({
    title,
    logos,
    background_image,
}) => {
    return (
        <section className="flex flex-col gap-4 py-10 md:py-16 relative overflow-hidden bg-gradient-to-b from-black/90 via-slate-950 to-blue-950">
            {/* Background Overlay if Image Provided */}
            {background_image && (
                <div className="absolute inset-0 w-full h-full -z-10 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 z-10" />
                    <AppImage
                        documentId={background_image.documentId}
                        url={background_image.url}
                        alternativeText={background_image.alternativeText || title}
                        className="object-cover w-full h-full"
                        fill
                    />
                </div>
            )}

            <div className="relative w-full flex flex-col justify-center gap-8 md:gap-12">
                <div className="flex flex-col justify-center items-center gap-2 z-20 px-4">
                    {/* Section Title */}
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-center mb-4")}>{title}</h2>
                </div>

                {logos && logos.length > 0 && (
                    <div dir="ltr" className="w-full">
                        <Marquee autoFill gradient={false} speed={50} direction="left" pauseOnHover className="py-4 overflow-y-visible">
                            {logos.map((item, idx) => (
                                <div key={idx} className="mx-8 md:mx-12 py-2">
                                    <div
                                        className="relative h-12 w-24 md:h-24 md:w-48 transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center filter mix-blend-multiply"
                                    >
                                        {(item as any).href ? (
                                            <a
                                                href={(item as any).href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full h-full relative"
                                            >
                                                <AppImage
                                                    url={item.url}
                                                    documentId={item.documentId}
                                                    alternativeText={item.alternativeText || `Logo-${idx}`}
                                                    className="object-contain w-full h-full"
                                                    fill
                                                />
                                            </a>
                                        ) : (
                                            <AppImage
                                                url={item.url}
                                                documentId={item.documentId}
                                                alternativeText={item.alternativeText || `Logo-${idx}`}
                                                className="object-contain w-full h-full"
                                                fill
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Marquee>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MarqueeSection;
