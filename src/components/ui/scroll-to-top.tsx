"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const SHOW_AFTER = 300;

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = useCallback(() => {
        setVisible(window.scrollY > SHOW_AFTER);
    }, []);

    useEffect(() => {
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
        onScroll();

        return () => {
            window.removeEventListener("scroll", handler);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [onScroll]);

    function scrollToTop() {
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <div
            aria-hidden={!visible}
            className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ease-in-out ${visible
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-4 pointer-events-none"
                }`}
        >
            <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="group cursor-pointer cyber-clip-button p-3 shadow-[0_0_20px_rgba(0,240,255,0.3)] bg-[#04060f]/90 backdrop-blur-xl border border-primary/50 hover:bg-primary/20 hover:border-primary transition-all duration-300 active:scale-95 flex items-center justify-center relative"
            >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 bg-background text-[8px] font-mono text-primary/70 uppercase">
                    TOP
                </span>
                <ChevronUp
                    className="w-5 h-5 text-primary transition-transform duration-300 group-hover:-translate-y-1"
                />
            </button>
        </div>
    );
}
