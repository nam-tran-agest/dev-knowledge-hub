'use client';

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
    type Container,
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

    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
    };

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
            fpsLimit: 120,
            interactivity: {
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
                        quantity: 8,
                    },
                    grab: {
                        distance: 180,
                        links: {
                            opacity: 0.5
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
                    distance: 150,
                    enable: true,
                    opacity: 0.8,
                    width: 2, // Thicker links
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 80, // Slightly fewer particles if they are bigger
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
