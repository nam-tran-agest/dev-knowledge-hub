'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { CyberLogoN } from '@/components/ui/cyber/cyber-logo-n';

const GLYPHS = "0101_!#%*<>[]X#NEO";

export function BrandLogo() {
    const [text, setText] = useState("DEV_HUB");
    const [isHovered, setIsHovered] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    // Sherpa-style Scramble / decode effect on hover
    const triggerScramble = () => {
        setIsHovered(true);
        setGlitchActive(true);
        const original = "DEV_HUB";
        let iteration = 0;
        const interval = setInterval(() => {
            setText(
                original
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return original[index];
                        }
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    })
                    .join("")
            );

            if (iteration >= original.length) {
                clearInterval(interval);
                setText(original);
                setTimeout(() => setGlitchActive(false), 200);
            }

            iteration += 1 / 3;
        }, 30);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setText("DEV_HUB");
        setGlitchActive(false);
    };

    // Periodic slow subtle Sherpa-style tech pulse (every 5.5s, only when tab is visible)
    useEffect(() => {
        const timer = setInterval(() => {
            if (typeof document !== 'undefined' && document.hidden) return;
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 280);
        }, 5500);
        return () => clearInterval(timer);
    }, []);

    return (
        <Link
            href="/"
            className="flex items-center gap-3.5 group select-none relative"
            onMouseEnter={triggerScramble}
            onMouseLeave={handleMouseLeave}
        >
            {/* Holographic Logo Badge */}
            <div className="relative">
                {/* Outer Glow Halo */}
                <div
                    className={`absolute -inset-1.5 cyber-clip bg-primary/25 blur-md transition-all duration-300 pointer-events-none ${
                        isHovered || glitchActive ? 'opacity-100 scale-105 bg-primary/50' : 'opacity-60 animate-cyber-pulse-slow'
                    }`}
                />

                {/* Glitch Shadow Clone 1 (Cyan RGB Shift) */}
                <div
                    className={`absolute inset-0 p-1.5 cyber-clip border border-cyan-400 bg-cyan-500/20 pointer-events-none transition-transform duration-75 ${
                        glitchActive ? 'translate-x-0.5 -translate-y-0.5 opacity-80' : 'opacity-0'
                    }`}
                >
                    <CyberLogoN className="w-6 h-6 text-cyan-400" />
                </div>

                {/* Glitch Shadow Clone 2 (White Shift) */}
                <div
                    className={`absolute inset-0 p-1.5 cyber-clip border border-white bg-white/10 pointer-events-none transition-transform duration-75 ${
                        glitchActive ? '-translate-x-0.5 translate-y-0.5 opacity-70' : 'opacity-0'
                    }`}
                >
                    <CyberLogoN className="w-6 h-6 text-white" />
                </div>

                {/* Core Badge Container */}
                <div
                    className={`relative p-1.5 cyber-clip bg-[#060814]/95 border transition-all duration-300 overflow-hidden ${
                        isHovered
                            ? 'border-primary shadow-[0_0_20px_rgba(0,240,255,0.7)] scale-105'
                            : 'border-primary/50'
                    }`}
                >
                    <CyberLogoN className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />

                    {/* Cyber Scanline Laser Sweeper */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent pointer-events-none transition-opacity ${
                            isHovered || glitchActive ? 'opacity-100 animate-cyber-scan' : 'opacity-0'
                        }`}
                        style={{ height: '200%' }}
                    />
                </div>
            </div>

            {/* Brand Typography & Live Telemetry */}
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-mono font-bold text-sm tracking-widest text-white uppercase relative">
                    {/* Main Text */}
                    <span className="group-hover:text-primary transition-colors duration-200">
                        {text}
                    </span>
                    <span className="text-primary text-xs font-bold animate-pulse">// SYS</span>

                    {/* Glitch RGB ghost on scramble */}
                    {glitchActive && (
                        <span className="absolute top-0 left-0 text-cyan-400 opacity-60 translate-x-[1px] -translate-y-[1px] pointer-events-none">
                            {text}
                        </span>
                    )}
                </div>

                {/* Live Status Telemetry */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-primary/80 tracking-wider">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full bg-primary ${isHovered ? 'animate-ping' : 'animate-cyber-dot'}`} />
                    <span className="transition-colors group-hover:text-cyan-300">
                        {isHovered ? 'PORT: 8080 // LINKED' : 'TERMINAL_ONLINE'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
