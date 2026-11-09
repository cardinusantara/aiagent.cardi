import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState, useEffect, Suspense } from "react";


import {
  CreditCard,
  Radio,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Zap,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { CardiMomLogo } from "@/components/mom/CardiMomLogo";
import EcosystemBar from "@/components/mom/EcosystemBar";

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#070D1E] flex items-center justify-center text-slate-500 text-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
            <span>Memuat halaman aktivasi...</span>
          </div>
        </div>
      }
    >
      <ActivateContent />
    </Suspense>
  );
}

function ActivateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tagParam = searchParams.get("tag") || "CRD-89421";

  const { theme, updateCardProfile, setSession, addCoins } = useAppStore();
  const isDark = theme === "dark";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tagId, setTagId] = useState(tagParam);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cardDesign, setCardDesign] = useState<"black-gold" | "royal-blue" | "silver-minimal">("black-gold");
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tagParam) {
      setTagId(tagParam);
    }
  }, [tagParam]);

  const handleCompleteActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);

    setTimeout(() => {
      setIsActivating(false);
      setIsSuccess(true);

      const cleanUser = username.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "user";
      const userFullName = fullName.trim() || "Nama Pengguna";
      const userEmail = email.trim() || `${cleanUser}@cardi.co.id`;

      // Update global store with the user's card profile
      updateCardProfile({
        username: cleanUser,
        fullName: userFullName,
        headline: headline.trim() || "Professional & Business Leader",
        company: company.trim() || "Cardi Ecosystem",
        phone: phone.trim() || "+62 812-8989-5646",
        email: userEmail,
        website: "https://cardi.co.id",
        location: "Jakarta, Indonesia",
        bio: `Profil eksekutif resmi ${userFullName}. Terhubung dengan ekosistem Cardi Smart NFC Card & AI MoM Assistant.`,
        cardDesign,
        metrics: {
          totalTaps: 1,
          contactsSaved: 0,
          momInitiated: 0,
        },
      });

      // Initialize user account & session
      setSession(`tok_${cleanUser}_active`, {
        email: userEmail,
        name: userFullName,
        coinsBalance: 50,
        coinBalance: 50,
        freemiumGranted: true,
        subscription: {
          status: "active",
          tier: "pro",
          currentPeriodEnd: "2027-12-31T00:00:00Z",
        },
        pairedApp: null,
      });

      // Grant welcome topup bonus
      addCoins(50, "Bonus Sambutan Aktivasi Kartu NFC Baru (50 Koin)");

      setTimeout(() => {
        router.push(`/mom/${cleanUser}`);
      }, 2500);
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? "bg-[#070D1E] text-white" : "bg-[#F8FAFD] text-slate-900"
    }`}>
      {/* Official Cardi Ecosystem Top Bar */}
      <EcosystemBar />

      {/* Header Bar */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
        isDark ? "border-white/10 bg-[#0B1528]/80" : "border-slate-200 bg-white/90 shadow-xs"
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/mom/card" className="flex items-center">
            <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} showTagline />
          </Link>

          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chip NFC Terverifikasi</span>
            </div>
            <span className="font-mono text-sky-700 dark:text-[#00C2D1] bg-sky-50 dark:bg-[#00C2D1]/10 px-2.5 py-1 rounded-full border border-sky-200 dark:border-[#00C2D1]/20 font-bold">
              {tagId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {isSuccess ? (
          /* Success Screen */
          <div className={`max-w-lg mx-auto border rounded-3xl p-8 sm:p-10 text-center shadow-xl animate-in zoom-in-95 duration-200 ${
            isDark ? "bg-[#0E1A33] border-emerald-500/40" : "bg-white border-emerald-300 shadow-emerald-500/5"
          }`}>
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 inline-block mb-3">
              Kartu NFC Berhasil Diaktifkan!
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
              Selamat Datang, {fullName || "Partner"}!
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Chip NFC kartu fisik Anda sekarang telah terhubung ke profil digital:
              <br />
              <strong className="text-sky-600 dark:text-[#00C2D1] font-mono mt-1 inline-block text-base">
                cardi.co.id/mom/{username}
              </strong>
            </p>

            <div className={`p-4 rounded-2xl border text-left text-xs space-y-2 mb-6 ${
              isDark ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Kartu Siap Digunakan Langsung:</span>
              </div>
              <p className="opacity-80">
                • Tempelkan kartu ini ke smartphone klien untuk bertukar kontak vCard instan tanpa aplikasi.
              </p>
              <p className="opacity-80">
                • Bonus 50 Koin MoM telah ditambahkan ke akun Anda untuk transkripsi rapat notulen AI.
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-white/40 flex items-center justify-center gap-1.5 animate-pulse">
              <span>Mengalihkan ke kartu digital publik Anda...</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        ) : (
          /* Step-by-Step Activation Wizard */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form (7 cols) */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 sm:p-8 shadow-sm ${
              isDark ? "bg-[#0E1A30] border-white/10" : "bg-white border-slate-200"
            }`}>
              {/* Stepper indicator */}
              <div className={`flex items-center justify-between mb-8 pb-4 border-b ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? "bg-sky-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                  }`}>
                    1
                  </div>
                  <span className={`text-xs font-semibold ${
                    step >= 1 ? "text-slate-900 dark:text-white font-bold" : "text-slate-400"
                  }`}>
                    Klaim Tautan
                  </span>
                </div>

                <div className={`w-8 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? "bg-sky-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                  }`}>
                    2
                  </div>
                  <span className={`text-xs font-semibold ${
                    step >= 2 ? "text-slate-900 dark:text-white font-bold" : "text-slate-400"
                  }`}>
                    Data Profil
                  </span>
                </div>

                <div className={`w-8 h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 3 ? "bg-sky-600 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                  }`}>
                    3
                  </div>
                  <span className={`text-xs font-semibold ${
                    step >= 3 ? "text-slate-900 dark:text-white font-bold" : "text-slate-400"
                  }`}>
                    Desain Kartu
                  </span>
                </div>
              </div>

              {/* Step 1: Claim Username & Verify Tag */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-sky-600" />
                      <span>Aktivasi Kartu Fisik NFC Anda</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Masukkan Tag ID yang tertera pada kemasan atau kartu fisik Anda, lalu tentukan username profil digital Anda.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                      Tag ID Chip NFC
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagId}
                        onChange={(e) => setTagId(e.target.value.toUpperCase())}
                        placeholder="CRD-XXXXX"
                        className={`w-full rounded-xl px-4 py-3 text-sm font-mono tracking-wider font-bold border focus:outline-none focus:border-sky-500 transition ${
                          isDark
                            ? "bg-slate-900/60 border-white/15 text-[#00C2D1]"
                            : "bg-slate-50 border-slate-300 text-sky-700"
                        }`}
                        required
                      />
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-3 rounded-xl font-bold whitespace-nowrap border border-emerald-200 dark:border-emerald-500/30">
                        Siap Diaktivasi
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                      Pilih Username Tautan Publik
                    </label>
                    <div className={`flex items-center rounded-xl border px-4 focus-within:border-sky-500 transition ${
                      isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                    }`}>
                      <span className="text-xs font-semibold text-slate-400 select-none">
                        cardi.co.id/
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        placeholder="namabrand"
                        className="w-full bg-transparent py-3 text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400 font-semibold"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      Tautan profil ini otomatis terbuka di browser ponsel siapapun saat kartu NFC di-tap.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!username || !tagId}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-sky-600 to-[#1E4FFF] hover:from-sky-700 hover:to-[#183ec9] text-white font-bold py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Lanjut ke Data Profil</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Fill Personal Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                      Data Kartu Nama Anda
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Informasi ini akan muncul pada kartu digital dan langsung dapat disimpan ke buku kontak smartphone lawan bicara.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Hendra Pratama"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition ${
                          isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Jabatan / Posisi
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Contoh: Chief Executive Officer"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition ${
                          isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Perusahaan / Brand
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="PT Maju Bersama AI"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition ${
                          isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+62 812-3456-7890"
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition ${
                          isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hendra@perusahaan.com"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition ${
                        isDark ? "bg-slate-900/60 border-white/15" : "bg-slate-50 border-slate-300"
                      }`}
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`w-1/3 py-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      disabled={!fullName}
                      onClick={() => setStep(3)}
                      className="w-2/3 bg-sky-600 hover:bg-sky-500 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-sm"
                    >
                      <span>Lanjut Pilih Tampilan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Card Material Finish & Final Activate */}
              {step === 3 && (
                <form onSubmit={handleCompleteActivation} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                      Pilih Tampilan Material Kartu
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Sesuaikan tampilan kartu digital agar selaras dengan edisi kartu fisik NFC Anda.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCardDesign("black-gold")}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                        cardDesign === "black-gold"
                          ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30"
                          : isDark
                          ? "border-white/10 bg-white/5 hover:border-white/20"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#050505] to-[#252525] border border-amber-400/50 mx-auto mb-2 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white block">Obsidian Gold</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Matte Gold</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardDesign("royal-blue")}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                        cardDesign === "royal-blue"
                          ? "border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/30"
                          : isDark
                          ? "border-white/10 bg-white/5 hover:border-white/20"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0258A4] to-[#1E4FFF] border border-cyan-400/50 mx-auto mb-2 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-cyan-300" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white block">Royal Navy</span>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Cyan Accent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardDesign("silver-minimal")}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                        cardDesign === "silver-minimal"
                          ? "border-slate-500 bg-slate-500/10 ring-2 ring-slate-400/30"
                          : isDark
                          ? "border-white/10 bg-white/5 hover:border-white/20"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 border border-slate-300 mx-auto mb-2 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white block">Titanium</span>
                      <span className="text-[10px] text-slate-500 font-medium">Slate Silver</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Tautan Publik:</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">cardi.co.id/{username}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">ID Chip Fisik:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{tagId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Bonus Kuota:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>50 Koin MoM AI Gratis</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`w-1/3 py-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={isActivating}
                      className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                    >
                      {isActivating ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Menautkan Kartu ke Ekosistem...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selesaikan Aktivasi Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Live Card Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Preview Kartu Fisik</span>
              </span>

              {/* 3D Realistic Business Card Mockup */}
              <div
                className="w-full max-w-[340px] aspect-[1.586/1] rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-white/20 transition-all duration-300 flex flex-col justify-between"
                style={{
                  background:
                    cardDesign === "black-gold"
                      ? "linear-gradient(135deg, #131722 0%, #090c13 50%, #030407 100%)"
                      : cardDesign === "royal-blue"
                      ? "linear-gradient(135deg, #03396c 0%, #011f4b 50%, #00122e 100%)"
                      : "linear-gradient(135deg, #272e3f 0%, #171d2b 50%, #0e121b 100%)",
                }}
              >
                {/* Metallic Sheen Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                {/* Top Row: Logo & NFC Wave Icon */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logos/mom/icon-mom-app.png"
                      alt="Cardi MoM"
                      className="w-6 h-6 rounded-lg object-contain shadow-xs"
                    />
                    <span className="font-extrabold text-xs tracking-wider text-white">CARDI MOM</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-white/80">
                    <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest font-bold">NFC</span>
                  </div>
                </div>

                {/* Middle: User Info */}
                <div className="relative z-10 my-auto py-2">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-600 border border-white/40 shadow-inner mb-2 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full border border-black/30" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide leading-tight">
                    {fullName || "Nama Pemilik Kartu"}
                  </h3>
                  <p className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                    {headline || "Jabatan / Profesi"}
                  </p>
                  <p className="text-[10px] text-white/70">
                    {company || "Perusahaan / Brand"}
                  </p>
                </div>

                {/* Bottom Row: Chip ID & Tap Instruction */}
                <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-[10px]">
                  <span className="font-mono text-white/50">{tagId}</span>
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI MoM Enabled</span>
                  </span>
                </div>
              </div>

              {/* Commercial Value Proposition Box */}
              <div className={`mt-6 w-full max-w-[340px] border rounded-2xl p-4 text-xs space-y-2 ${
                isDark ? "bg-[#0E1A30] border-white/10 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-xs"
              }`}>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <span>Teknologi Smart Card Tanpa App</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kartu ini dapat dibaca oleh seluruh iPhone (XS ke atas) dan semua smartphone Android ber-NFC hanya dengan menempelkan kartu ke bodi belakang ponsel.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
