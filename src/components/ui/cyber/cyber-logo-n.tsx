'use client';

import React from 'react';

interface CyberLogoNProps {
    className?: string;
}

export function CyberLogoN({ className = "w-6 h-6" }: CyberLogoNProps) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="cyberN_primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#0080ff" />
                </linearGradient>

                <linearGradient id="cyberN_diag" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>

                <linearGradient id="cyberN_accent" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>

                <filter id="cyberN_glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Background Tactical Circuit Lines */}
            <path
                d="M4 14 L12 6 M36 26 L28 34"
                stroke="#00f0ff"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                strokeLinecap="round"
            />

            {/* Left Pillar of 'N' - Chamfered Top, Clean Bevel */}
            <path
                d="M7 13 L13 7 L15.5 7 L15.5 33 L9.5 33 L9.5 15.5 Z"
                fill="url(#cyberN_primary)"
                filter="url(#cyberN_glow)"
            />

            {/* Dynamic Center Diagonal Slash of 'N' */}
            <path
                d="M13.5 8 L18.5 7 L30.5 31 L25.5 32 Z"
                fill="url(#cyberN_diag)"
                filter="url(#cyberN_glow)"
            />

            {/* Right Pillar of 'N' - Chamfered Bottom, High-Tech Tip */}
            <path
                d="M24.5 7 L30.5 7 L30.5 27 L24.5 33 L24.5 9.5 Z"
                fill="url(#cyberN_primary)"
                filter="url(#cyberN_glow)"
            />

            {/* Futuristic Tech Slit / Cutout Line */}
            <path
                d="M17 19 L23 19"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.9"
            />

            {/* Glowing Corner Terminals */}
            <circle cx="7" cy="7" r="1.2" fill="#00f0ff" />
            <circle cx="33" cy="33" r="1.2" fill="#38bdf8" />
        </svg>
    );
}
