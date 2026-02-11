"use client";

import React from 'react';

export const Logo = ({ className = "w-8 h-8", logoColor = "#DE7461", cutoutColor = "#1C344C" }: { className?: string, logoColor?: string, cutoutColor?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <mask id="slash-mask">
                <rect width="100" height="100" fill="white" />
                <path d="M-20 100 L100 -20 L110 -10 L-10 110 Z" fill="black" />
            </mask>
        </defs>

        <g mask="url(#slash-mask)">
            {/* The main 'B' block structure */}
            <path
                d="M20 15 H65 C78 15 85 25 85 35 V43 L75 50 L85 57 V75 C85 85 78 85 65 85 H20 V15Z"
                fill={logoColor}
            />

            {/* Precision blocky cuts for the inner part of B */}
            <rect x="38" y="27" width="22" height="14" fill={cutoutColor} />
            <rect x="38" y="59" width="22" height="14" fill={cutoutColor} />
        </g>
    </svg>
);
