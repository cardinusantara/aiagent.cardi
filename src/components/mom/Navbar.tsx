"use client";

import React, { useState } from "react";
import { Link, usePathname, useRouter } from "@/lib/mom/nav";
import {
  CreditCard,
  Mic,
  Calendar,
  Coins,
  Radio,
  LogOut,
  LogIn,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { getTranslation } from "@/lib/mom/i18n";
import { CardiMomLogo } from "@/components/mom/CardiMomLogo";
import EcosystemBar from "@/components/mom/EcosystemBar";

interface NavbarProps {
  onOpenPairingModal?: () => void;
}

export default function Navbar({ onOpenPairingModal }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    account,
    cardProfile,
    sessionToken,
    logout,
    theme,
    toggleTheme,
    locale,
    toggleLocale,
  } = useAppStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const t = getTranslation(locale);
  const isDark = theme === "dark";

  const navItems = [
    { label: t.nav.card, href: "/mom/dashboard/card", icon: CreditCard },
    { label: t.nav.mom, href: "/mom/dashboard/mom", icon: Mic },
    { label: t.nav.calendar, href: "/mom/dashboard/calendar", icon: Calendar },
    { label: t.nav.wallet, href: "/mom/dashboard/wallet", icon: Coins },
  ];

  return (
    <div className="w-full">
      <EcosystemBar />
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-200 ${
          isDark
            ? "bg-[#0A0E17]/90 border-white/10 text-white"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-xs"
        }`}
      >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand with Official MoM Logo */}
        <div className="flex items-center gap-8">
          <Link href="/mom/card" className="flex items-center group">
            <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} showTagline={false} />
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-sky-600 text-white shadow-xs"
                      : isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Unified & Uncluttered */}
        <div className="flex items-center gap-2.5">
          {/* Coin Badge (Compact) */}
          <Link
            href="/mom/dashboard/wallet"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 transition"
            title="Saldo Koin MoM & NFC"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="font-mono">{account.coinBalance ?? 0}</span>
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Ganti Bahasa (ID / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span className="uppercase text-[11px] font-mono">{locale}</span>
          </button>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-amber-400 hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title={isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode"}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* User Profile Dropdown or Login Button */}
          {sessionToken ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border transition ${
                  isDark
                    ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                    : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100"
                }`}
              >
                {account.avatarUrl || cardProfile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={account.avatarUrl || cardProfile.avatarUrl}
                    alt={cardProfile.fullName || "User"}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[11px]">
                    {cardProfile.fullName ? cardProfile.fullName.charAt(0) : "U"}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
                  {cardProfile.fullName?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Profile Popover Menu */}
              {profileDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-52 rounded-2xl border p-2 shadow-2xl z-50 text-xs animate-in zoom-in-95 duration-100 ${
                    isDark
                      ? "bg-[#0E1626] border-white/15 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                    <p className="font-bold truncate">{cardProfile.fullName || "Pengguna"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{account.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={`/${cardProfile.username || "user"}`}
                      target="_blank"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
                    >
                      <span>Lihat Profil Kartu Tap</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </Link>

                    {onOpenPairingModal && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenPairingModal();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
                      >
                        Tautkan Aplikasi HP
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/10 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        router.push("/mom/login");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/mom/login"
              className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}

          {/* Activate CTA (Desktop) */}
          <Link
            href="/mom/activate"
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Radio className="w-3 h-3 text-cyan-200 animate-pulse" />
            <span>Aktivasi Kartu</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition ${
              isDark
                ? "bg-white/5 border-white/10 text-white"
                : "bg-slate-100 border-slate-200 text-slate-800"
            }`}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150 ${
            isDark ? "bg-[#0A0E17] border-white/10" : "bg-white border-slate-200 shadow-md"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-sky-600 text-white"
                    : isDark
                    ? "text-slate-300 hover:bg-white/5"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/mom/activate"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-500 text-white py-3 rounded-xl text-xs font-bold shadow-sm"
          >
            <Radio className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>Aktivasi Kartu Fisik</span>
          </Link>
        </div>
      )}
      </header>
    </div>
  );
}
