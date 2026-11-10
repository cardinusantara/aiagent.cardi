import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState, useRef } from "react";

import {
  CreditCard,
  Mic,
  Calendar,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Download,
  Check,
  Rotate3d,
  Layers,
  CalendarCheck,
  Cpu,
  Building,
  Users,
  MessageCircle,
  FileText,
  Clock,
  Play,
  Pause,
  Share2,
  Zap,
  Coins,
  Copy,
  HelpCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { CardiMomLogo, CardiMomIcon } from "@/components/mom/CardiMomLogo";
import EcosystemBar from "@/components/mom/EcosystemBar";

export default function HomePage() {
  const { theme, toggleTheme, locale, toggleLocale } = useAppStore();
  const isDark = theme === "dark";

  // 3D Card Interactive Preview
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [cardFinish, setCardFinish] = useState<"onyx" | "cyan" | "titanium">("onyx");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  // Live Tap Simulator
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [tapStatus, setTapStatus] = useState<"idle" | "tapping" | "done">("idle");

  // Interactive Live MoM Demo Player
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState<1 | 2 | 3 | 4>(4);
  const [demoTab, setDemoTab] = useState<"summary" | "decisions" | "actions" | "whatsapp">("summary");
  const [demoCopied, setDemoCopied] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotX(-((y - centerY) / centerY) * 14);
    setRotY(((x - centerX) / centerX) * 16);
  };

  const handleCardMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  const triggerTapSimulation = () => {
    setTapStatus("tapping");
    setIsSimulatingTap(true);
    setTimeout(() => {
      setTapStatus("done");
      setTimeout(() => {
        setTapStatus("idle");
        setIsSimulatingTap(false);
      }, 3500);
    }, 700);
  };

  const runDemoPipeline = () => {
    setDemoRunning(true);
    setDemoStep(1);
    setTimeout(() => {
      setDemoStep(2);
      setTimeout(() => {
        setDemoStep(3);
        setTimeout(() => {
          setDemoStep(4);
          setDemoRunning(false);
        }, 800);
      }, 900);
    }, 900);
  };

  const copyWhatsAppSample = () => {
    const sample = `*NOTULA RESMI CARDI MOM: RAPAT KEMITRAAN EKSEKUTIF*\n📅 Tanggal: Hari Ini | ⏱️ Durasi: 24 Menit\n👥 Peserta: Deo Cardi Nathanael (CEO), Reza Pratama (Managing Director)\n\n*RINGKASAN EKSEKUTIF:*\nPertemuan menyepakati implementasi 50 unit Cardi Smart NFC Card untuk jajaran eksekutif, integrasi AI MoM dengan WhatsApp corporate, dan uji coba pilot 14 hari.\n\n*KEPUTUSAN RAPAT:*\n• Mengadopsi Cardi Smart NFC Card sebagai standar ID bisnis eksekutif.\n• Menghubungkan seluruh meeting komersial dengan notula AI otomatis.\n\n*ACTION ITEMS:*\n[ ] Kirim final invoice paket tim 50 kartu NFC (PIC: Tim Cardi)\n[ ] Sinkronisasi kalender tim ke Google Workspace (PIC: Reza Pratama)\n\n_Dibuat otomatis via Cardi Smart NFC & AI MoM (cardi.co.id)_`;
    navigator.clipboard.writeText(sample);
    setDemoCopied(true);
    setTimeout(() => setDemoCopied(false), 2000);
  };

  const finishDetails = {
    onyx: {
      name: "Onyx Matte Gold",
      bg: "linear-gradient(135deg, #131722 0%, #090c13 50%, #030407 100%)",
      accent: "text-amber-400",
      border: "border-amber-400/30",
    },
    cyan: {
      name: "Royal Cyan Blue",
      bg: "linear-gradient(135deg, #03396c 0%, #011f4b 50%, #00122e 100%)",
      accent: "text-sky-400",
      border: "border-sky-400/40",
    },
    titanium: {
      name: "Titanium Slate",
      bg: "linear-gradient(135deg, #272e3f 0%, #171d2b 50%, #0e121b 100%)",
      accent: "text-slate-200",
      border: "border-slate-400/30",
    },
  }[cardFinish];

  const faqs = [
    {
      q: "Apakah lawan bicara perlu menginstal aplikasi untuk membaca kartu nama NFC?",
      a: "Sama sekali tidak. Kartu nama pintar Cardi Smart NFC menggunakan standar web terbuka ISO/IEC 14443-A. Begitu kartu ditempelkan ke bodi iPhone atau smartphone Android klien, peramban (browser) otomatis terbuka menampilkan profil profesional Anda, tombol simpan kontak .vcf, tautan WhatsApp, dan jadwal pertemuan tanpa instalasi aplikasi apapun.",
    },
    {
      q: "Bagaimana cara kerja notula rapat AI MoM?",
      a: "Anda dapat merekam suara rapat tatap muka langsung dari browser web dashboard Cardi maupun melalui aplikasi mobile Cardi MoM di ponsel Anda. AI canggih berbasis model suara generasi terbaru akan mentranskripsi percakapan ke bahasa Indonesia formal, merangkum poin esensial, mengekstrak keputusan penting, dan memetakan tugas (action items) beserta PIC dan deadline secara otomatis.",
    },
    {
      q: "Berapa kebutuhan koin untuk setiap rapat?",
      a: "Satu sesi rapat membutuhkan rata-rata 5-10 koin tergantung durasi percakapan. 1 Koin bernilai Rp 180. Setiap pembelian kartu fisik sudah dilengkapi kuota koin awal, dan saldo koin tidak memiliki masa kedaluwarsa (hangus) sehingga dapat digunakan kapan pun.",
    },
    {
      q: "Bagaimana dengan integrasi Google Calendar dan WhatsApp?",
      a: "Seluruh action items yang dihasilkan oleh AI MoM dapat langsung disinkronkan ke akun Google Calendar kedua belah pihak hanya dengan 1-klik. Selain itu, Anda dapat membagikan ringkasan notula resmi yang telah diformat rapi dengan bullet points langsung ke grup WhatsApp tim atau klien.",
    },
    {
      q: "Apakah kartu fisik NFC aman dan tahan lama?",
      a: "Sangat aman. Kartu ditenagai chip NXP NTAG215 orisinil dengan kapasitas memori 504 Bytes tanpa baterai. Kartu tahan air, tahan panas, dan memiliki daya tahan lebih dari 100.000 kali tap. Di bagian belakang kartu juga dilengkapi kode QR laser-engraved sebagai cadangan untuk smartphone yang belum memiliki sensor NFC aktif.",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#090D16] text-white selection:bg-sky-500 selection:text-white"
          : "bg-[#F8FAFD] text-[#0A1633] selection:bg-sky-500 selection:text-white"
      }`}
    >
      {/* 00. Top Ecosystem Bar */}
      <EcosystemBar />

      {/* 01. Sticky Header / Navbar */}
      <header className="sticky top-2 z-50 max-w-6xl mx-auto px-4 w-full">
        <div
          className={`backdrop-blur-xl border rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg transition-colors ${
            isDark
              ? "bg-[#0E1626]/90 border-white/10 shadow-black/40"
              : "bg-white/95 border-[#E6ECF7] shadow-[0_10px_30px_rgba(10,22,51,0.05)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <Link href="/mom/card" className="flex items-center">
              <CardiMomLogo
                size="sm"
                colorMode={isDark ? "dark" : "light"}
                showTagline={false}
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav
            className={`hidden md:flex items-center gap-6 text-[13px] font-semibold ${
              isDark ? "text-slate-300" : "text-[#3D4B6B]"
            }`}
          >
            <a href="#fitur" className="hover:text-sky-600 transition">
              Fitur Kartu
            </a>
            <a href="#alur-kerja" className="hover:text-sky-600 transition">
              Alur Notula AI
            </a>
            <a href="#demo-mom" className="hover:text-sky-600 transition flex items-center gap-1 text-[#0258A4] dark:text-[#38bdf8]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo AI</span>
            </a>
            <a href="#google-calendar" className="hover:text-sky-600 transition">
              Integrasi Google
            </a>
            <a href="#harga" className="hover:text-sky-600 transition">
              Paket Harga
            </a>
            <a href="#faq" className="hover:text-sky-600 transition">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/mom/login"
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition border ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800"
              }`}
            >
              Masuk Akun
            </Link>

            <Link
              href="/mom/activate"
              className="bg-gradient-to-r from-[#0258A4] to-[#1E4FFF] hover:from-[#01417A] hover:to-[#0258A4] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <span>Aktivasi Kartu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 02. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Subtle Brand Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-sky-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold tracking-wide uppercase mb-4 ${
                  isDark
                    ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                    : "bg-[#EEF4FF] border-[#1E4FFF]/25 text-[#1E4FFF]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E4FFF]" />
                <span>AI MEETING INTELLIGENCE + SMART NFC</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[44px] font-black tracking-tight leading-[1.15] mb-4 text-[#0A1633] dark:text-white">
                Satu Tap Kartu, <br />
                <span className="text-[#0258A4] dark:text-[#38bdf8]">
                  Simpan Kontak
                </span>{" "}
                &amp; Rekam Notula Rapat AI.
              </h1>

              <p
                className={`text-base leading-relaxed mb-7 max-w-xl ${
                  isDark ? "text-slate-300" : "text-[#3D4B6B]"
                }`}
              >
                Tinggalkan kartu nama kertas kuno. Cardi menggabungkan kartu bisnis NFC fisik kelas eksekutif dengan kecerdasan AI MoM. Simpan kontak (.vcf) instan, sinkronisasi jadwal Google Calendar, rekam percakapan rapat, dan bagikan notula resmi ke WhatsApp tanpa catat manual.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
                <Link
                  href="/mom/activate"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0258A4] via-[#1E4FFF] to-[#00C2D1] hover:brightness-110 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Radio className="w-4 h-4 text-cyan-200 animate-pulse" />
                  <span>Aktivasi Kartu Fisik</span>
                </Link>

                <Link
                  href="/mom/deo"
                  target="_blank"
                  className={`w-full sm:w-auto border px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border-white/15 text-white"
                      : "bg-white hover:bg-slate-50 border-[#E6ECF7] text-[#0A1633]"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#0258A4]" />
                  <span>Coba Demo Profil Deo</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div
                className={`pt-5 border-t w-full flex flex-wrap items-center gap-5 text-xs font-semibold ${
                  isDark ? "border-white/10 text-slate-400" : "border-[#E6ECF7] text-[#6B7A9C]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00A87E]" />
                  <span>Chip NXP NTAG215 (504 Bytes)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-[#1E4FFF]" />
                  <span>Google Calendar Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#00C2D1]" />
                  <span>iOS &amp; Android Tanpa Aplikasi</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Physical Card Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Card Controls */}
              <div className="flex items-center justify-between w-full max-w-md mb-3 px-1">
                <div className="flex items-center gap-1">
                  {(["onyx", "cyan", "titanium"] as const).map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setCardFinish(finish)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        cardFinish === finish
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40"
                          : isDark
                          ? "bg-white/5 border-white/10 text-slate-400"
                          : "bg-white border-slate-200 text-slate-600 shadow-2xs"
                      }`}
                    >
                      {finish === "onyx" ? "Onyx Gold" : finish === "cyan" ? "Royal Cyan" : "Titanium"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCardSide(cardSide === "front" ? "back" : "front")}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/15 text-slate-300"
                      : "bg-white border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-50"
                  }`}
                >
                  <Rotate3d className="w-3.5 h-3.5 text-sky-500" />
                  <span>Putar Kartu</span>
                </button>
              </div>

              {/* 3D Card Mockup */}
              <div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
                className={`w-full max-w-md aspect-[1.586/1] rounded-[24px] p-6 relative overflow-hidden shadow-2xl border ${finishDetails.border} select-none flex flex-col justify-between`}
              >
                {/* Metallic Background */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{ background: finishDetails.bg }}
                />

                {/* Specular sheen reflection */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-gradient-to-tr from-transparent via-white/15 to-transparent"
                  style={{
                    transform: `translateX(${rotY * 4}%) translateY(${rotX * 4}%)`,
                  }}
                />

                {cardSide === "front" ? (
                  /* FRONT FACE */
                  <>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/logos/mom/logo-mom-card.png"
                          alt="Cardi Agent MoM"
                          className="h-6 sm:h-7 object-contain drop-shadow-xs"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-white/80">
                        <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span className="text-[10px] font-mono tracking-widest font-bold">
                          NFC
                        </span>
                      </div>
                    </div>

                    {/* Chip & Holder Info */}
                    <div className="relative z-10 my-auto py-1">
                      <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-600 border border-white/40 shadow-inner flex items-center justify-around px-1 mb-3">
                        <div className="w-[1px] h-full bg-black/20" />
                        <div className="w-3.5 h-3.5 rounded-full border border-black/30 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                        </div>
                        <div className="w-[1px] h-full bg-black/20" />
                      </div>

                      <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                        Deo Cardi Nathanael
                      </h3>
                      <p className="text-xs text-cyan-300 font-semibold mt-0.5">
                        Chief Executive Officer
                      </p>
                      <p className="text-[11px] text-white/70">
                        Cardi Nusantara AI
                      </p>
                    </div>

                    <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-[10px]">
                      <span className="font-mono text-white/60">
                        cardi.co.id/deo
                      </span>
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI MoM Enabled</span>
                      </span>
                    </div>
                  </>
                ) : (
                  /* BACK FACE */
                  <>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-mono tracking-widest text-white/50">
                        ISO/IEC 14443-A
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded">
                        NXP NTAG215 • 504B
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center justify-center my-auto">
                      <div className="w-24 h-24 rounded-2xl bg-white p-2.5 shadow-2xl flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                          <rect width="24" height="24" fill="white" />
                          <path
                            fill="#0A1633"
                            d="M2 2h7v7H2V2zm2 2v3h3V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm7-13h2v2h-2V4zm0 4h2v2h-2V8zm4 7h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-4h2v2h-2v-2zm-6-3h2v2h-2v-2zm0 4h2v2h-2v-2zm6-4h2v2h-2v-2zm0 6h2v2h-2v-2z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/10 text-[10px] text-white/60 font-mono">
                      <span>TAP TO CONNECT WITH PHONE</span>
                      <span className="text-emerald-400 font-bold">READY</span>
                    </div>
                  </>
                )}
              </div>

              {/* Tap Simulation Trigger */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={triggerTapSimulation}
                  disabled={isSimulatingTap}
                  className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-600 dark:text-sky-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>
                    {tapStatus === "tapping"
                      ? "Mendekatkan Kartu ke HP..."
                      : tapStatus === "done"
                      ? "Tap Berhasil! Profil Terbuka"
                      : "Coba Simulasi Tap Kartu"}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03. 4-STEP WORKFLOW (ALUR KERJA NOTULA AI) */}
      <section id="alur-kerja" className="py-16 md:py-24 border-t border-b border-[#E6ECF7] dark:border-white/10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold mb-3 uppercase tracking-wider">
              <span>Alur Kerja Rapat AI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              Dari Sekali Tap Kartu, Sampai Action Items Terdistribusi
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-[#3D4B6B]"}`}>
              Tanpa perlu aplikasi tambahan bagi lawan bicara. Semua proses berjalan instan, teratur, dan otomatis terhubung ke ekosistem kerja tim Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-3xl border transition ${isDark ? "bg-[#0E1A30]/70 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold mb-2">Tap Kartu ke Ponsel</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Dekatkan kartu fisik ke bodi iPhone atau Android. Browser otomatis membuka profil eksekutif Anda tanpa perlu mengetik nomor manual.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border transition ${isDark ? "bg-[#0E1A30]/70 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold mb-2">Simpan Kontak vCard</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Lawan bicara mengklik &ldquo;Simpan Kontak&rdquo; dan seluruh nomor telepon, email, WhatsApp, dan perusahaan Anda langsung tersimpan di kontak HP.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border transition ${isDark ? "bg-[#0E1A30]/70 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold mb-2">Rekam Rapat &amp; AI MoM</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Mulai rekaman suara pertemuan tatap muka. Mesin AI MoM langsung mentranskripsi dan merangkum keputusan rapat beserta PIC-nya.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border transition ${isDark ? "bg-[#0E1A30]/70 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold mb-2">Auto Google Calendar</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Tindak lanjut otomatis terjadwal di Google Calendar kedua belah pihak dan notula resmi siap dibagikan ke grup WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04. INTERACTIVE LIVE MOM DEMO PLAYER */}
      <section id="demo-mom" className="py-16 md:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-[#070D1E]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Interaktif Rapat AI</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              Lihat Bagaimana AI MoM Mengubah Percakapan Rapat Jadi Tindakan
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Coba simulasi pemrosesan transkripsi dan ekstraksi notulen otomatis dari rekaman rapat bisnis berikut:
            </p>
          </div>

          <div className={`rounded-3xl border p-6 sm:p-8 max-w-4xl mx-auto shadow-xl transition bg-white dark:bg-[#0E1A30] ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            {/* Audio Wave & Trigger Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${
              isDark ? "bg-[#070F1E] border-white/10" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-3.5">
                <button
                  onClick={runDemoPipeline}
                  disabled={demoRunning}
                  className="w-12 h-12 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20 transition cursor-pointer"
                  title="Putar Simulasi Audio Rapat"
                >
                  {demoRunning ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  )}
                </button>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sample Audio: Rapat Kemitraan Eksekutif Cardi (24 Menit)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {demoRunning
                      ? demoStep === 1
                        ? "🎙️ Membaca rekaman suara audio..."
                        : demoStep === 2
                        ? "⚡ Mentranskripsi pembicaraan..."
                        : "🤖 Mengekstrak ringkasan, keputusan & action items..."
                      : "Klik tombol play untuk menjalankan simulasi pemrosesan AI"}
                  </p>
                </div>
              </div>

              {/* Animated Waveform */}
              <div className="flex items-center gap-1 h-8 px-2">
                {[12, 24, 16, 28, 20, 14, 30, 22, 18, 26, 15, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: demoRunning ? `${h}px` : "8px" }}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      demoRunning ? "bg-sky-500 animate-pulse" : "bg-slate-300 dark:bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Results Tabs */}
            <div className="space-y-4">
              <div className={`flex border-b text-xs font-bold gap-6 ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <button
                  onClick={() => setDemoTab("summary")}
                  className={`pb-3 border-b-2 transition cursor-pointer ${
                    demoTab === "summary"
                      ? "border-sky-600 text-sky-600 dark:text-sky-400"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  Ringkasan Eksekutif
                </button>
                <button
                  onClick={() => setDemoTab("decisions")}
                  className={`pb-3 border-b-2 transition cursor-pointer ${
                    demoTab === "decisions"
                      ? "border-sky-600 text-sky-600 dark:text-sky-400"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  Keputusan Rapat (2)
                </button>
                <button
                  onClick={() => setDemoTab("actions")}
                  className={`pb-3 border-b-2 transition cursor-pointer ${
                    demoTab === "actions"
                      ? "border-sky-600 text-sky-600 dark:text-sky-400"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  Action Items &amp; PIC (2)
                </button>
                <button
                  onClick={() => setDemoTab("whatsapp")}
                  className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    demoTab === "whatsapp"
                      ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Format WhatsApp</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className={`p-5 rounded-2xl border text-xs leading-relaxed ${
                isDark ? "bg-[#070F1E] border-white/10" : "bg-slate-50 border-slate-200"
              }`}>
                {demoTab === "summary" && (
                  <div className="space-y-3">
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Ringkasan Eksekutif:</strong> Pertemuan antara <strong>Deo Cardi Nathanael (CEO Cardi Nusantara)</strong> dan <strong>Reza Pratama (Managing Director)</strong> berjalan lancar. Kedua belah pihak menyepakati pengadaan 50 unit Cardi Smart NFC Card untuk jajaran eksekutif dan manajerial, didukung asisten AI MoM untuk memangkas waktu pembuatan notula manual hingga 85%.
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Model: <strong>cardi-ai-voice-v2</strong></span>
                      <span>•</span>
                      <span>Akurasi: <strong>99.4%</strong></span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">Terverifikasi Otomatis</span>
                    </div>
                  </div>
                )}

                {demoTab === "decisions" && (
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Mengadopsi Cardi Smart NFC Card sebagai standar resmi networking dan ID eksekutif perusahaan.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        Mengintegrasikan notula AI MoM dengan alur distribusi grup WhatsApp internal dan kalender kerja.
                      </p>
                    </div>
                  </div>
                )}

                {demoTab === "actions" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">[Action Item] Kirimkan invoice dan proposal teknis 50 kartu NFC</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">PIC: Deo Cardi Nathanael • Deadline: 2 hari lagi</div>
                      </div>
                      <span className="text-[10px] font-bold bg-sky-500/10 text-sky-600 px-2 py-1 rounded-full">Google Cal Ready</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">[Action Item] Jadwalkan sesi onboarding batch 1 bersama tim sales</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">PIC: Reza Pratama • Deadline: 4 hari lagi</div>
                      </div>
                      <span className="text-[10px] font-bold bg-sky-500/10 text-sky-600 px-2 py-1 rounded-full">Google Cal Ready</span>
                    </div>
                  </div>
                )}

                {demoTab === "whatsapp" && (
                  <div className="space-y-3">
                    <div className="font-mono text-[11px] bg-white dark:bg-black/30 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
{`*NOTULA RESMI CARDI MOM: RAPAT KEMITRAAN EKSEKUTIF*
📅 Tanggal: Hari Ini | ⏱️ Durasi: 24 Menit
👥 Peserta: Deo Cardi Nathanael (CEO), Reza Pratama (Managing Director)

*RINGKASAN EKSEKUTIF:*
Pertemuan menyepakati implementasi 50 unit Cardi Smart NFC Card untuk jajaran eksekutif, integrasi AI MoM dengan WhatsApp corporate, dan uji coba pilot 14 hari.

*KEPUTUSAN RAPAT:*
• Mengadopsi Cardi Smart NFC Card sebagai standar ID bisnis eksekutif.
• Menghubungkan seluruh meeting komersial dengan notula AI otomatis.

*ACTION ITEMS:*
[ ] Kirim final invoice paket tim 50 kartu NFC (PIC: Tim Cardi)
[ ] Sinkronisasi kalender tim ke Google Workspace (PIC: Reza Pratama)

_Dibuat otomatis via Cardi Smart NFC & AI MoM (cardi.co.id)_`}
                    </div>
                    <button
                      onClick={copyWhatsAppSample}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {demoCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{demoCopied ? "Berhasil Disalin!" : "Salin Format WhatsApp"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. GOOGLE & CALENDAR INTEGRATION */}
      <section id="google-calendar" className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`rounded-3xl border p-8 md:p-12 relative overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-[#0E1A30] via-[#091122] to-[#050914] border-white/10"
                : "bg-gradient-to-br from-sky-50/70 via-white to-slate-50 border-[#E6ECF7] shadow-sm"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-bold mb-4">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Google Identity &amp; Calendar API</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
                  Terhubung Langsung dengan Akun Google &amp; Kalender Kerja Anda
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-[#3D4B6B]"}`}>
                  Satu akun Google untuk masuk ke portal kartu NFC web, menyinkronkan agenda ke Google Calendar, dan menyelaraskan rekaman rapat ke aplikasi mobile Cardi MoM.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">
                      <strong>Single Sign-On Google:</strong> Otentikasi aman tanpa ribet verifikasi berulang.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">
                      <strong>Auto-Sync Action Items ke Kalender:</strong> Tindak lanjut rapat otomatis terjadwal lengkap dengan tanggal tenggat dan PIC.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">
                      <strong>Jadwalkan Langsung dari Profil Tap:</strong> Siapapun yang men-tap kartu Anda dapat langsung memesan slot rapat di Google Calendar.
                    </span>
                  </div>
                </div>

                <Link
                  href="/mom/login"
                  className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-sky-600/25 transition cursor-pointer"
                >
                  <span>Masuk dengan Akun Google</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Graphic illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <div
                  className={`w-full max-w-sm border rounded-2xl p-5 shadow-xl ${
                    isDark ? "bg-[#070F1E] border-white/10" : "bg-white border-[#E6ECF7]"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Google Calendar</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                      Tersinkron
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/25 rounded-xl">
                      <div className="font-bold text-sky-700 dark:text-sky-300">Follow-up Demo Kemitraan</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Besok • 14:00 - 15:00 • Google Meet
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/25 rounded-xl">
                      <div className="font-bold text-purple-700 dark:text-purple-300">[Action Item] Kirim Proposal</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        PIC: Tim Bisnis • Otomatis dari MoM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. HARDWARE SPECS (NXP NTAG215) */}
      <section id="spesifikasi" className="py-16 md:py-24 border-t border-[#E6ECF7] dark:border-white/10 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Standar Perangkat Keras Industri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Spesifikasi Fisik Chip NXP NTAG215
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">504 B</div>
              <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Kapasitas Memori</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Chip NXP Original</div>
            </div>

            <div className={`p-5 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">0 mAh</div>
              <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Tanpa Baterai</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ditenagai Medan NFC HP</div>
            </div>

            <div className={`p-5 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">100k+</div>
              <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Daya Tahan Tap</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Garansi Chip Awet</div>
            </div>

            <div className={`p-5 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E6ECF7] shadow-xs"}`}>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">99.8%</div>
              <div className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Kompatibilitas HP</div>
              <div className="text-[11px] text-slate-400 mt-0.5">iPhone &amp; Android</div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. PRICING & PACKAGES SECTION (OFFICIAL ECOSYSTEM PRICES) */}
      <section id="harga" className="py-16 md:py-24 border-t border-[#E6ECF7] dark:border-white/10 relative bg-slate-50/40 dark:bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-3 uppercase tracking-wider">
              <span>Paket Kartu &amp; Koin MoM</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">
              Investasi Satu Kali, Produktivitas Berkelanjutan
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-[#3D4B6B]"}`}>
              Dapatkan kartu fisik NFC berstandar industri lengkap dengan saldo koin MoM untuk pembuatan notulen meeting otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Card */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition bg-white dark:bg-[#0E1A30] ${
              isDark ? "border-white/10" : "border-slate-200 shadow-xs"
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Starter Pack
                </span>
                <h3 className="text-xl font-black mt-1 mb-2 text-slate-900 dark:text-white">
                  Kartu Matte PVC
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">Rp 149.000</span>
                  <span className="text-xs text-slate-500">/ kartu</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Pilihan sempurna bagi profesional mandiri dan eksekutif muda yang ingin memulai networking pintar.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Kartu Fisik Matte PVC + Chip NTAG215</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Bonus 500 Koin MoM</strong> (~100x rapat)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Profil vCard &amp; Unlimited Tap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Integrasi Google Calendar</span>
                  </div>
                </div>
              </div>

              <Link
                href="/mom/activate"
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white flex items-center justify-center gap-1.5 transition"
              >
                <span>Aktivasi / Beli Starter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Executive Card (Popular) */}
            <div className="p-7 rounded-3xl border-2 border-[#1E4FFF] shadow-xl shadow-blue-500/10 flex flex-col justify-between relative bg-white dark:bg-[#0E1A30]">
              <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#0258A4] to-[#1E4FFF] text-white text-[10.5px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Paling Diminati
              </span>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Executive Metal
                </span>
                <h3 className="text-xl font-black mt-1 mb-2 text-slate-900 dark:text-white">
                  Titanium / Obsidian
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">Rp 299.000</span>
                  <span className="text-xs text-slate-500">/ kartu</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Finishing logam mewah dengan bobot premium untuk CEO, Founder, dan Partner bisnis terdepan.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Kartu Logam Metalik + Laser Engraved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Bonus 1.000 Koin MoM</strong> (~200x rapat)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Prioritas Pemrosesan AI Model Voice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Auto Dispatch Notula ke WhatsApp</span>
                  </div>
                </div>
              </div>

              <Link
                href="/mom/activate"
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0258A4] to-[#1E4FFF] hover:brightness-110 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition"
              >
                <span>Pesan Edisi Executive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Enterprise / Corporate */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition bg-white dark:bg-[#0E1A30] ${
              isDark ? "border-white/10" : "border-slate-200 shadow-xs"
            }`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Custom Corporate
                </span>
                <h3 className="text-xl font-black mt-1 mb-2 text-slate-900 dark:text-white">
                  Solusi Tim &amp; Perusahaan
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">Custom</span>
                  <span className="text-xs text-slate-500">/ organisasi</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Desain kartu kustom logo perusahaan, domain khusus (cards.perusahaan.com), dan integrasi CRM.
                </p>

                <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Kartu Custom Brand Logo &amp; Color Scheme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited Pool Koin MoM untuk Seluruh Tim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Admin Central Dashboard &amp; Lead Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Integrasi API / Webhook ke CRM</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/6281289895646?text=Halo%20Cardi%2C%20saya%20ingin%20konsultasi%20paket%20NFC%20Smart%20Card%20dan%20MoM%20untuk%20tim%20perusahaan."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white flex items-center justify-center gap-1.5 transition"
              >
                <span>Konsultasi dengan Tim Cardi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 08. INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-16 md:py-24 border-t border-[#E6ECF7] dark:border-white/10 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold mb-3 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pertanyaan Umum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Semua yang Perlu Anda Ketahui
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl transition bg-white dark:bg-[#0E1A30] overflow-hidden ${
                  openFaq === i
                    ? "border-sky-500 shadow-sm"
                    : "border-slate-200 dark:border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180 text-sky-600" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. COMPANION MOBILE APP (Cardi MoM) */}
      <section className="py-16 md:py-24 border-t border-[#E6ECF7] dark:border-white/10 relative text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center justify-center mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/mom/icon-mom-app.png"
              alt="Cardi Agent MoM"
              className="w-24 sm:w-28 h-24 sm:h-28 rounded-3xl object-contain drop-shadow-xl"
            />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">
            Aplikasi Mobile Pendamping di Saku Anda
          </h2>
          <p className={`text-sm leading-relaxed max-w-xl mx-auto mb-8 ${isDark ? "text-slate-300" : "text-[#3D4B6B]"}`}>
            Buka Play Store atau App Store, unduh Cardi MoM, dan nikmati sinkronisasi 2 arah antara kartu fisik NFC dan smartphone Anda.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div
              className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E6ECF7] text-slate-900 shadow-xs"
              }`}
            >
              <Smartphone className="w-6 h-6 text-sky-600" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Tersedia di
                </div>
                <div className="text-xs font-black">Google Play Store</div>
              </div>
            </div>

            <div
              className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${
                isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E6ECF7] text-slate-900 shadow-xs"
              }`}
            >
              <Smartphone className="w-6 h-6 text-cyan-600" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Tersedia di
                </div>
                <div className="text-xs font-black">Apple App Store</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE RICH FOOTER (Matched to aiagent main & mom.astro) */}
      <footer
        className={`border-t py-14 text-xs transition-colors ${
          isDark
            ? "border-white/10 bg-[#05080E] text-slate-400"
            : "border-[#E6ECF7] bg-white text-[#3D4B6B]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} />
              <p className="text-xs leading-relaxed opacity-80">
                Solusi AI Meeting Intelligence dan Smart Business Card NFC pertama di Indonesia. Mengubah setiap percakapan rapat menjadi tindakan nyata.
              </p>
              <div className="pt-2 text-[11px] opacity-70">
                <p className="font-semibold text-slate-900 dark:text-white">PT Digital Cardi Nusantara</p>
                <p>Jakarta Selatan, DKI Jakarta 12190</p>
                <p className="mt-1">Email: contact@cardi.co.id</p>
              </div>
            </div>

            {/* Col 2: Produk Ekosistem */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Produk Ekosistem
              </h4>
              <ul className="space-y-1.5 opacity-80">
                <li><Link href="/mom/dashboard/card" className="hover:text-sky-600 transition">Cardi Smart NFC Card</Link></li>
                <li><Link href="/mom/dashboard/mom" className="hover:text-sky-600 transition">Cardi MoM AI Assistant</Link></li>
                <li><Link href="/mom/dashboard/calendar" className="hover:text-sky-600 transition">Google Calendar Sync</Link></li>
                <li><Link href="/mom/dashboard/wallet" className="hover:text-sky-600 transition">Sistem Koin &amp; Dompet</Link></li>
              </ul>
            </div>

            {/* Col 3: Integrasi & Solusi */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Integrasi &amp; Hardware
              </h4>
              <ul className="space-y-1.5 opacity-80">
                <li><span>NXP NTAG215 ISO 14443-A</span></li>
                <li><span>Google OAuth 2.0 &amp; Meet</span></li>
                <li><span>Ekspor Kontak vCard (.vcf)</span></li>
                <li><span>Notula WhatsApp Auto Dispatch</span></li>
                <li><span>Perekam Suara Web Audio API</span></li>
              </ul>
            </div>

            {/* Col 4: Navigasi & Keamanan */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Akses &amp; Layanan
              </h4>
              <ul className="space-y-1.5 opacity-80">
                <li><Link href="/mom/activate" className="hover:text-sky-600 transition">Aktivasi Kartu Baru</Link></li>
                <li><Link href="/mom/login" className="hover:text-sky-600 transition">Login Akun Google</Link></li>
                <li><Link href="/mom/deo" className="hover:text-sky-600 transition">Demo Hasil Tap Kartu</Link></li>
                <li><a href="https://wa.me/6281289895646" target="_blank" rel="noreferrer" className="hover:text-sky-600 transition">Konsultasi via WhatsApp</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-70">
            <p>&copy; 2026 PT Digital Cardi Nusantara. Seluruh hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-4 font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistem Operasional Normal</span>
              </span>
              <span>•</span>
              <span>Enkripsi TLS 256-Bit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
