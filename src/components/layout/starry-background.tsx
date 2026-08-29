"use client";

import React from "react";

type Star = {
    id: number;
    top: string;
    left: string;
    size: string;
    opacity: number;
    duration: string;
    delay: string;
};

type Meteor = {
    id: string;
    top: string;
    left: string;
    duration: string;
    delay: string;
};

export function StarryBackground() {
    const [stars, setStars] = React.useState<Array<Star | Meteor>>([]);

    React.useEffect(() => {
        const newStars: Star[] = [...Array(40)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 0.5}px`,
            opacity: Math.random() * 0.5 + 0.1,
            duration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 5}s`,
        }));
        const newMeteors: Meteor[] = [...Array(3)].map((_, i) => ({
            id: `meteor-${i}`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 10 + 10}s`,
            delay: `${Math.random() * 20}s`,
        }));
        setStars([...newStars, ...newMeteors]);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className={star.id.toString().startsWith('meteor') ? "meteor-star" : "absolute bg-white rounded-full star-twinkle"}
                    style={{
                        top: star.top,
                        left: star.left,
                        width: (star as Star).size,
                        height: (star as Star).size,
                        opacity: (star as Star).opacity,
                        // @ts-expect-error: Custom CSS variables for twinkling animation
                        '--twinkle-duration': (star as Star).duration,
                        '--twinkle-delay': (star as Star).delay,
                        '--meteor-duration': (star as Meteor).duration,
                        '--meteor-delay': (star as Meteor).delay,
                    }}
                />
            ))}
        </div>
    );
}

