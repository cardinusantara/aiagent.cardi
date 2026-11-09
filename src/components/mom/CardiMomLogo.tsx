"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "mark" | "badge" | "wordmark";
  colorMode?: "light" | "dark" | "auto";
  showTagline?: boolean;
}

/**
 * Official Cardi Agent MoM Logo Lockup
 * Combines the official high-res app icon with crisp brand typography (Plus Jakarta Sans).
 * Guaranteed crisp at every resolution with 100% theme fidelity.
 */
export function CardiMomLogo({
  className = "",
  size = "md",
  variant = "horizontal",
  colorMode = "auto",
  showTagline = true,
}: LogoProps) {
  const iconSize = size === "sm" ? 28 : size === "md" ? 34 : size === "lg" ? 42 : 50;
  const textSize = size === "sm" ? "text-[15px]" : size === "md" ? "text-[17px]" : size === "lg" ? "text-xl" : "text-2xl";

  if (variant === "mark") {
    return (
      <div className={`relative inline-block select-none ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/mom/icon-mom-app.png"
          alt="Cardi MoM Icon"
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          className="rounded-xl object-contain shadow-xs shrink-0"
        />
      </div>
    );
  }

  const textColor =
    colorMode === "dark"
      ? "text-white"
      : colorMode === "light"
      ? "text-[#0A1633]"
      : "text-[#0A1633] dark:text-white";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official App Mark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/mom/icon-mom-app.png"
        alt="Cardi MoM"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        className="rounded-xl object-contain shadow-xs shrink-0"
      />

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-black tracking-tight ${textSize} ${textColor}`}>
          Cardi <span className="font-extrabold text-[#0258A4] dark:text-[#38BDF8]">Agent</span>
        </span>
        <span className="text-slate-300 dark:text-white/20 font-light mx-0.5">|</span>
        <span className={`font-black tracking-tight ${textSize} text-[#0088CC] dark:text-[#38BDF8]`}>
          MoM
        </span>
      </div>

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
 * Backward compatibility alias for the mark
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
    <div className={`inline-block select-none ${className}`}>
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
