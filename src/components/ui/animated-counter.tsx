"use client";
import { useEffect, useRef } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    animate,
    useInView,
} from "motion/react";

type AnimatedCounterProps = {
    from?: number;
    to: number;
    className?: string;
};

export default function AnimatedCounter({
    to,
    from = 0,
    className,
}: AnimatedCounterProps) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) =>
        Math.round(latest).toLocaleString("en-US")
    );
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });

    useEffect(() => {
        if (isInView) {
            const animation = animate(count, to, { duration: 1 });
            return animation.stop;
        }
    }, [count, to, isInView]);

    return (
        <motion.span ref={ref} className={className}>
            {rounded}
        </motion.span>
    );
}
