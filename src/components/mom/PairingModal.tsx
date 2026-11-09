"use client";

import React, { useState } from "react";
import {
  Smartphone,
  QrCode,
  Mail,
  CheckCircle,
  Copy,
  RefreshCw,
  X,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import { cardiApi } from "@/lib/mom/api";

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PairingModal({ isOpen, onClose }: PairingModalProps) {
  const { account, setPairedApp, updateCoinBalance } = useAppStore();
  const [tab, setTab] = useState<"qr" | "email">("qr");
  
  // QR / Code pairing state
  const [pairingCode, setPairingCode] = useState("892-415");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email OTP state
  const [emailInput, setEmailInput] = useState(account.email || "");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  if (!isOpen) return null;

  const handleRefreshCode = async () => {
    setIsRefreshing(true);
    try {
      const res = await cardiApi.requestPairingCode();
      setPairingCode(res.code.slice(0, 3) + "-" + res.code.slice(3));
    } catch {
      // fallback
      const rand = Math.floor(100000 + Math.random() * 900000).toString();
      setPairingCode(rand.slice(0, 3) + "-" + rand.slice(3));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSimulateDevicePairing = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPairedApp({
        deviceId: "dev_samsung_s24",
        deviceModel: "Samsung Galaxy S24 Ultra (Cardi MoM App)",
        pairedAt: new Date().toISOString(),
      });
      updateCoinBalance(200); // synced with mobile wallet
      setSuccessMessage("Aplikasi MoM Mobile berhasil terhubung! Koin disinkronkan.");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setEmailLoading(true);
    await cardiApi.requestEmailOtp(emailInput);
    setEmailLoading(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    setEmailLoading(true);
    try {
      const res = await cardiApi.verifyEmailOtp(emailInput, otpInput);
      setPairedApp({
        deviceId: "dev_email_sync",
        deviceModel: `Akun Terverifikasi (${emailInput})`,
        pairedAt: new Date().toISOString(),
      });
      updateCoinBalance(res.account.coinBalance || 250);
      setSuccessMessage("Akun email MoM tersambung dengan sukses!");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDisconnect = () => {
    setPairedApp(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#18181b] border border-white/15 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#3b7cfa]/20 border border-[#3b7cfa]/40 flex items-center justify-center text-[#3b7cfa]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Koneksi Aplikasi Cardi MoM
            </h2>
            <p className="text-xs text-white/60">
              Sinkronkan akun, koin &amp; notula dari Play Store / App Store
            </p>
          </div>
        </div>

        {/* Current Connection Status */}
        {account.pairedApp ? (
          <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#10b981]">Terhubung Aktif</p>
                <p className="text-[11px] text-white/80">{account.pairedApp.deviceModel}</p>
                <p className="text-[10px] text-white/50">
                  Ditautkan: {new Date(account.pairedApp.pairedAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition"
            >
              Putuskan
            </button>
          </div>
        ) : (
          /* Method Switcher Tabs */
          <div className="flex border-b border-white/10 mb-5">
            <button
              onClick={() => setTab("qr")}
              className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                tab === "qr"
                  ? "border-[#3b7cfa] text-[#3b7cfa]"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Kode Pairing / QR</span>
            </button>
            <button
              onClick={() => setTab("email")}
              className={`flex-1 pb-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
                tab === "email"
                  ? "border-[#3b7cfa] text-[#3b7cfa]"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Akun MoM</span>
            </button>
          </div>
        )}

        {/* Tab 1: QR & 6-Digit Pairing Code */}
        {!account.pairedApp && tab === "qr" && (
          <div className="flex flex-col items-center text-center">
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              Buka aplikasi <strong>Cardi MoM</strong> di Android / iPhone Anda, pilih menu <strong>Pengaturan &rarr; Tautkan Web / NFC</strong>, lalu masukkan kode berikut:
            </p>

            {/* 6-Digit Code Display */}
            <div className="bg-[#242429] border border-white/15 px-6 py-3 rounded-2xl flex items-center gap-3 mb-4 shadow-inner">
              <span className="text-2xl font-mono font-black tracking-widest text-[#3b7cfa]">
                {pairingCode}
              </span>
              <button
                onClick={handleRefreshCode}
                disabled={isRefreshing}
                className="text-white/40 hover:text-white transition p-1"
                title="Perbarui kode baru"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Action buttons */}
            <button
              onClick={handleSimulateDevicePairing}
              disabled={isVerifying}
              className="w-full bg-[#3b7cfa] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi koneksi aplikasi ponsel...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Konfirmasi Pairing dari Aplikasi Ponsel</span>
                </>
              )}
            </button>

            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl text-left w-full flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/60 leading-normal">
                Setelah tersambung, saldo koin Anda akan digabungkan otomatis. Anda dapat merekam meeting dari kartu NFC dan membukanya di aplikasi mobile, atau sebaliknya.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Email OTP Login */}
        {!account.pairedApp && tab === "email" && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendEmailOtp} className="space-y-4">
                <p className="text-xs text-white/70 leading-relaxed">
                  Masukkan alamat email yang Anda gunakan saat login di aplikasi Cardi MoM (Play Store / App Store):
                </p>
                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5">
                    Email Akun MoM
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#242429] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#3b7cfa]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-[#3b7cfa] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  {emailLoading ? "Mengirim OTP..." : "Kirim Kode OTP Masuk"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <p className="text-xs text-white/70 leading-relaxed">
                  Kami telah mengirimkan 6-digit kode OTP ke <strong>{emailInput}</strong>.
                </p>
                <div>
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5">
                    Kode OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#242429] border border-white/15 rounded-xl px-3.5 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-white/30 focus:outline-none focus:border-[#3b7cfa]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  {emailLoading ? "Memverifikasi..." : "Verifikasi & Hubungkan Akun"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-[11px] text-white/50 hover:text-white"
                >
                  Ganti email
                </button>
              </form>
            )}
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mt-4 p-3 bg-[#10b981]/20 border border-[#10b981] rounded-xl text-xs text-[#10b981] font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
