import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState, useRef, useEffect } from "react";

import {
  CreditCard,
  Radio,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Users,
  Mic,
  MessageCircle,
  Edit3,
  Save,
  Sparkles,
  Smartphone,
  Share2,
  TrendingUp,
  Coins,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  RotateCw,
  Search,
  Filter,
  Info,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import type {  ContactLead  } from "@/lib/mom/types";
import { getTranslation } from "@/lib/mom/i18n";
import AudioRecordModal from "@/components/mom/AudioRecordModal";
import { CardiMomIcon } from "@/components/mom/CardiMomLogo";

export default function DashboardCardPage() {
  const {
    cardProfile,
    updateCardProfile,
    leads,
    theme,
    locale,
    account,
  } = useAppStore();

  const isDark = theme === "dark";
  const t = getTranslation(locale);

  // States
  const [copied, setCopied] = useState(false);
  const [nfcWriteStatus, setNfcWriteStatus] = useState<string | null>(null);
  const [showNfcGuideModal, setShowNfcGuideModal] = useState(false);
  const [selectedLeadForMeeting, setSelectedLeadForMeeting] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editorTab, setEditorTab] = useState<"basic" | "contact" | "social">("basic");
  const [editForm, setEditForm] = useState(cardProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 3D Card Interactive Preview
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  // Leads Filter & Search
  const [searchLeadQuery, setSearchLeadQuery] = useState("");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<"all" | "hot" | "warm" | "cold">("all");

  useEffect(() => {
    setEditForm(cardProfile);
  }, [cardProfile]);

  const cardPublicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${cardProfile.username || "user"}`
      : `https://cardi.co.id/${cardProfile.username || "user"}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotX(-((y - centerY) / centerY) * 12);
    setRotY(((x - centerX) / centerX) * 14);
  };

  const handleMouseLeaveCard = () => {
    setRotX(0);
    setRotY(0);
  };

  // Web NFC API integration (Android Chrome)
  const handleWriteNfc = async () => {
    if ("NDEFReader" in window) {
      try {
        setNfcWriteStatus("Dekatkan kartu fisik NFC ke bodi ponsel Anda...");
        // @ts-expect-error - Web NFC standard API
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{ recordType: "url", data: cardPublicUrl }],
        });
        setNfcWriteStatus("Sukses! URL kartu berhasil di-flash ke chip NFC fisik.");
        setTimeout(() => setNfcWriteStatus(null), 4000);
      } catch {
        setNfcWriteStatus("Gagal menulis NFC: Pastikan izin sensor NFC telah diberikan.");
        setTimeout(() => setNfcWriteStatus(null), 4000);
      }
    } else {
      setShowNfcGuideModal(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCardProfile(editForm);
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleStartMeetingWithLead = (leadName: string) => {
    setSelectedLeadForMeeting(leadName);
    setIsRecordModalOpen(true);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
      l.phone.includes(searchLeadQuery);
    const matchesStatus =
      selectedLeadStatus === "all" || l.status === selectedLeadStatus;
    return matchesSearch && matchesStatus;
  });

  // Material finish card styling
  const finishThemes = {
    "black-gold": {
      name: "Obsidian Gold",
      bg: "linear-gradient(135deg, #111114 0%, #1e1e24 50%, #0d0d10 100%)",
      border: "border-[#D4AF37]/40",
      accent: "text-[#D4AF37]",
      chipBg: "from-[#D4AF37] to-[#F3D079]",
      sheen: "rgba(212, 175, 55, 0.15)",
    },
    "royal-blue": {
      name: "Deep Navy",
      bg: "linear-gradient(135deg, #071330 0%, #0d255f 50%, #050d24 100%)",
      border: "border-[#00C2D1]/40",
      accent: "text-[#00C2D1]",
      chipBg: "from-[#1E4FFF] to-[#00C2D1]",
      sheen: "rgba(0, 194, 209, 0.15)",
    },
    "silver-minimal": {
      name: "Brushed Titanium",
      bg: "linear-gradient(135deg, #2a2f38 0%, #474f5d 50%, #1f232b 100%)",
      border: "border-slate-300/40",
      accent: "text-slate-200",
      chipBg: "from-slate-400 to-slate-200",
      sheen: "rgba(255, 255, 255, 0.15)",
    },
  };

  const currentFinish = finishThemes[cardProfile.cardDesign || "black-gold"];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 01. Page Title & Action Bar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b transition-colors ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-[#1E4FFF]/15 text-[#1E4FFF] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Smart NFC V2
            </span>
            <span className="text-xs opacity-40">&bull;</span>
            <span className="text-xs opacity-60">Cardi AI Ecosystem</span>
          </div>
          <h1
            className={`text-2xl font-black tracking-tight ${
              isDark ? "text-white" : "text-[#0A1633]"
            }`}
          >
            {t.cardDash.title}
          </h1>
          <p
            className={`text-xs mt-1 max-w-xl ${
              isDark ? "text-white/60" : "text-slate-500"
            }`}
          >
            {t.cardDash.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/mom/activate"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00C2D1]/15 hover:bg-[#00C2D1]/25 border border-[#00C2D1]/30 text-xs font-bold text-[#00C2D1] transition shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t.cardDash.btnStartActivate}</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
              isDark
                ? "bg-white/5 hover:bg-white/10 border-white/15 text-white/90"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60" />
            )}
            <span>{copied ? t.common.linkCopied : t.common.copyLink}</span>
          </button>

          <Link
            href={`/${cardProfile.username || "user"}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4FFF] hover:bg-[#183ec9] text-xs font-bold text-white transition shadow-md shadow-blue-500/20"
          >
            <span>{t.common.viewPublic}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 02. Onboarding Alert (If Card has not been configured) */}
      {(!cardProfile.username || !cardProfile.fullName) && (
        <div
          className={`rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
            isDark
              ? "bg-gradient-to-r from-[#1E4FFF]/20 via-[#00C2D1]/15 to-transparent border-[#1E4FFF]/40 text-white"
              : "bg-gradient-to-r from-blue-50 via-cyan-50 to-white border-blue-200 text-[#0A1633]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#1E4FFF]/20 border border-[#1E4FFF]/40 text-[#1E4FFF] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#00C2D1]" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t.cardDash.alertUnset}</h3>
              <p className="text-xs opacity-75">{t.cardDash.alertUnsetDesc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/mom/activate"
              className="bg-[#1E4FFF] hover:bg-[#183ec9] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap"
            >
              {t.cardDash.btnStartActivate}
            </Link>
            <button
              onClick={() => setIsEditingProfile(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap border ${
                isDark
                  ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
              }`}
            >
              {t.cardDash.btnManualEdit}
            </button>
          </div>
        </div>
      )}

      {/* 03. Performance Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Taps */}
        <div
          className={`p-4 rounded-2xl border transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-lg"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              {t.cardDash.metricTaps}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#00C2D1]/15 text-[#00C2D1] flex items-center justify-center">
              <Radio className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight mb-1">
            {cardProfile.metrics?.totalTaps ?? 0}
          </div>
          <span className="text-[10px] opacity-60 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#10B981]" />
            <span>{t.cardDash.metricTapsDesc}</span>
          </span>
        </div>

        {/* Metric 2: Contacts Collected */}
        <div
          className={`p-4 rounded-2xl border transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-lg"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              {t.cardDash.metricContacts}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight mb-1">
            {leads.length}
          </div>
          <span className="text-[10px] opacity-60">
            {t.cardDash.metricContactsDesc}
          </span>
        </div>

        {/* Metric 3: MoM Meetings */}
        <div
          className={`p-4 rounded-2xl border transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-lg"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              {t.cardDash.metricMom}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#1E4FFF]/15 text-[#1E4FFF] flex items-center justify-center">
              <Mic className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight mb-1">
            {cardProfile.metrics?.momInitiated ?? 0}
          </div>
          <span className="text-[10px] opacity-60">
            {t.cardDash.metricMomDesc}
          </span>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div
          className={`p-4 rounded-2xl border transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-lg"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              {t.cardDash.metricConv}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight mb-1">
            {cardProfile.metrics?.totalTaps && cardProfile.metrics.totalTaps > 0
              ? `${Math.round((leads.length / cardProfile.metrics.totalTaps) * 100)}%`
              : "0%"}
          </div>
          <span className="text-[10px] opacity-60">
            {t.cardDash.metricConvDesc}
          </span>
        </div>
      </div>

      {/* 04. Two-Column Workspace: 3D Realistic Card & Tabbed Profile Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Card Simulation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              {t.cardDash.materialFinish}
            </span>

            {/* Front / Back Flip Switch */}
            <div
              className={`p-0.5 rounded-lg border flex items-center text-[10px] font-semibold ${
                isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setCardSide("front")}
                className={`px-2.5 py-1 rounded-md transition ${
                  cardSide === "front"
                    ? "bg-[#1E4FFF] text-white shadow-sm"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {t.cardDash.frontView}
              </button>
              <button
                type="button"
                onClick={() => setCardSide("back")}
                className={`px-2.5 py-1 rounded-md transition ${
                  cardSide === "back"
                    ? "bg-[#1E4FFF] text-white shadow-sm"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {t.cardDash.backView}
              </button>
            </div>
          </div>

          {/* Interactive Card Canvas with 3D Tilt */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMoveCard}
            onMouseLeave={handleMouseLeaveCard}
            style={{
              transform: `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: "transform 0.12s ease-out",
            }}
            className="w-full max-w-[380px] aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden shadow-2xl border border-white/20 select-none flex flex-col justify-between"
          >
            {/* Dynamic Background with metallic finish */}
            <div
              className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300"
              style={{ background: currentFinish.bg }}
            />
            {/* Specular luster effect */}
            <div
              className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${rotY * 4}%) translateY(${rotX * 4}%)`,
              }}
            />

            {cardSide === "front" ? (
              /* FRONT FACE */
              <>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <CardiMomIcon size={26} inverted />
                    <span className="font-bold text-xs tracking-tight text-white">
                      cardi agent <span className="text-sky-300 font-extrabold">| mom</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Radio className="w-3.5 h-3.5 text-[#00C2D1] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest text-white/80">
                      NFC
                    </span>
                  </div>
                </div>

                <div className="relative z-10 my-auto py-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                    {cardProfile.fullName || "Nama Pemilik Kartu"}
                  </h3>
                  <p className="text-[11px] text-[#00C2D1] font-semibold mt-0.5">
                    {cardProfile.headline || "Jabatan / Profesi"}
                  </p>
                  <p className="text-[10px] text-white/60">
                    {cardProfile.company || "Perusahaan / Brand"}
                  </p>
                </div>

                <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-[10px]">
                  <span className="font-mono text-white/50">
                    @{cardProfile.username || "username"}
                  </span>
                  <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Cardi MoM Ready</span>
                  </span>
                </div>
              </>
            ) : (
              /* BACK FACE */
              <>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-mono tracking-widest text-white/40">
                    ISO/IEC 14443-A
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#00C2D1] bg-white/10 px-2 py-0.5 rounded">
                    NTAG215 CHIP
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-20 h-20 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/10 text-[9px] text-white/50 font-mono">
                  <span>cardi.co.id/{cardProfile.username || "user"}</span>
                  <span className="text-emerald-400 font-semibold">TAP TO OPEN</span>
                </div>
              </>
            )}
          </div>

          {/* Finish Material Selector Pills */}
          <div className="mt-4 flex items-center gap-2">
            {(["black-gold", "royal-blue", "silver-minimal"] as const).map((finish) => (
              <button
                key={finish}
                onClick={() => updateCardProfile({ cardDesign: finish })}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center gap-1.5 ${
                  cardProfile.cardDesign === finish
                    ? "border-[#1E4FFF] bg-[#1E4FFF]/15 text-[#1E4FFF]"
                    : isDark
                    ? "border-white/10 bg-white/5 text-white/60 hover:text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      finish === "black-gold"
                        ? "#D4AF37"
                        : finish === "royal-blue"
                        ? "#00C2D1"
                        : "#94A3B8",
                  }}
                />
                <span>{finishThemes[finish].name}</span>
              </button>
            ))}
          </div>

          {/* NFC Hardware Program Button */}
          <div className="mt-5 w-full max-w-[380px]">
            <button
              onClick={handleWriteNfc}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#00C2D1]/20 to-[#1E4FFF]/20 hover:from-[#00C2D1]/30 hover:to-[#1E4FFF]/30 border border-[#00C2D1]/40 text-[#00C2D1] flex items-center justify-center gap-2 transition"
            >
              <Radio className="w-4 h-4" />
              <span>{t.cardDash.writeNfcBtn}</span>
            </button>
            {nfcWriteStatus && (
              <p className="mt-2 text-center text-xs text-[#00C2D1] font-semibold animate-pulse">
                {nfcWriteStatus}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Clean Tabbed Profile Editor (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-6 transition ${
            isDark
              ? "bg-[#0E1A33] border-white/10 shadow-xl"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Header & Mode Switch */}
          <div
            className={`flex items-center justify-between pb-4 mb-5 border-b ${
              isDark ? "border-white/10" : "border-slate-200"
            }`}
          >
            <div>
              <h2 className="text-base font-bold">
                {isEditingProfile ? "Edit Data Kartu" : "Profil Kartu Digital"}
              </h2>
              <p className="text-xs opacity-60">
                Data ini tampil saat kartu NFC Anda ditempelkan ke smartphone klien.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                isEditingProfile
                  ? "bg-red-500/15 text-red-400 border-red-500/30"
                  : isDark
                  ? "bg-white/5 hover:bg-white/10 text-white border-white/15"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? t.common.cancel : t.common.edit}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{t.common.saved}</span>
            </div>
          )}

          {!isEditingProfile ? (
            /* VIEW MODE */
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.fullName}
                  </span>
                  <p className="font-bold text-sm">
                    {cardProfile.fullName || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.headline}
                  </span>
                  <p className="font-semibold text-[#00C2D1]">
                    {cardProfile.headline || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.company}
                  </span>
                  <p className="font-semibold">
                    {cardProfile.company || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.location}
                  </span>
                  <p className="font-semibold">
                    {cardProfile.location || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.phone}
                  </span>
                  <p className="font-mono">
                    {cardProfile.phone || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">
                    {t.cardDash.email}
                  </span>
                  <p className="font-mono">
                    {cardProfile.email || "-"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1">
                  {t.cardDash.bio}
                </span>
                <p className="leading-relaxed opacity-80 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                  {cardProfile.bio || "Belum ada bio."}
                </p>
              </div>

              {/* Social Links Overview */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-2">
                  {t.cardDash.tabSocials}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {cardProfile.socials?.linkedin && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-mono text-[11px] border border-blue-500/20">
                      LinkedIn
                    </span>
                  )}
                  {cardProfile.socials?.instagram && (
                    <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 font-mono text-[11px] border border-pink-500/20">
                      Instagram
                    </span>
                  )}
                  {cardProfile.socials?.github && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 font-mono text-[11px] border border-purple-500/20">
                      GitHub
                    </span>
                  )}
                  {cardProfile.socials?.whatsapp && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                      WhatsApp
                    </span>
                  )}
                  {!cardProfile.socials?.linkedin &&
                    !cardProfile.socials?.instagram &&
                    !cardProfile.socials?.github &&
                    !cardProfile.socials?.whatsapp && (
                      <span className="opacity-40 italic text-[11px]">
                        Belum ada tautan media sosial.
                      </span>
                    )}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT FORM WITH TABS (Prevents Slop / Clutter) */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Tab Pills */}
              <div
                className={`flex rounded-xl p-1 border mb-4 ${
                  isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
                }`}
              >
                {(
                  [
                    { id: "basic", label: t.cardDash.tabBasic },
                    { id: "contact", label: t.cardDash.tabContact },
                    { id: "social", label: t.cardDash.tabSocials },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditorTab(tab.id)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                      editorTab === tab.id
                        ? "bg-[#1E4FFF] text-white shadow-sm"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: Basic Profile */}
              {editorTab === "basic" && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      {t.cardDash.fullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                        isDark
                          ? "bg-[#070D1E] border-white/15 text-white"
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.headline}
                      </label>
                      <input
                        type="text"
                        value={editForm.headline}
                        onChange={(e) =>
                          setEditForm({ ...editForm, headline: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.company}
                      </label>
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) =>
                          setEditForm({ ...editForm, company: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      {t.cardDash.bio}
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] resize-none ${
                        isDark
                          ? "bg-[#070D1E] border-white/15 text-white"
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Contact & Location */}
              {editorTab === "contact" && (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.phone}
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.email}
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.website}
                      </label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) =>
                          setEditForm({ ...editForm, website: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                        {t.cardDash.location}
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                          isDark
                            ? "bg-[#070D1E] border-white/15 text-white"
                            : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Social Links */}
              {editorTab === "social" && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={editForm.socials?.linkedin || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socials: {
                            ...editForm.socials,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                        isDark
                          ? "bg-[#070D1E] border-white/15 text-white"
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={editForm.socials?.instagram || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socials: {
                            ...editForm.socials,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                        isDark
                          ? "bg-[#070D1E] border-white/15 text-white"
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={editForm.socials?.github || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          socials: {
                            ...editForm.socials,
                            github: e.target.value,
                          },
                        })
                      }
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#1E4FFF] ${
                        isDark
                          ? "bg-[#070D1E] border-white/15 text-white"
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isDark
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#1E4FFF] hover:bg-[#183ec9] text-white flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.common.save}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 05. Contacts & Leads CRM Table */}
      <div
        className={`rounded-2xl border p-6 transition ${
          isDark
            ? "bg-[#0E1A33] border-white/10 shadow-xl"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}
        >
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-[#10B981]" />
              <span>{t.cardDash.leadsTitle}</span>
              <span className="text-xs bg-[#10B981]/15 text-[#10B981] font-mono px-2 py-0.5 rounded-full font-bold">
                {leads.length}
              </span>
            </h3>
            <p className="text-xs opacity-60 mt-0.5">
              {t.cardDash.leadsSubtitle}
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 opacity-40" />
              <input
                type="text"
                value={searchLeadQuery}
                onChange={(e) => setSearchLeadQuery(e.target.value)}
                placeholder={t.common.search}
                className={`pl-8 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-[#1E4FFF] ${
                  isDark
                    ? "bg-[#070D1E] border-white/15 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Table / Empty State */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className={`border-b uppercase font-bold text-[10px] tracking-wider opacity-50 ${
                  isDark ? "border-white/10" : "border-slate-200"
                }`}
              >
                <th className="pb-3">{t.cardDash.colName}</th>
                <th className="pb-3">{t.cardDash.colContact}</th>
                <th className="pb-3">{t.cardDash.colNote}</th>
                <th className="pb-3">{t.cardDash.colTime}</th>
                <th className="pb-3 text-right">{t.cardDash.colAction}</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? "divide-white/5" : "divide-slate-100"
              }`}
            >
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center opacity-50">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm">
                      {t.cardDash.emptyLeadsTitle}
                    </p>
                    <p className="text-xs opacity-75 mt-1 max-w-md mx-auto">
                      {t.cardDash.emptyLeadsDesc}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead: ContactLead) => (
                  <tr
                    key={lead.id}
                    className={`transition ${
                      isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3 pr-3">
                      <p className="font-bold">{lead.name}</p>
                      <p className="text-[11px] opacity-60">{lead.company}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-mono">{lead.phone || "-"}</p>
                      <p className="text-[11px] opacity-60">{lead.email || "-"}</p>
                    </td>
                    <td className="py-3 pr-3 max-w-xs">
                      <p className="opacity-80 line-clamp-1">{lead.notes || "-"}</p>
                    </td>
                    <td className="py-3 pr-3 opacity-60 text-[11px]">
                      {lead.tappedAt ||
                        new Date(lead.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Halo ${lead.name}, senang bertukar kontak melalui kartu Cardi Smart NFC!`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition border border-emerald-500/20"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleStartMeetingWithLead(lead.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E4FFF]/15 hover:bg-[#1E4FFF]/25 border border-[#1E4FFF]/30 text-[#1E4FFF] text-xs font-bold transition"
                          title="Mulai Rekaman MoM Rapat Otomatis"
                        >
                          <Mic className="w-3 h-3" />
                          <span>{t.cardDash.btnRecordWithLead}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 06. Sweet Spot NFC Guide Modal */}
      {showNfcGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${
              isDark ? "bg-[#0E1A33] border-white/20 text-white" : "bg-white border-slate-200 text-[#0A1633]"
            }`}
          >
            <button
              onClick={() => setShowNfcGuideModal(false)}
              className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00C2D1]/15 text-[#00C2D1] flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Panduan Titik Tempel NFC (Sweet Spot)</h3>
                <p className="text-xs opacity-60">Lokasi antena NFC pada smartphone klien</p>
              </div>
            </div>

            <div className="space-y-3 text-xs opacity-80 leading-relaxed mb-6">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <strong className="text-[#00C2D1] block mb-1">iPhone (Apple):</strong>
                Antena NFC terletak di <strong>ujung paling atas</strong> (tepat di samping kamera belakang). Tempelkan ujung kartu ke tepi atas iPhone.
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <strong className="text-[#1E4FFF] block mb-1">Android (Samsung, Xiaomi, Oppo, dll):</strong>
                Antena NFC umumnya terletak di <strong>bagian tengah punggung ponsel</strong>.
              </div>
            </div>

            <button
              onClick={() => setShowNfcGuideModal(false)}
              className="w-full bg-[#1E4FFF] hover:bg-[#183ec9] text-white py-2.5 rounded-xl font-bold text-xs transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Record Modal */}
      <AudioRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
    </div>
  );
}
