"use client";

import { Service } from "@/features/landing/types/section/service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import TabButton from "@/components/ui/tab-button";
import { useScrollToCenter } from "@/hooks/useScrollToCenter";
import { cn } from "@/lib/utils";
import { iconsMap } from "@/components/common/icon";

type FilterTabsProps = {
    categories: Service[];
    selected?: string;
    /** ID to sync loading state and scroll target */
    syncId?: string;
};

export default function CategoryTab({
    categories,
    selected = "all",
    syncId,
}: FilterTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState(selected);
    const { containerRef, scrollToCenter, setItemRef } = useScrollToCenter<HTMLButtonElement>();

    // Sync local state with prop when it changes (e.g. back/forward navigation)
    useEffect(() => {
        setActiveTab(selected);
    }, [selected]);

    // Dispatch loading event when isPending changes
    if (typeof window !== 'undefined' && syncId) {
        const event = new CustomEvent(`loading-sync-${syncId}`, {
            detail: { isLoading: isPending }
        });
        window.dispatchEvent(event);
    }

    const handleClick = (value: string, buttonIndex: number) => {
        // Optimistic UI update - Instant feedback
        setActiveTab(value);
        scrollToCenter(buttonIndex);

        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete("category");
        } else {
            params.set("category", value);
        }
        params.set("page", "1");

        startTransition(() => {
            router.push(`?${params.toString()}`, { scroll: false });

            // Only scroll to section if we are not already at it or if it's out of view
            if (syncId) {
                const element = document.getElementById(syncId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isFullyInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

                    if (!isFullyInView) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }
            }
        });
    };

    return (
        <div className="flex justify-center w-full px-4">
            <div
                ref={containerRef}
                className={cn(
                    "flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 py-4 px-1 scrollbar-none",
                    "md:justify-center md:overflow-visible w-fit max-w-full md:gap-6 transition-all duration-300",
                    isPending ? "pointer-events-none cursor-wait" : ""
                )}
            >
                <TabButton
                    key="all"
                    ref={setItemRef(0)}
                    onClick={() => handleClick("all", 0)}
                    isActive={activeTab === "all"}
                >
                    All
                </TabButton>
                {categories.map((category, idx) => (
                    <TabButton
                        key={category.id}
                        ref={setItemRef(idx + 1)}
                        onClick={() => handleClick(category.slug, idx + 1)}
                        isActive={activeTab === category.slug || (category.slug === "all" && !activeTab)}
                        icon={category.icon ? iconsMap[category.icon] : undefined}
                    >
                        {category.title}
                    </TabButton>
                ))}
            </div>
        </div>
    );
}
