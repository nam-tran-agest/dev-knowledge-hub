"use client";

import { GridLinksSectionProps } from "@/features/landing/types/section/grid-links";
import AppImage from "@/components/common/media/AppImage";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY, LAYOUT, EFFECTS } from "@/lib/constants";

export default function GridLinksSection({ title, items }: GridLinksSectionProps) {
    return (
        <motion.section
            className={cn(LAYOUT.container, "py-10")}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-5 mb-16">
                <h2 className={TYPOGRAPHY.sectionTitle}>{title}</h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {/* Background gradient blur */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
                    aria-hidden="true"
                >
                    <div className="w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] opacity-40" />
                </div>

                {items.map((item, idx) => {
                    const cardContent = (
                        <Card
                            key={item.label || idx}
                            className={cn(
                                "rounded-3xl py-8 flex flex-col items-center justify-center text-center",
                                EFFECTS.glass
                            )}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                                <div className="w-16 h-16 flex items-center justify-center relative">
                                    {/* Fallback icon or image */}
                                    {item.image ? (
                                        <AppImage
                                            documentId={item.image.documentId}
                                            url={item.image.url}
                                            alternativeText={item.image.alternativeText || item.label}
                                            className="object-contain"
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
                                            {item.label.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className={TYPOGRAPHY.bodySub + " font-semibold text-slate-800"}>{item.label}</CardTitle>
                            </CardContent>
                        </Card>
                    );

                    if (item.Url) {
                        const url = item.Url.startsWith("/") || item.Url.startsWith("http") ? item.Url : `/${item.Url}`;
                        return (
                            <Link key={item.label} href={url} className="block group">
                                {cardContent}
                            </Link>
                        );
                    }

                    return <div key={item.label}>{cardContent}</div>;
                })}
            </div>
        </motion.section>
    );
}
