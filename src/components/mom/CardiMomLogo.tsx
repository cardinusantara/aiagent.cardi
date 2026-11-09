"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "mark" | "badge" | "card";
  colorMode?: "light" | "dark" | "auto";
  showTagline?: boolean;
}

/**
 * Official Cardi Agent MoM Logo Lockup
 * Uses official 23.png horizontal brand lockup (cardi agent | mom) without duplicate text.
 * Guaranteed crisp at every resolution with 100% theme fidelity.
 */
export function CardiMomLogo({
  className = "",
  size = "md",
  variant = "horizontal",
  colorMode = "auto",
  showTagline = false,
}: LogoProps) {
  const heightPx = size === "sm" ? 28 : size === "md" ? 34 : size === "lg" ? 42 : 50;

  if (variant === "mark") {
    return (
      <div className={`relative inline-block select-none shrink-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/mom/icon-mom-app.png"
          alt="Cardi MoM App Icon"
          style={{ width: `${heightPx}px`, height: `${heightPx}px` }}
          className="rounded-xl object-contain shadow-xs shrink-0"
        />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`relative inline-block select-none shrink-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/mom/logo-mom-card.png"
          alt="Cardi Agent MoM"
          style={{ height: `${heightPx}px` }}
          className="w-auto object-contain shrink-0"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* Official 23.png Lockup - No duplicate HTML text */}
      {colorMode === "light" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logos/mom/logo-mom-light.png"
          alt="Cardi Agent MoM"
          style={{ height: `${heightPx}px` }}
          className="w-auto object-contain shrink-0"
        />
      )}

      {colorMode === "dark" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logos/mom/logo-mom-dark.png"
          alt="Cardi Agent MoM"
          style={{ height: `${heightPx}px` }}
          className="w-auto object-contain shrink-0"
        />
      )}

      {colorMode === "auto" && (
        <>
          {/* Light Theme */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/mom/logo-mom-light.png"
            alt="Cardi Agent MoM"
            style={{ height: `${heightPx}px` }}
            className="w-auto object-contain shrink-0 dark:hidden"
          />
          {/* Dark Theme */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/mom/logo-mom-dark.png"
            alt="Cardi Agent MoM"
            style={{ height: `${heightPx}px` }}
            className="w-auto object-contain shrink-0 hidden dark:inline-block"
          />
        </>
      )}

      {showTagline && (
        <span className="hidden 2xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF4FF] dark:bg-sky-500/15 border border-[#1E4FFF]/20 dark:border-sky-500/30 text-[10px] font-bold tracking-wider uppercase text-[#0258A4] dark:text-[#38BDF8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C2D1] animate-pulse" />
          <span>Smart NFC</span>
        </span>
      )}
    </div>
  );
}

/**
 * Backward compatibility alias for the app squircle mark
 */
export function CardiMomIcon({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={`inline-block select-none shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/mom/icon-mom-app.png"
        alt="Cardi MoM"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-xl object-contain shadow-xs"
      />
    </div>
  );
}

export default CardiMomLogo;
