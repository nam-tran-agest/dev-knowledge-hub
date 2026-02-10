"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronUp } from "lucide-react";
// If you use shadcn's Button, use that. Otherwise fallback to a simple button

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    // show button after user scrolled this many px
    const SHOW_AFTER = 300;

    // detect reduced motion preference
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = useCallback(() => {
        // use small threshold to avoid jitter
        setVisible(window.scrollY > SHOW_AFTER);
    }, []);

    useEffect(() => {
        // Use requestAnimationFrame for smooth/performant updates
        let rafId: number | null = null;
        const handler = () => {
            if (rafId === null) {
                rafId = window.requestAnimationFrame(() => {
                    onScroll();
                    rafId = null;
                });
            }
        };

        window.addEventListener("scroll", handler, { passive: true });
        // initial check
        onScroll();

        return () => {
            window.removeEventListener("scroll", handler);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [onScroll]);

    function scrollToTop() {
        // respect reduced motion
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
            return;
        }

        // smooth scroll, fallback for older browsers
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <div
            aria-hidden={!visible}
            className={`fixed right-5 bottom-6 z-50 transition-opacity duration-300 ease-in-out ${visible
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
                }`}
        >
            <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="group cursor-pointer rounded-full p-3 shadow-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
            >
                <ChevronUp
                    strokeWidth={4}
                    className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ stroke: 'url(#scroll-gradient)' }}
                />
                {/* SVG Gradient Definition */}
                <svg width="0" height="0" className="absolute pointer-events-none">
                    <defs>
                        <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2dd4bf" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#312e81" />
                        </linearGradient>
                    </defs>
                </svg>
            </button>
        </div>
    );
}
