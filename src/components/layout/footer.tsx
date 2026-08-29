"use client";

import React from "react";
import { FooterData } from "@/types/layout";
import { Mail, MapPin, Phone, Twitter, Facebook, Github, Youtube, Instagram, Linkedin, Globe, Terminal } from "lucide-react";
import AppImage from "@/components/common/media/AppImage";
import { Link } from '@/i18n/routing';
import { StarryBackground } from "@/components/layout/starry-background";

export default function Footer({ footer }: { footer: FooterData }) {
    return (
        <footer className="relative bg-[#03050c] border-t border-primary/25 overflow-hidden text-muted-foreground glare-top">
            <StarryBackground />
            
            {/* Top decorative neon wire */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            {/* FUI Corner Markers */}
            <div className="absolute top-0 left-6 w-3 h-3 border-t-2 border-l-2 border-primary/60 pointer-events-none" />
            <div className="absolute top-0 right-6 w-3 h-3 border-t-2 border-r-2 border-primary/60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-primary/20">
                    {/* Logo & Contact */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            {footer.logo ? (
                                <AppImage
                                    documentId={footer.logo?.documentId}
                                    url={footer.logo?.url}
                                    alternativeText={footer.logo?.alternativeText || "logo"}
                                    className="object-contain"
                                    width={140}
                                    height={40}
                                />
                            ) : (
                                <div className="text-xl font-mono font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary-foreground uppercase">
                                    DEV_HUB // TERMINAL
                                </div>
                            )}
                        </div>

                        <p className="text-xs font-mono text-primary/70 max-w-sm leading-relaxed uppercase tracking-wide">
                            // SYSTEM_STATUS: OPERATIONAL [24/7]
                            <br />
                            Personal productivity, developer knowledge curation and gaming vault designed for effortless workflow.
                        </p>

                        <div className="space-y-3 text-xs font-mono text-primary/80">
                            {footer.email && (
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                                        <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <span>{footer.email}</span>
                                </div>
                            )}
                            {footer.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                                        <Phone className="h-3.5 w-3.5" />
                                    </div>
                                    <span>{footer.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-2 pt-2">
                            {footer.social_links.map((link, idx: number) => {
                                const l = link.label.toLowerCase();
                                const getSocialIcon = () => {
                                    if (l.includes('twitter') || l.includes('x')) return <Twitter className="w-3.5 h-3.5" />;
                                    if (l.includes('facebook')) return <Facebook className="w-3.5 h-3.5" />;
                                    if (l.includes('github')) return <Github className="w-3.5 h-3.5" />;
                                    if (l.includes('youtube')) return <Youtube className="w-3.5 h-3.5" />;
                                    if (l.includes('instagram')) return <Instagram className="w-3.5 h-3.5" />;
                                    if (l.includes('linkedin')) return <Linkedin className="w-3.5 h-3.5" />;
                                    return <Globe className="w-3.5 h-3.5" />;
                                };

                                return (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                        className="w-8 h-8 cyber-clip-button bg-primary/5 border border-primary/30 flex items-center justify-center text-primary/70 hover:text-primary hover:border-primary hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                                    >
                                        {getSocialIcon()}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-primary" />
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">// NAVIGATION</h4>
                        </div>
                        <div className="flex flex-col space-y-2 text-xs font-mono">
                            {footer.footer_sections.map((section: { label: string; url: string }, idx: number) => (
                                <Link
                                    key={idx}
                                    href={section.url}
                                    className="text-primary/60 hover:text-primary transition-colors flex items-center gap-1.5 group"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 text-primary text-[10px] transition-opacity">▶</span>
                                    <span>{section.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Addresses / Locations */}
                    <div className="lg:col-span-4 space-y-4">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">// LOCATIONS</h4>
                        <div className="space-y-3">
                            {footer.addresses.map((address: { id: string | number; title: string; content: string }) => (
                                <div key={address.id} className="p-3.5 cyber-clip bg-card/60 border border-primary/20 space-y-1 relative group">
                                    <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <span>{address.title}</span>
                                    </div>
                                    <p className="text-[11px] font-mono text-primary/60 leading-relaxed pl-5">{address.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-primary/60">
                    <p className="tracking-wider">{footer.copyright} <span className="text-primary/40">// BUILD_V2.4.0-NEO</span></p>
                    {footer.policy_links && footer.policy_links.length > 0 && (
                        <div className="flex items-center gap-6">
                            {footer.policy_links.map((link: { label: string; url: string }, idx: number) => (
                                <Link key={idx} href={link.url} className="hover:text-primary transition-colors uppercase tracking-wider text-[11px]">
                                    [ {link.label} ]
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
