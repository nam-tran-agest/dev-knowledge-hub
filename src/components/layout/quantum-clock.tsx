'use client'

import React, { useState, useEffect } from 'react'
import { Radio, Sparkles } from 'lucide-react'

export function QuantumClock() {
    const [time, setTime] = useState<Date | null>(null)
    const [timeZone, setTimeZone] = useState<string>('')
    const [utcOffset, setUtcOffset] = useState<string>('')

    useEffect(() => {
        // Set initial local time
        setTime(new Date())

        try {
            // Detect client local timezone
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local'
            setTimeZone(tz.split('/').pop()?.replace(/_/g, ' ') || tz)

            // Compute UTC offset string (e.g. UTC+07)
            const offsetMinutes = -new Date().getTimezoneOffset()
            const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60)
            const sign = offsetMinutes >= 0 ? '+' : '-'
            setUtcOffset(`UTC${sign}${offsetHours}`)
        } catch {
            setUtcOffset('LOCAL')
        }

        // Ticking timer every second
        const intervalId = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    if (!time) {
        return (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#030614]/80 border border-primary/20 cyber-clip-button font-mono text-xs opacity-60">
                <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                <span className="text-primary/40 tracking-widest">QUANTUM_SYNC...</span>
            </div>
        )
    }

    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    const seconds = String(time.getSeconds()).padStart(2, '0')

    return (
        <div 
            className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-[#030614]/90 hover:bg-[#030614] border border-primary/30 hover:border-primary/60 cyber-clip-button transition-all shadow-[0_0_15px_rgba(0,240,255,0.08)] group cursor-default select-none relative"
            title={`Local Chronometer: ${time.toLocaleDateString()} (${timeZone})`}
        >
            {/* Top Micro Tech Tag */}
            <div className="absolute -top-1.5 left-2 px-1 bg-[#04060f] border-x border-primary/30 text-[7px] font-mono uppercase tracking-widest text-primary/70 pointer-events-none">
                // QUANTUM_CHRONO
            </div>

            {/* Atomic Pulse Indicator */}
            <div className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <Radio className="w-3 h-3 text-primary/70 animate-pulse" />
            </div>

            {/* Digital Clock Readout */}
            <div className="flex items-baseline gap-0.5 font-mono text-xs font-bold text-white tracking-wider">
                <span className="text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">{hours}</span>
                <span className="text-primary animate-pulse font-normal">:</span>
                <span className="text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">{minutes}</span>
                <span className="text-primary animate-pulse font-normal">:</span>
                <span className="text-primary font-mono text-[11px]">{seconds}</span>
            </div>

            {/* Timezone Pill */}
            <div className="flex items-center gap-1 pl-1.5 border-l border-primary/20 text-[9px] font-mono text-primary/80">
                <span className="bg-primary/10 px-1 py-0.2 text-primary font-semibold cyber-clip-button border border-primary/30">
                    {utcOffset}
                </span>
                <span className="hidden 2xl:inline uppercase tracking-tight text-primary/60 max-w-[80px] truncate">
                    {timeZone}
                </span>
            </div>

            {/* Micro Sparkle Accent */}
            <Sparkles className="w-2.5 h-2.5 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
    )
}
