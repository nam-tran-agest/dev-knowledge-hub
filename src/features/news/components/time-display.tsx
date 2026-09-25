"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

export function TimeDisplay({ isoDate, className }: { isoDate?: string; className?: string }) {
    const [formattedTime, setFormattedTime] = useState<string>("");

    useEffect(() => {
        if (!isoDate) return;

        const date = parseISO(isoDate);
        if (!isValid(date)) {
            setFormattedTime("");
            return;
        }

        const updateFormattedTime = () => {
            setFormattedTime(formatDistanceToNow(date, { addSuffix: true }));
        };

        updateFormattedTime();
        const interval = setInterval(updateFormattedTime, 60000);

        return () => clearInterval(interval);
    }, [isoDate]);

    if (!isoDate) return null;

    const date = parseISO(isoDate);
    if (!isValid(date)) return null;

    return (
        <span className={className} title={date.toLocaleString('en-US')}>
            {formattedTime || "..."}
        </span>
    );
}
