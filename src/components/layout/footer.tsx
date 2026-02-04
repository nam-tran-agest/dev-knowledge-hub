"use client";

import React from "react";
import { FooterData } from "@/types/base";
import { Mail, MapPin, Phone } from "lucide-react";
import StrapiImage from "@/components/common/media/StrapiImage";
import Link from "next/link"; // Changed from i18n/navigation

type FooterProps = {
    footer: FooterData;
};

export default function Footer({ footer }: FooterProps) {
    return (
        <footer className="bg-footer mx-auto px-4 md:px-8 lg:px-16 2xl:px-20 2xl:min-w-[1440px]">
            <div className="pb-16 pt-16 border-t-2 border-white/5 xl:pt-[60px] xl:pb-10">
                <div className="flex items-start gap-6 flex-col md:gap-10 lg:flex-row xl:gap-6">
                    <div className="flex w-full lg:w-1/2 flex-col md:flex-row gap-6 xl:gap-6">
                        {/* Logo and Contact Info */}
                        <div className="flex flex-col w-full md:w-1/2">
                            <div className="w-34 h-8 relative flex mb-10 items-center">
                                {/* Fallback Logo if missing */}
                                {footer.logo ? (
                                    <StrapiImage
                                        documentId={footer.logo?.documentId}
                                        url={footer.logo?.url}
                                        alternativeText={footer.logo?.alternativeText || "agest-logo"}
                                        className="object-contain"
                                        width={120}
                                        height={40}
                                    />
                                ) : (
                                    <div className="text-2xl font-bold text-white">DevHub</div>
                                )}
                            </div>

                            <div className="space-y-6 text-footer-text text-base mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary p-2 rounded-full">
                                        <Mail className="h-5 w-5" />
                                    </span>
                                    <span>{footer.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary p-2 rounded-full">
                                        <Phone className="h-5 w-5" />
                                    </span>
                                    <span>{footer.phone}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-primary items-start">
                                {footer.social_links.map((link, idx) => (
                                    <a key={idx} href={link.url} aria-label={link.label} className="relative w-5 h-5 opacity-70 hover:opacity-100 transition-opacity">
                                        {link.icon ? (
                                            <StrapiImage
                                                documentId={link.icon?.documentId}
                                                url={link.icon?.url}
                                                alternativeText={link.icon?.alternativeText || link.label}
                                                className="object-contain"
                                                width={20}
                                                height={20}
                                            />
                                        ) : (
                                            // Fallback icon visual
                                            <div className="w-5 h-5 bg-white/20 rounded-full" />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                        {/* Links */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-semibold text-base w-full md:w-1/2 text-gray-300">
                            {footer.footer_sections.map((section, idx) => (
                                <div key={idx} className="text-nowrap hover:text-white transition-colors">
                                    <Link href={section.url}>{section.label}</Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="flex flex-col md:flex-row gap-6 w-full lg:w-1/2 text-gray-300">
                        {footer.addresses.map((address) => (
                            <div key={address.id} className="space-y-2 ">
                                <span className="flex items-center gap-2 text-primary bg-primary/10 border-l-primary border-l-3 py-1 pl-1.5 text-base">
                                    <MapPin className="w-4 h-4" />
                                    <p className="font-semibold">{address.title}</p>
                                </span>
                                <p className="text-base leading-relaxed opacity-80">{address.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-10 border-t border-white/5 mt-10">
                    {/* Copyright, Badges, Policy Links & Partners - All in one flex container */}
                    <div className="flex flex-wrap items-start justify-between gap-8 lg:gap-0 lg:items-center">
                        {/* Copyright Text */}
                        <p className="w-full leading-relaxed text-base order-1 lg:flex-1 lg:max-w-3xl text-gray-400">
                            {footer.copyright}
                        </p>

                        {/* Certification Badges */}
                        {footer.certifications && footer.certifications.length > 0 && (
                            <div className="order-2 flex items-center justify-center w-full gap-4 sm:gap-8 lg:w-auto lg:gap-16 2xl:gap-32 lg:px-6">
                                {footer.certifications.map((cert, idx) => (
                                    <a
                                        key={idx}
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={cert.icon?.alternativeText || "Certification badge"}
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 block"
                                    >
                                        <StrapiImage
                                            documentId={cert.icon?.documentId}
                                            url={cert.icon?.url}
                                            alternativeText={cert.icon?.alternativeText || "Certification"}
                                            className="object-contain"
                                            fill
                                        />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Policy Links */}
                        {(() => {
                            const policyLinks = footer.policy_links;
                            if (policyLinks && policyLinks.length > 0) {
                                return (
                                    <div className="flex flex-row items-start justify-center w-full text-base text-gray-400 gap-4 order-5 md:items-center md:gap-8 lg:flex-col lg:items-start lg:w-auto lg:gap-8 lg:whitespace-nowrap lg:pl-4 lg:order-3">
                                        {policyLinks.map((link, idx) => (
                                            <React.Fragment key={idx}>
                                                <Link href={link.url} className="hover:underline transition-colors hover:text-white">
                                                    {link.label}
                                                </Link>
                                                {idx < policyLinks.length - 1 && (
                                                    <span className="lg:hidden">|</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                </div>
            </div>
        </footer>
    );
}
