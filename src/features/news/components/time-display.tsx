"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useParams } from "next/navigation";

export function TimeDisplay({ isoDate, className }: { isoDate?: string; className?: string }) {
    const params = useParams();
    const localeString = params?.locale as string || "en";
    const [formattedTime, setFormattedTime] = useState<string>("");

    useEffect(() => {
        if (!isoDate) return;

        try {
            const date = parseISO(isoDate);
            const locale = localeString === "vi" ? vi : enUS;

            // Initial relative time
            setFormattedTime(formatDistanceToNow(date, { addSuffix: true, locale }));

            // Update every minute for relative accuracy
            const interval = setInterval(() => {
                setFormattedTime(formatDistanceToNow(date, { addSuffix: true, locale }));
            }, 60000);

            return () => clearInterval(interval);
        } catch (e) {
            console.error("Error formatting date:", e);
        }
    }, [isoDate, localeString]);

    if (!isoDate) return null;

    return (
        <span className={className} title={new Date(isoDate).toLocaleString(localeString === 'vi' ? 'vi-VN' : 'en-US')}>
            {formattedTime || "..."}
        </span>
    );
}
