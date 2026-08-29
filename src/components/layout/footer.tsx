"use client";

import React from "react";
import { FooterData } from "@/types/layout";
import { Mail, MapPin, Phone, Twitter, Facebook, Github, Youtube, Instagram, Linkedin, Globe } from "lucide-react";
import AppImage from "@/components/common/media/AppImage";
import { Link } from '@/i18n/routing';

type Star = {
    id: number;
    top: string;
    left: string;
    size: string;
    opacity: number;
    duration: string;
    delay: string;
};

type Meteor = {
    id: string;
    top: string;
    left: string;
    duration: string;
    delay: string;
};

const StarryBackground = () => {
    const [stars, setStars] = React.useState<Array<Star | Meteor>>([]);

    React.useEffect(() => {
        const newStars: Star[] = [...Array(40)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 0.5}px`,
            opacity: Math.random() * 0.5 + 0.1,
            duration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 5}s`,
        }));
        const newMeteors: Meteor[] = [...Array(3)].map((_, i) => ({
            id: `meteor-${i}`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 10 + 10}s`,
            delay: `${Math.random() * 20}s`,
        }));
        setStars([...newStars, ...newMeteors]);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={star.id.toString().startsWith('meteor') ? "meteor-star" : "absolute bg-white rounded-full star-twinkle"}
                    style={{
                        top: star.top,
                        left: star.left,
                        width: (star as Star).size,
                        height: (star as Star).size,
                        opacity: (star as Star).opacity,
                        // @ts-expect-error: Custom CSS variables for twinkling animation
                        '--twinkle-duration': (star as Star).duration,
                        '--twinkle-delay': (star as Star).delay,
                        '--meteor-duration': (star as Meteor).duration,
                        '--meteor-delay': (star as Meteor).delay,
                    }}
                />
            ))}
        </div>
    );
};

export default function Footer({ footer }: { footer: FooterData }) {
    return (
        <footer className="relative bg-[#05070c] border-t border-white/10 overflow-hidden text-slate-300">
            <StarryBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
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
                                <div className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                                    Somewhere I Belong
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            Personal productivity, developer knowledge curation and gaming vault designed for effortless workflow.
                        </p>

                        <div className="space-y-3 text-sm text-slate-400">
                            {footer.email && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-indigo-400">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span>{footer.email}</span>
                                </div>
                            )}
                            {footer.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-indigo-400">
                                        <Phone className="h-4 w-4" />
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
                                    if (l.includes('twitter') || l.includes('x')) return <Twitter className="w-4 h-4" />;
                                    if (l.includes('facebook')) return <Facebook className="w-4 h-4" />;
                                    if (l.includes('github')) return <Github className="w-4 h-4" />;
                                    if (l.includes('youtube')) return <Youtube className="w-4 h-4" />;
                                    if (l.includes('instagram')) return <Instagram className="w-4 h-4" />;
                                    if (l.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
                                    return <Globe className="w-4 h-4" />;
                                };

                                return (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                        className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:scale-105 transition-all"
                                    >
                                        {getSocialIcon()}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navigation</h4>
                        <div className="flex flex-col space-y-3 text-sm">
                            {footer.footer_sections.map((section: { label: string; url: string }, idx: number) => (
                                <Link
                                    key={idx}
                                    href={section.url}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    {section.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Addresses / Locations */}
                    <div className="lg:col-span-4 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Locations</h4>
                        <div className="space-y-4">
                            {footer.addresses.map((address: { id: string | number; title: string; content: string }) => (
                                <div key={address.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                    <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold">
                                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>{address.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed pl-5">{address.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>{footer.copyright}</p>
                    {footer.policy_links && footer.policy_links.length > 0 && (
                        <div className="flex items-center gap-6">
                            {footer.policy_links.map((link: { label: string; url: string }, idx: number) => (
                                <Link key={idx} href={link.url} className="hover:text-slate-300 transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
