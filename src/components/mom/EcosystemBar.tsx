"use client";

import React from "react";
import { Link } from "@/lib/mom/nav";
import { useAppStore } from "@/lib/mom/store";
import { ExternalLink, Sparkles } from "lucide-react";

export default function EcosystemBar() {
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <div
      className={`w-full text-[11px] font-medium border-b transition-colors select-none ${
        isDark
          ? "bg-[#050B1B] border-white/10 text-slate-400"
          : "bg-[#0A1633] border-slate-800 text-slate-300"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 font-mono">
        {/* Left: Ecosystem Label */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C2D1] animate-pulse" />
          <span className="text-[11px] text-slate-400 font-medium">Bagian dari ekosistem Cardi</span>
        </div>

        {/* Right: Ecosystem Brand Links */}
        <nav className="flex items-center gap-2.5 text-[11.5px]" aria-label="Ekosistem Cardi">
          <a
            href="https://cardi.co.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition"
          >
            Cardi
          </a>
          <span className="text-white/20">·</span>
          <a
            href="https://cardinusantara.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition"
          >
            Cardi Nusantara
          </a>
          <span className="text-white/20">·</span>
          <a
            href="/"
            className="text-[#38bdf8] font-bold hover:text-white transition"
            aria-current="page"
          >
            Cardi Agent
          </a>
          <span className="text-white/20">·</span>
          <a
            href="https://cardi.co.id/toko/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition"
          >
            Toko Cardi
          </a>
        </nav>
      </div>
    </div>
  );
}

