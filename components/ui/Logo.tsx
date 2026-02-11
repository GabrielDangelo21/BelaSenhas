"use client";

import React from 'react';

export const Logo = ({ className = "w-8 h-8", textColor = "#1C344C" }: { className?: string, textColor?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 15H75L65 45L75 85H25L35 50L25 15Z" fill="currentColor" />
        <path d="M40 35H60L55 45L45 55H40V35Z" fill={textColor} />
        <path d="M40 60H55L50 75H40V60Z" fill={textColor} />
    </svg>
);
