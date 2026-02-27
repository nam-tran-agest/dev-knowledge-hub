'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
    /** Speed of the matrix rain in milliseconds per frame. Lower is faster. Default: 33 (~30fps) */
    speed?: number;
}

export const MatrixRain = ({ speed = 50 }: MatrixRainProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas to full window size - use ResizeObserver for more robust sizing
        // but window listeners are fine for a fixed background
        const setCanvasSize = () => {
            // Use parent size or window size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        // Characters to use (Katakana + Latin + Numerals for that classic look)
        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const chars = katakana + latin + nums;

        const fontSize = 16;
        let columns = canvas.width / fontSize;
        let drops: number[] = [];

        // Initialize drops
        for (let x = 0; x < columns; x++) {
            // Start at random negative positions so they don't all fall at once initially
            drops[x] = Math.random() * -100;
        }

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = 'rgba(10, 10, 12, 0.1)'; // Match working page bg a bit #0a0a0c
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0'; // Classic Matrix green
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                // Ignore drops that haven't entered the screen yet
                if (drops[i] < 0) {
                    drops[i]++;
                    continue;
                }

                const text = chars[Math.floor(Math.random() * chars.length)];

                // Add a glow effect sometimes or make the lead character brighter
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#fff'; // White lead
                } else {
                    ctx.fillStyle = '#0f0';
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, speed); // Control speed with prop

        const handleResize = () => {
            setCanvasSize();
            columns = canvas.width / fontSize;
            const newDrops = [];
            for (let x = 0; x < columns; x++) {
                newDrops[x] = drops[x] || Math.random() * -100;
            }
            drops = newDrops;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [speed]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 opacity-40 pointer-events-none"
            aria-hidden="true"
        />
    );
};
