"use client";

import React from "react";
import { FooterData } from "@/types/layout";
import { Mail, MapPin, Phone, Twitter, Facebook, Github, Youtube, Instagram, Linkedin, Globe, Terminal, ArrowUp, Activity, ShieldCheck, Cpu, Layers } from "lucide-react";
import AppImage from "@/components/common/media/AppImage";
import { Link } from '@/i18n/routing';
import { StarryBackground } from "@/components/layout/starry-background";

export default function Footer({ footer }: { footer: FooterData }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-[#02040a] border-t border-primary/30 overflow-hidden text-slate-300 glare-top font-mono">
            <StarryBackground />
            
            {/* Top decorative neon wire & scanner */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_var(--color-primary)]" />
            
            {/* FUI Corner Markers */}
            <div className="absolute top-0 left-6 w-4 h-4 border-t-2 border-l-2 border-primary pointer-events-none" />
            <div className="absolute top-0 right-6 w-4 h-4 border-t-2 border-r-2 border-primary pointer-events-none" />

            {/* Top Telemetry Strip */}
            <div className="border-b border-primary/20 bg-black/40 backdrop-blur-md relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                            <span className="text-white font-bold tracking-wider">// SYSTEM_ONLINE</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 text-primary/70">
                            <Activity className="w-3 h-3 text-primary" />
                            <span>LATENCY: 14MS</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1.5 text-primary/70">
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            <span>PROTOCOL: TLS_1.3 // ENCRYPTED</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 text-primary/70">
                            <Cpu className="w-3 h-3 text-primary" />
                            <span>CORE: NEURAL_ENGINE_V2</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-[9px] text-primary font-bold">
                            // AP_SOUTHEAST_NODE
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-primary/20">
                    {/* Col 1: Logo & Brand Information */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            {footer.logo ? (
                                <AppImage
                                    documentId={footer.logo?.documentId}
                                    url={footer.logo?.url}
                                    alternativeText={footer.logo?.alternativeText || "logo"}
                                    className="object-contain"
                                    width={150}
                                    height={42}
                                />
                            ) : (
                                <div className="text-xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-primary" />
                                    <span>DEV_HUB <span className="text-primary">// SYS</span></span>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed uppercase tracking-wide">
                            Futuristic developer knowledge station, daily planner matrix, and multimedia command center built for peak workflow execution.
                        </p>

                        <div className="space-y-2.5 text-xs text-slate-300">
                            {footer.email && (
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                                        <Mail className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-slate-200">{footer.email}</span>
                                </div>
                            )}
                            {footer.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                                        <Phone className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-slate-200">{footer.phone}</span>
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
                                        className="w-8 h-8 cyber-clip-button bg-primary/10 border border-primary/40 flex items-center justify-center text-primary hover:text-black hover:bg-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
                                    >
                                        {getSocialIcon()}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Col 2: Navigation Sections */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                            <Terminal className="w-3.5 h-3.5 text-primary" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">// NAVIGATION</h4>
                        </div>
                        <div className="flex flex-col space-y-2 text-xs">
                            {footer.footer_sections.map((section: { label: string; url: string }, idx: number) => (
                                <Link
                                    key={idx}
                                    href={section.url}
                                    className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-2 group py-0.5"
                                >
                                    <span className="text-primary text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                    <span>{section.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 3: Core Modules Direct Launch */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">// MODULES</h4>
                        </div>
                        <div className="flex flex-col space-y-2 text-xs">
                            <Link href="/planner/today" className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-2 group py-0.5">
                                <span className="text-primary text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                <span>Daily Planner</span>
                            </Link>
                            <Link href="/working" className="text-slate-300 hover:text-pink-300 transition-colors flex items-center gap-2 group py-0.5">
                                <span className="text-pink-400 text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                <span>Working Hub</span>
                            </Link>
                            <Link href="/media/youtube" className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-2 group py-0.5">
                                <span className="text-primary text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                <span>YouTube Center</span>
                            </Link>
                            <Link href="/media/music" className="text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-2 group py-0.5">
                                <span className="text-emerald-400 text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                <span>Spotify Deck</span>
                            </Link>
                            <Link href="/mh-wilds" className="text-slate-300 hover:text-red-300 transition-colors flex items-center gap-2 group py-0.5">
                                <span className="text-red-400 text-[10px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">▶</span>
                                <span>MH Wilds Vault</span>
                            </Link>
                        </div>
                    </div>

                    {/* Col 4: Node Stations / Locations */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white">// LOCATIONS</h4>
                        </div>
                        <div className="space-y-3">
                            {footer.addresses.map((address: { id: string | number; title: string; content: string }) => (
                                <div key={address.id} className="p-3.5 cyber-clip bg-[#050714]/90 border border-primary/30 space-y-1 relative group hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase">
                                        <span className="w-1.5 h-1.5 bg-primary" />
                                        <span>{address.title}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed pl-3.5">// {address.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="tracking-wider text-slate-300">{footer.copyright}</p>
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-[10px] text-primary font-bold">
                            // BUILD_V2.5.0-CYBER
                        </span>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {footer.policy_links && footer.policy_links.length > 0 && (
                            <div className="flex items-center gap-4">
                                {footer.policy_links.map((link: { label: string; url: string }, idx: number) => (
                                    <Link key={idx} href={link.url} className="text-slate-400 hover:text-primary transition-colors uppercase tracking-wider text-[11px]">
                                        [ {link.label} ]
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Back to top button */}
                        <button
                            onClick={scrollToTop}
                            className="px-3 py-1 bg-primary/10 hover:bg-primary border border-primary/40 text-primary hover:text-black transition-all cyber-clip-button text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
                            title="Back to top"
                        >
                            <ArrowUp className="w-3 h-3" />
                            <span>TOP</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
