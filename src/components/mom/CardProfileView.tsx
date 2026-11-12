import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState, useRef } from "react";


import {
  Download,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  MapPin,
  Mic,
  Calendar,
  Share2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Radio,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Send,
  UserCheck,
  Building,
  Rotate3d,
  Layers,
  ChevronRight,
  Play,
  Square,
  Sun,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { getProfileByUsername } from "@/lib/mom/profiles";
import { getTranslation } from "@/lib/mom/i18n";
import { CardiMomIcon, CardiMomLogo } from "@/components/mom/CardiMomLogo";
import EcosystemBar from "@/components/mom/EcosystemBar";

export default function PublicCardPage({ username }: { username?: string }) {
  return <PublicCardContent username={username} />;
}

type CardFinish = "obsidian" | "navy" | "titanium";

function PublicCardContent({ username: propUsername }: { username?: string }) {
  const router = useRouter();
  const pathParts = typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean) : [];
  const username = propUsername || pathParts[pathParts.length - 1] || "deo";

  const {
    cardProfile: currentStoreProfile,
    addMeeting,
    addContact,
    theme,
    toggleTheme,
    locale,
    toggleLocale,
  } = useAppStore();

  const isDark = theme === "dark";
  const t = getTranslation(locale);

  // Dynamic Profile Resolution: Use active store if matches, or registry/fallback
  const cardProfile =
    username.toLowerCase() === currentStoreProfile.username?.toLowerCase()
      ? currentStoreProfile
      : getProfileByUsername(username);

  // State
  const [cardFinish, setCardFinish] = useState<CardFinish>("obsidian");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [exchangeSubmitted, setExchangeSubmitted] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorContact, setVisitorContact] = useState("");
  const [visitorNote, setVisitorNote] = useState("");

  // MoM In-Person Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordInterval, setRecordInterval] = useState<NodeJS.Timeout | null>(null);
  const [momResult, setMomResult] = useState<{
    summary: string;
    decisions: string[];
    actions: { item: string; owner: string }[];
  } | null>(null);

  // 3D Card Interactive Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(-((y - centerY) / centerY) * 12);
    setRotateY(((x - centerX) / centerX) * 14);
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${cardProfile.fullName || "Cardi User"} - Cardi Smart NFC Card`,
          text: `Profil Eksekutif & Notula Rapat AI bersama ${cardProfile.fullName || "Cardi User"}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast(locale === "id" ? "Tautan profil berhasil disalin!" : "Profile link copied!");
    }
  };

  const startMeetingRecord = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    setMomResult(null);
    const interval = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
    setRecordInterval(interval);
  };

  const stopMeetingRecord = () => {
    if (recordInterval) clearInterval(recordInterval);
    setIsRecording(false);

    const generatedMom = {
      summary:
        locale === "id"
          ? `Pertemuan tatap muka langsung berhasil direkam via kartu NFC Cardi bersama ${cardProfile.fullName}. Diskusi menyepakati kolaborasi strategis dan integrasi solusi.`
          : `In-person meeting successfully recorded via Cardi Smart NFC Card with ${cardProfile.fullName}. The parties agreed on strategic collaboration and solution delivery.`,
      decisions:
        locale === "id"
          ? [
              "Menyetujui agenda tindak lanjut pengenalan solusi Cardi.",
              "Mengirimkan dokumen pengantar resmi dalam 24 jam.",
            ]
          : [
              "Agreed on follow-up schedule for Cardi ecosystem rollout.",
              "Send official intro brief and deliverables within 24 hours.",
            ],
      actions:
        locale === "id"
          ? [
              {
                item: `Kirimkan ringkasan hasil pertemuan ke ${cardProfile.email || "email"}`,
                owner: cardProfile.fullName?.split(" ")[0] || "PIC",
              },
              { item: "Follow-up pesan WhatsApp koordinasi tim", owner: "Tamu Rapat" },
            ]
          : [
              {
                item: `Send meeting brief to ${cardProfile.email || "email"}`,
                owner: cardProfile.fullName?.split(" ")[0] || "PIC",
              },
              { item: "WhatsApp follow-up with team leads", owner: "Guest" },
            ],
    };

    setMomResult(generatedMom);

    // Save to global MoM store
    addMeeting({
      id: `mtg_${Date.now()}`,
      title: `Rapat Tatap Muka: ${cardProfile.fullName || "Partner"}`,
      titleIsDefault: false,
      date: new Date().toISOString().split("T")[0],
      startTime: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      durationMinutes: Math.max(1, Math.ceil(recordSeconds / 60)),
      attendees: `Tamu NFC, ${cardProfile.fullName || "User"}`,
      location: "Pertemuan Langsung (NFC Tap)",
      status: "ready",
      failedStage: null,
      failureReason: null,
      mom: {
        shortSummary: generatedMom.summary,
        executiveSummary: generatedMom.summary,
        discussionPoints: [
          {
            topic: "Pembahasan Kolaborasi",
            detail: "Inisiasi kerjasama strategis.",
            sourceMs: [2000, 8000],
          },
        ],
        decisions: generatedMom.decisions.map((text, idx) => ({
          text,
          sourceMs: [(idx + 1) * 10000],
        })),
        actionItems: generatedMom.actions.map((act, idx) => ({
          item: act.item,
          owner: act.owner,
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          dueDateText: locale === "id" ? "2 hari lagi" : "2 days",
          sourceMs: [(idx + 1) * 15000],
        })),
        openIssues: [],
        nextSteps: [{ text: "Follow-up via WhatsApp", sourceMs: [] }],
        model: "gpt-4o-transcribe-v2",
        promptVersion: "1.2.0",
      },
      momReadAt: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    showToast(t.publicCard.momDone);
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    addContact({
      id: `cnt_${Date.now()}`,
      name: visitorName.trim(),
      company: visitorNote.trim() ? `Catatan: ${visitorNote.trim()}` : "Tamu Tap Kartu",
      phone: visitorContact.trim(),
      email: visitorContact.includes("@") ? visitorContact.trim() : "",
      status: "hot",
      notes: visitorNote.trim() || `Kontak diperoleh langsung dari tap kartu digital @${cardProfile.username || username}`,
      tappedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date().toISOString(),
    });

    setExchangeSubmitted(true);
    showToast(
      locale === "id"
        ? `Kontak Anda berhasil terkirim ke ${cardProfile.fullName || "pemilik kartu"}!`
        : `Your contact has been sent to ${cardProfile.fullName || "card owner"}!`
    );
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // VCard link
  const vCardUrl = `/api/vcard/${username}?name=${encodeURIComponent(
    cardProfile.fullName || "User"
  )}&title=${encodeURIComponent(cardProfile.headline || "")}&company=${encodeURIComponent(
    cardProfile.company || ""
  )}&phone=${encodeURIComponent(cardProfile.phone || "")}&email=${encodeURIComponent(
    cardProfile.email || ""
  )}&website=${encodeURIComponent(cardProfile.website || "")}&address=${encodeURIComponent(
    cardProfile.location || ""
  )}`;

  // Card Appearance Styles based on Finish
  const finishStyles = {
    obsidian: {
      bg: "from-[#10141E] via-[#0A0D17] to-[#04060C]",
      border: "border-white/20",
      accent: "text-[#D4AF37]",
      chip: "from-[#F3D079] via-[#ECC062] to-[#B38728]",
      pill: "bg-[#D4AF37]/15 text-[#F3D079] border-[#D4AF37]/30",
    },
    navy: {
      bg: "from-[#08215E] via-[#0A1633] to-[#03091B]",
      border: "border-[#1E4FFF]/40",
      accent: "text-[#64B5F6]",
      chip: "from-[#E2E8F0] via-[#94A3B8] to-[#475569]",
      pill: "bg-[#1E4FFF]/20 text-[#93C5FD] border-[#1E4FFF]/40",
    },
    titanium: {
      bg: "from-[#1E293B] via-[#0F172A] to-[#020617]",
      border: "border-[#00C2D1]/40",
      accent: "text-[#00C2D1]",
      chip: "from-[#67E8F9] via-[#06B6D4] to-[#0E7490]",
      pill: "bg-[#00C2D1]/15 text-[#67E8F9] border-[#00C2D1]/30",
    },
  }[cardFinish];

  return (
    <div className="w-full flex flex-col min-h-screen">
      <EcosystemBar />
      <div
        className={`flex-1 flex flex-col items-center justify-start p-4 sm:p-6 pb-28 selection:bg-[#1E4FFF] selection:text-white relative overflow-x-hidden transition-colors duration-200 ${
          isDark
            ? "bg-[#070D1E] text-white ambient-glow-dark"
            : "bg-[#F8FAFD] text-[#0A1633] ambient-glow"
        }`}
      >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-[#1E4FFF] text-white font-medium text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00C2D1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header
        className={`w-full max-w-md flex items-center justify-between py-3 mb-4 border-b ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}
      >
        <Link href="/mom/card" className="flex items-center">
          <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} />
        </Link>

        {/* Right Header Controls: Locale, Theme, QR, Share */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLocale}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="Switch Language (ID / EN)"
          >
            {locale.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-[#D4AF37] hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* QR Code button */}
          <button
            onClick={() => setShowQrModal(true)}
            className={`p-1.5 rounded-lg border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
            title="QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition ${
              isDark
                ? "bg-white/5 border-white/15 text-white hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
            }`}
          >
            <Share2 className="w-3 h-3" />
            <span>{t.common.share}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-md flex flex-col gap-4">
        {/* FINISH SELECTOR / CARD STYLES */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider opacity-60">
            <Layers className="w-3.5 h-3.5 text-[#1E4FFF]" />
            <span>Finish:</span>
          </div>
          <div
            className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
            }`}
          >
            <button
              onClick={() => setCardFinish("obsidian")}
              className={`text-[10.5px] px-2.5 py-1 rounded-lg font-bold transition ${
                cardFinish === "obsidian"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Obsidian Gold
            </button>
            <button
              onClick={() => setCardFinish("navy")}
              className={`text-[10.5px] px-2.5 py-1 rounded-lg font-bold transition ${
                cardFinish === "navy"
                  ? "bg-[#1E4FFF]/25 text-[#1E4FFF] border border-[#1E4FFF]/40 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Royal Navy
            </button>
            <button
              onClick={() => setCardFinish("titanium")}
              className={`text-[10.5px] px-2.5 py-1 rounded-lg font-bold transition ${
                cardFinish === "titanium"
                  ? "bg-[#00C2D1]/20 text-[#00C2D1] border border-[#00C2D1]/40 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              Titanium
            </button>
          </div>
        </div>

        {/* 3D INTERACTIVE PHYSICAL NFC CARD MOCKUP */}
        <div className="w-full">
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.12s ease-out",
            }}
            className={`w-full aspect-[1.586/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl border ${finishStyles.border} select-none flex flex-col justify-between`}
          >
            {/* Background Texture with metallic finish */}
            <div
              className={`absolute inset-0 z-0 bg-gradient-to-tr ${finishStyles.bg}`}
            />
            {/* Luster highlight */}
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${rotateY * 4}%) translateY(${rotateX * 4}%)`,
              }}
            />

            {/* Card Header: Brand & Contactless Icon */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/mom/logo-mom-card.png"
                  alt="Cardi Agent MoM"
                  className="h-6 object-contain drop-shadow-xs"
                />
              </div>

              {/* NFC Wireless Symbol */}
              <div className="relative">
                <Radio className="w-4 h-4 text-white/90 animate-pulse" />
              </div>
            </div>

            {/* Card Center: EMV Chip & Holographic Foil */}
            <div className="flex items-center justify-between z-10">
              <div
                className={`w-12 h-9 rounded-lg bg-gradient-to-tr ${finishStyles.chip} border border-white/40 shadow-md flex items-center justify-around px-1 relative overflow-hidden`}
              >
                <div className="w-[1px] h-full bg-black/25" />
                <div className="w-3.5 h-3.5 rounded-full border border-black/35 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                </div>
                <div className="w-[1px] h-full bg-black/25" />
              </div>

              <div className="text-[9.5px] font-mono tracking-widest uppercase text-white/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>NTAG215 • 504B</span>
              </div>
            </div>

            {/* Card Bottom: Holder Name & Company */}
            <div className="flex justify-between items-end z-10 pt-2 border-t border-white/10">
              <div>
                <p className="text-[13px] sm:text-[14px] font-extrabold tracking-wide text-white uppercase leading-tight">
                  {cardProfile.fullName || "Card Owner"}
                </p>
                <p className="text-[10.5px] text-white/70 font-medium">
                  {cardProfile.headline || "Professional"} ·{" "}
                  {cardProfile.company || "Cardi Network"}
                </p>
              </div>

              <div
                className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border ${finishStyles.pill} font-bold`}
              >
                VERIFIED
              </div>
            </div>
          </div>
        </div>

        {/* 3D Hint */}
        <div className="flex items-center justify-center gap-1.5 text-[10.5px] opacity-40 font-mono text-center -mt-2">
          <Rotate3d className="w-3.5 h-3.5" />
          <span>
            {locale === "id"
              ? "Sentuh atau geser kartu untuk efek 3D reflektif"
              : "Tilt or hover over card for 3D reflective luster"}
          </span>
        </div>

        {/* EXECUTIVE PROFILE & IDENTITY CARD */}
        <div
          className={`rounded-3xl p-6 border flex flex-col items-center text-center transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-xl"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Avatar with Status Ring */}
          <div className="relative mb-3.5">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#1E4FFF] via-[#00C2D1] to-[#D4AF37] shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0A1633] flex items-center justify-center font-black text-2xl text-white">
                {cardProfile.fullName
                  ? cardProfile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                  : "U"}
              </div>
            </div>
            <div
              className="absolute bottom-1 right-1 bg-[#10B981] border-[2.5px] border-[#0E1A33] w-6 h-6 rounded-full flex items-center justify-center shadow-md"
              title="Chip NFC Aktif"
            >
              <Check className="w-3 h-3 text-white stroke-[3]" />
            </div>
          </div>

          {/* Name & Headline */}
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="text-xl font-black tracking-tight">
              {cardProfile.fullName || "Card Owner"}
            </h1>
            <ShieldCheck className="w-4 h-4 text-[#00C2D1]" />
          </div>

          <p className="text-xs font-semibold text-[#1E4FFF] mb-1.5">
            {cardProfile.headline || "Cardi Member"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs opacity-60 mb-4">
            <span className="flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 opacity-60" />
              {cardProfile.company || "Enterprise"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 opacity-60" />
              {cardProfile.location || "Indonesia"}
            </span>
          </div>

          {/* Bio */}
          <p className="text-xs opacity-75 leading-relaxed max-w-sm mb-6 font-normal">
            {cardProfile.bio ||
              "Pengguna resmi kartu bisnis pintar Cardi Smart NFC Card & AI MoM."}
          </p>

          {/* HERO ACTIONS */}
          <div className="w-full flex flex-col gap-2.5">
            <a
              href={vCardUrl}
              download={`${username}-contact.vcf`}
              onClick={() =>
                showToast(
                  locale === "id"
                    ? `Kontak ${cardProfile.fullName || "kartu"} sedang diunduh!`
                    : `Contact ${cardProfile.fullName || "card"} downloading!`
                )
              }
              className="w-full bg-gradient-to-r from-[#1E4FFF] to-[#0258A4] hover:from-[#153DCC] hover:to-[#01417A] text-white py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/20 transition-all border border-white/20"
            >
              <Download className="w-4 h-4 text-[#00C2D1]" />
              <span>{t.publicCard.saveContact} (.vcf)</span>
            </a>

            {/* Google Calendar Direct Booking */}
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                `Pertemuan dengan ${cardProfile.fullName || "Partner"}`
              )}&details=${encodeURIComponent(
                `Pertemuan bisnis diatur melalui Cardi Smart NFC Card.\nProfil: ${cardProfile.fullName} (${cardProfile.headline || ""})\nEmail: ${cardProfile.email || ""}`
              )}&add=${encodeURIComponent(cardProfile.email || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>
                {locale === "id"
                  ? "Jadwalkan di Google Calendar"
                  : "Schedule via Google Calendar"}
              </span>
            </a>

            {/* Quick Connect Row */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {cardProfile.phone && (
                <a
                  href={`https://wa.me/${cardProfile.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    locale === "id"
                      ? `Halo ${cardProfile.fullName}, senang bertukar kontak melalui kartu Cardi NFC Anda!`
                      : `Hello ${cardProfile.fullName}, glad to connect via your Cardi NFC Card!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-[#10B981]" />
                  <span>WhatsApp</span>
                </a>
              )}

              {cardProfile.email && (
                <a
                  href={`mailto:${cardProfile.email}?subject=Diskusi%20Kerjasama%20via%20Cardi%20NFC`}
                  className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#1E4FFF]" />
                  <span>Email</span>
                </a>
              )}

              {cardProfile.phone && (
                <a
                  href={`tel:${cardProfile.phone}`}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Telepon</span>
                </a>
              )}

              {cardProfile.website && (
                <a
                  href={cardProfile.website}
                  target="_blank"
                  rel="noreferrer"
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#00C2D1]" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* IN-PERSON AI MoM RECORDER WIDGET */}
        <div
          className={`rounded-3xl p-5 border shadow-xl transition ${
            isDark
              ? "bg-[#0E1A33] border-[#1E4FFF]/30 text-white"
              : "bg-white border-blue-200 text-[#0A1633]"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1E4FFF]/20 border border-[#1E4FFF]/40 flex items-center justify-center text-[#1E4FFF]">
                <Mic className="w-4 h-4 text-[#00C2D1] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider">
                    {t.publicCard.inPersonMomTitle}
                  </h3>
                  <span className="text-[9px] bg-[#1E4FFF] text-white px-2 py-0.5 rounded-full font-bold">
                    AI MoM
                  </span>
                </div>
                <p className="text-[11px] opacity-60">
                  {t.publicCard.inPersonMomDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Equalizer & Controls */}
          <div
            className={`border rounded-2xl p-4 flex flex-col items-center ${
              isDark ? "bg-[#070D1E] border-white/10" : "bg-slate-50 border-slate-200"
            }`}
          >
            {/* Waveform Animation */}
            <div className="w-full h-12 flex items-center justify-center gap-1.5 px-2 mb-3">
              {isRecording ? (
                Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#1E4FFF] to-[#00C2D1] rounded-full animate-wave-bar"
                    style={{
                      animationDelay: `${(i % 6) * 0.12}s`,
                      height: `${Math.max(6, ((i * 11) % 36) + 6)}px`,
                    }}
                  />
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs opacity-40 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-[#00C2D1]" />
                  <span>
                    {locale === "id"
                      ? "Mikrofon siap merekam rapat tatap muka"
                      : "Microphone ready to capture in-person meeting"}
                  </span>
                </div>
              )}
            </div>

            {/* Timer & Status */}
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-record-dot" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400/40" />
                )}
                <span className="text-xs opacity-70 font-mono">
                  {isRecording
                    ? locale === "id"
                      ? "Sedang Merekam..."
                      : "Recording..."
                    : "Durasi"}
                </span>
              </div>
              <span className="text-base font-mono font-bold tracking-wider">
                {formatTimer(recordSeconds)}
              </span>
            </div>

            {/* Action Buttons */}
            {!isRecording ? (
              <button
                onClick={startMeetingRecord}
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.publicCard.btnStartRecord}</span>
              </button>
            ) : (
              <button
                onClick={stopMeetingRecord}
                className="w-full bg-gradient-to-r from-[#1E4FFF] to-[#00C2D1] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t.publicCard.btnStopRecord}</span>
              </button>
            )}

            {/* Generated MoM Result Preview */}
            {momResult && (
              <div className="w-full mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#00C2D1] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t.publicCard.momDone}
                  </span>
                  <Link
                    href="/mom/dashboard/mom"
                    className="text-[10px] text-[#1E4FFF] hover:underline flex items-center gap-1 font-bold"
                  >
                    Buka di Dashboard <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs opacity-80 leading-relaxed mb-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl border border-black/5 dark:border-white/10">
                  {momResult.summary}
                </p>
                <div className="space-y-1">
                  <span className="text-[10px] opacity-60 uppercase font-mono font-bold">
                    {t.publicCard.actionItems}:
                  </span>
                  {momResult.actions.map((act, i) => (
                    <div key={i} className="text-xs opacity-75 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E4FFF]" />
                      <span>
                        {act.item} ({act.owner})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LEAD CAPTURE: TUKAR KONTAK BALIK */}
        <div
          className={`rounded-3xl p-5 border shadow-xl transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 text-white"
              : "bg-white border-slate-200 text-[#0A1633]"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {t.publicCard.exchangeTitle}
              </h3>
            </div>
            <button
              onClick={() => setShowExchangeForm(!showExchangeForm)}
              className="text-[11px] text-[#1E4FFF] font-bold hover:underline"
            >
              {showExchangeForm
                ? locale === "id"
                  ? "Sembunyikan"
                  : "Hide"
                : locale === "id"
                ? "Buka Formulir"
                : "Open Form"}
            </button>
          </div>

          <p className="text-xs opacity-60 mb-3">
            {t.publicCard.exchangeSubtitle}
          </p>

          {exchangeSubmitted ? (
            <div className="bg-[#10B981]/15 border border-[#10B981]/30 p-3.5 rounded-xl text-center">
              <CheckCircle2 className="w-6 h-6 text-[#10B981] mx-auto mb-1" />
              <p className="text-xs font-bold">
                {locale === "id" ? "Kontak Anda Berhasil Terkirim!" : "Your contact has been sent!"}
              </p>
              <p className="text-[11px] opacity-75 mt-0.5">
                {cardProfile.fullName || "Card Owner"}{" "}
                {locale === "id"
                  ? "akan segera menindaklanjuti pesan Anda."
                  : "will follow up with you shortly."}
              </p>
            </div>
          ) : (
            showExchangeForm && (
              <form
                onSubmit={handleExchangeSubmit}
                className="space-y-2.5 animate-in fade-in duration-150"
              >
                <input
                  type="text"
                  placeholder={t.publicCard.yourName}
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E4FFF] ${
                    isDark
                      ? "bg-[#070D1E] border-white/10 text-white placeholder-white/30"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder={t.publicCard.yourPhone}
                  value={visitorContact}
                  onChange={(e) => setVisitorContact(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#1E4FFF] ${
                    isDark
                      ? "bg-[#070D1E] border-white/10 text-white placeholder-white/30"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
                <textarea
                  placeholder={t.publicCard.yourNote}
                  value={visitorNote}
                  onChange={(e) => setVisitorNote(e.target.value)}
                  rows={2}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#1E4FFF] resize-none ${
                    isDark
                      ? "bg-[#070D1E] border-white/10 text-white placeholder-white/30"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
                <button
                  type="submit"
                  className="w-full bg-[#1E4FFF] hover:bg-[#153DCC] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.publicCard.btnSendContact}</span>
                </button>
              </form>
            )
          )}
        </div>

        {/* QUICK CALENDAR / APPOINTMENT */}
        <div
          className={`rounded-3xl p-4 flex items-center justify-between border transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 text-white"
              : "bg-white border-slate-200 text-[#0A1633]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold">
                {locale === "id" ? "Jadwalkan Rapat" : "Schedule Meeting"}
              </h4>
              <p className="text-[11px] opacity-60">
                {locale === "id"
                  ? "Pilih agenda atau sinkronkan kalender"
                  : "Pick a slot or sync Google Calendar"}
              </p>
            </div>
          </div>
          <Link
            href="/mom/dashboard/calendar"
            className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 font-bold border transition ${
              isDark
                ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
            }`}
          >
            <span>{locale === "id" ? "Buka" : "Open"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="text-center pt-3 pb-6 text-xs space-y-2">
          <p className="font-semibold">
            <Link href="/mom/card" className="hover:text-sky-500 transition underline-offset-2 hover:underline">
              {t.publicCard.poweredBy}
            </Link>
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] opacity-75">
            <Link href="/mom/activate" className="text-sky-500 hover:underline font-medium">
              {locale === "id" ? "Aktivasi Kartu Anda" : "Activate Your Card"}
            </Link>
            <span className="opacity-40">•</span>
            <Link href="/mom/login" className="hover:underline">
              {locale === "id" ? "Login Eksekutif" : "Executive Login"}
            </Link>
          </div>
          <p className="text-[10px] opacity-40">
            {locale === "id"
              ? "Tersedia untuk Android & iOS · Dilindungi Enkripsi Standar Perusahaan"
              : "Available for Android & iOS · Enterprise Grade Encryption"}
          </p>
        </footer>
      </main>

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-xs rounded-3xl p-6 border shadow-2xl flex flex-col items-center text-center ${
              isDark
                ? "bg-[#0E1A33] border-white/15 text-white"
                : "bg-white border-slate-200 text-[#0A1633]"
            }`}
          >
            <div className="w-full flex justify-between items-center pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">
                Scan QR Code Profil
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="opacity-50 hover:opacity-100 text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* QR Mockup Box */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  typeof window !== "undefined"
                    ? window.location.href
                    : `https://www.cardi.co.id/${username}`
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs opacity-70 leading-relaxed mb-4">
              {locale === "id"
                ? "Arahkan kamera HP ke kode QR di atas untuk membuka profil & simpan kontak langsung."
                : "Scan the QR code above with any phone camera to view profile and save contact."}
            </p>

            <button
              onClick={() => {
                if (typeof navigator !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  showToast(locale === "id" ? "Tautan profil berhasil disalin!" : "Link copied!");
                }
              }}
              className="w-full bg-[#1E4FFF] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t.common.copyLink}</span>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
