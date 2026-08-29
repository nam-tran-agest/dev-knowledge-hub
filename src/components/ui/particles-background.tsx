'use client';

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
    type ISourceOptions,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface ParticlesBackgroundProps {
    id?: string;
    className?: string;
}

export function ParticlesBackground({
    id = "tsparticles",
    className,
}: ParticlesBackgroundProps) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (): Promise<void> => {};

    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: {
                enable: false,
                zIndex: 0
            },
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 60,
            interactivity: {
                detectsOn: "canvas",
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    grab: {
                        distance: 140,
                        links: {
                            opacity: 0.4
                        }
                    },
                },
            },
            particles: {
                color: {
                    value: "#3b82f6",
                },
                links: {
                    color: "#3b82f6",
                    distance: 140,
                    enable: true,
                    opacity: 0.6,
                    width: 1.5,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 0.8,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 1000,
                    },
                    value: 45,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 2, max: 3 }, // Smaller particles
                },
            },
            detectRetina: true,
        }),
        [],
    );

    if (!init) {
        return <></>;
    }

    return (
        <div className={className}>
            <Particles
                id={id}
                particlesLoaded={particlesLoaded}
                options={options}
                className="h-full w-full"
            />
        </div>
    );
}
