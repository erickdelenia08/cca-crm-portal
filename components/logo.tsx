import React from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function CCALogo({ className = "h-8", showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG Icon CCA (3 overlapping gradient lobes) */}
            <svg
                viewBox="0 0 100 100"
                className="h-full w-auto aspect-square shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0052D4" />
                        <stop offset="100%" stopColor="#4364F7" />
                    </linearGradient>
                    <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00C9FF" />
                        <stop offset="100%" stopColor="#92FE9D" />
                    </linearGradient>
                    <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF4E50" />
                        <stop offset="100%" stopColor="#F9D423" />
                    </linearGradient>
                </defs>

                {/* Top Blue Lobe */}
                <path
                    d="M 50 12 C 65 12, 78 26, 70 42 C 62 58, 40 50, 36 34 C 32 18, 38 12, 50 12 Z"
                    fill="url(#grad-blue)"
                    style={{ mixBlendMode: "multiply", opacity: 0.9 }}
                />
                {/* Bottom Right Teal Lobe */}
                <path
                    d="M 72 48 C 84 58, 78 78, 62 80 C 46 82, 44 60, 56 48 C 68 36, 62 40, 72 48 Z"
                    fill="url(#grad-teal)"
                    style={{ mixBlendMode: "multiply", opacity: 0.9 }}
                />
                {/* Bottom Left Orange Lobe */}
                <path
                    d="M 28 48 C 40 40, 34 36, 46 48 C 58 60, 56 82, 40 80 C 24 78, 18 58, 28 48 Z"
                    fill="url(#grad-orange)"
                    style={{ mixBlendMode: "multiply", opacity: 0.9 }}
                />
            </svg>

            {/* Typography "CCA CONSULTING" */}
            {showText && (
                <div className="flex flex-col justify-center select-none">
                    <span className="font-extrabold text-2xl tracking-tighter leading-none text-[#0B4EA2]">
                        CCA
                    </span>
                    <span className="text-[9px] font-bold tracking-[0.32em] text-[#0B4EA2] leading-tight mt-0.5 uppercase">
                        Consulting
                    </span>
                </div>
            )}
        </div>
    );
}