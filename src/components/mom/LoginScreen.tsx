import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState } from "react";


import {
  Smartphone,
  Mail,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Lock,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { cardiApi } from "@/lib/mom/api";
import { CardiMomLogo } from "@/components/mom/CardiMomLogo";
import GoogleSignInButton from "@/components/mom/GoogleSignInButton";
import EcosystemBar from "@/components/mom/EcosystemBar";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginUser,
    loginWithGoogle,
    theme,
    toggleTheme,
    locale,
    toggleLocale,
  } = useAppStore();

  const isDark = theme === "dark";

  const [authMethod, setAuthMethod] = useState<"qr" | "email">("qr");

  // QR Pairing State
  const [pairingCode, setPairingCode] = useState("892-415");
  const [isVerifyingPairing, setIsVerifyingPairing] = useState(false);

  // Email OTP State
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Google Sign In Success
  const handleGoogleSuccess = (userData: {
    email: string;
    name: string;
    avatarUrl?: string;
    sessionToken: string;
  }) => {
    setSuccessMessage(`Berhasil masuk sebagai ${userData.name}!`);
    loginWithGoogle(
      {
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      },
      userData.sessionToken
    );

    setTimeout(() => {
      router.push("/mom/dashboard/card");
    }, 400);
  };

  // Handle simulate QR confirmation from mobile app
  const handleConfirmMobilePairing = () => {
    setIsVerifyingPairing(true);
    setTimeout(() => {
      setIsVerifyingPairing(false);
      loginUser("deo");
      router.push("/mom/dashboard/card");
    }, 800);
  };

  // Handle Send OTP
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await cardiApi.requestEmailOtp(email);
      setIsOtpSent(true);
    } catch {
      setErrorMessage("Gagal mengirim kode OTP. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await cardiApi.verifyEmailOtp(email, otpCode);
      const prefix = email.split("@")[0] || "user";
      loginUser(prefix);
      router.push("/mom/dashboard/card");
    } catch {
      setErrorMessage("Kode OTP salah atau telah kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? "bg-[#090D16] text-white selection:bg-sky-500 selection:text-white"
          : "bg-[#F8FAFD] text-slate-900 selection:bg-sky-500 selection:text-white"
      }`}
    >
      <EcosystemBar />
      {/* Top Header */}
      <header
        className={`border-b backdrop-blur-md sticky top-0 z-40 transition-colors ${
          isDark
            ? "border-white/10 bg-[#0B1528]/80"
            : "border-slate-200 bg-white/90 shadow-xs"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/mom/card" className="flex items-center">
            <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} showTagline />
          </Link>

          <div className="flex items-center gap-3">
            {/* Locale & Theme Switcher */}
            <button
              onClick={toggleLocale}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                isDark
                  ? "bg-white/5 border-white/15 text-white/80 hover:bg-white/10"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span className="uppercase text-[11px] font-mono">{locale}</span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border transition ${
                isDark
                  ? "bg-white/5 border-white/15 text-amber-400 hover:bg-white/10"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <Link
              href="/mom/activate"
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 transition ml-2"
            >
              <span>Aktivasi Kartu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div
          className={`w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-xl relative transition-colors ${
            isDark
              ? "bg-[#0E1A30]/90 border-white/15 shadow-black/40"
              : "bg-white border-slate-200 shadow-slate-200/50"
          }`}
        >
          {/* Brand Logo from Official Assets */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3">
              <CardiMomLogo size="md" colorMode={isDark ? "dark" : "light"} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              {locale === "id"
                ? "Masuk ke Ekosistem Cardi MoM"
                : "Sign in to Cardi MoM"}
            </h1>
            <p
              className={`text-xs mt-1.5 max-w-xs mx-auto leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {locale === "id"
                ? "Terhubung langsung antara Web Smart NFC Card, Google Calendar, dan Aplikasi Mobile MoM."
                : "Connected between Web Smart NFC Card, Google Calendar, and Mobile MoM App."}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* PRIMARY: GOOGLE SIGN-IN */}
          <div className="space-y-4 mb-6">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={(err) => setErrorMessage(err)}
            />

            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
              <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {locale === "id" ? "atau akses alternatif" : "or alternative access"}
              </span>
              <div className={`flex-1 h-[1px] ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            </div>
          </div>

          {/* Secondary Methods Tabs */}
          <div className={`flex border-b mb-6 ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <button
              onClick={() => setAuthMethod("qr")}
              className={`flex-1 pb-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                authMethod === "qr"
                  ? "border-sky-600 text-sky-600 dark:text-sky-400"
                  : isDark
                  ? "border-transparent text-slate-400 hover:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{locale === "id" ? "Aplikasi Mobile" : "Mobile App"}</span>
            </button>

            <button
              onClick={() => setAuthMethod("email")}
              className={`flex-1 pb-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                authMethod === "email"
                  ? "border-sky-600 text-sky-600 dark:text-sky-400"
                  : isDark
                  ? "border-transparent text-slate-400 hover:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{locale === "id" ? "Email OTP Korporat" : "Corporate Email OTP"}</span>
            </button>
          </div>

          {/* Method: QR Device Pairing */}
          {authMethod === "qr" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Buka aplikasi <strong>Cardi MoM</strong> di ponsel Android/iOS Anda, pilih menu <strong>Tautkan Web</strong>, lalu masukkan kode:
              </p>

              <div
                className={`border px-6 py-3 rounded-2xl flex items-center gap-3 shadow-inner ${
                  isDark ? "bg-[#070F1E] border-white/20" : "bg-slate-100 border-slate-200"
                }`}
              >
                <span className="text-2xl font-mono font-black tracking-widest text-sky-600 dark:text-sky-400">
                  {pairingCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const r = Math.floor(100000 + Math.random() * 900000).toString();
                    setPairingCode(r.slice(0, 3) + "-" + r.slice(3));
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition p-1"
                  title="Acak kode baru"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmMobilePairing}
                disabled={isVerifyingPairing}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition disabled:opacity-50 cursor-pointer"
              >
                {isVerifyingPairing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi koneksi aplikasi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Konfirmasi Sambungkan dari Aplikasi Ponsel</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Method: Email OTP */}
          {authMethod === "email" && (
            <div>
              {!isOtpSent ? (
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <div>
                    <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Alamat Email Akun Anda
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-sky-500 transition ${
                        isDark
                          ? "bg-[#070F1E] border-white/15 text-white placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
                  >
                    {isLoading ? "Mengirim OTP..." : "Kirim 6-Digit Kode OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    Masukkan kode 6 digit yang dikirim ke <strong>{email}</strong>:
                  </p>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-center text-xl font-mono tracking-widest text-sky-600 focus:outline-none focus:border-sky-500 transition ${
                        isDark
                          ? "bg-[#070F1E] border-white/15"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
                  >
                    {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Security & Corporate Disclaimer */}
          <div className={`mt-6 pt-5 border-t text-center text-[11px] space-y-1.5 ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              Portal Akses Manajemen Eksekutif • PT Cardi Nusantara Kreasi
            </p>
            <p className="text-[10.5px] opacity-75">
              Sistem Keamanan Akses Terverifikasi &amp; Perlindungan Kerahasiaan Data Rapat
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-[11px]">
              <Link href="/mom/activate" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
                Aktivasi Chip NFC
              </Link>
              <span className="opacity-30">•</span>
              <Link href="/mom/card" className="hover:underline opacity-80 hover:opacity-100">
                Kembali ke Info Kartu
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
