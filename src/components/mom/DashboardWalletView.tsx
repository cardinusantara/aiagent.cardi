import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState } from "react";
import {
  Coins,
  Smartphone,
  CheckCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  Mail,
  Zap,
  Check,
  Radio,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import type {  CoinTransaction  } from "@/lib/mom/types";
import PairingModal from "@/components/mom/PairingModal";

export default function DashboardWalletPage() {
  const { account, coinHistory, addCoins, theme } = useAppStore();
  const isDark = theme === "dark";

  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  // Official Cardi MoM coin rates aligned with aiagent.cardi.co.id/mom & Cardi ecosystem
  const coinPackages = [
    {
      coins: 500,
      price: "Rp 99.000",
      tag: "Quick",
      desc: "~100x ringkasan rapat AI & vCard sync",
      popular: false,
    },
    {
      coins: 1000,
      price: "Rp 179.000",
      tag: "Standard",
      desc: "~200x rapat + prioritas model AI & Google Calendar",
      popular: true,
    },
    {
      coins: 2500,
      price: "Rp 399.000",
      tag: "Bulk",
      desc: "~500x rapat + integrasi tim & distribusi WhatsApp",
      popular: false,
    },
  ];

  const handleBuyPackage = (coins: number, label: string) => {
    addCoins(coins, `Top-up Saldo Koin (${label} ${coins} Koin)`);
    setTopUpSuccess(`Berhasil mengisi ${coins} Koin (${label})! Saldo akun Anda telah bertambah.`);
    setTimeout(() => setTopUpSuccess(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold font-mono tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              SISTEM SALDO TERPADU
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">1 Koin = Rp 180</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-500" />
            <span>Dompet Koin &amp; Sinkronisasi MoM</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Satu saldo koin terpadu untuk kartu nama digital NFC dan transkripsi notulen AI di website serta aplikasi mobile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPairingModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-500" />
            <span>{account.pairedApp ? "Kelola HP Terhubung" : "Tautkan Aplikasi HP"}</span>
          </button>
        </div>
      </div>

      {topUpSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{topUpSuccess}</span>
        </div>
      )}

      {/* 2-Column: Balance & Mobile Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-[#0A1633] via-[#0E1F47] to-[#050C1F] text-white border border-slate-700/60 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Saldo Koin Aktif</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                SIAP DIGUNAKAN
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {account.coinBalance ?? account.coinsBalance ?? 0}
              </span>
              <span className="text-base font-bold text-amber-400">KOIN</span>
            </div>

            <p className="text-xs text-slate-300/90 leading-relaxed max-w-sm">
              Digunakan otomatis untuk pemrosesan notulen meeting AI (5 koin / sesi rapat) dan integrasi ekosistem Cardi.
            </p>
          </div>

          <div className="pt-5 border-t border-white/10 mt-6 grid grid-cols-2 gap-3 text-xs relative z-10">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Kartu Fisik NFC
              </span>
              <span className="text-white font-bold text-sm mt-0.5 block flex items-center gap-1">
                <span>Unlimited Tap</span>
                <Sparkles className="w-3 h-3 text-cyan-300" />
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Kapasitas Rapat AI
              </span>
              <span className="text-white font-bold text-sm mt-0.5 block">
                {Math.floor((account.coinBalance ?? account.coinsBalance ?? 0) / 5)} Sesi Rapat
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Device Connection Card */}
        <div className="bg-white dark:bg-[#0E1A30] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-500" />
                <span>Koneksi Aplikasi Mobile MoM</span>
              </span>
              {account.pairedApp ? (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  TERHUBUNG
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                  BELUM TERHUBUNG
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {account.pairedApp
                ? account.pairedApp.deviceModel
                : "Sinkronkan dengan Aplikasi Mobile Cardi MoM"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {account.pairedApp
                ? `Perangkat ponsel Anda (${account.pairedApp.deviceModel}) telah terhubung sejak ${new Date(
                    account.pairedApp.pairedAt
                  ).toLocaleDateString("id-ID")}. Seluruh rekaman suara dari HP otomatis sinkron ke web ini.`
                : "Rekam percakapan langsung dari ponsel Android atau iPhone. Notula dan saldo koin otomatis sinkron real-time ke web dashboard ini."}
            </p>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-3.5 mb-2 text-xs">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold">ID Pairing Aktif:</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">892-415</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => setIsPairingModalOpen(true)}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {account.pairedApp ? "Kelola / Ubah Perangkat HP" : "Buka QR Code Pairing Mobile"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Coin Packages Top-up */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-sky-600 dark:text-sky-400">
              TOP-UP SALDO
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Pilihan Paket Koin Cardi MoM
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Harga resmi transparan tanpa biaya langganan bulanan tersembunyi. Koin berlaku selamanya tanpa kedaluwarsa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coinPackages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-3xl p-6 border relative flex flex-col justify-between transition bg-white dark:bg-[#0E1A30] ${
                pkg.popular
                  ? "border-[#1E4FFF] shadow-lg shadow-blue-500/10 ring-2 ring-[#1E4FFF]/20"
                  : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 right-6 bg-gradient-to-r from-[#0258A4] to-[#1E4FFF] text-white text-[10.5px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Paling Populer
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {pkg.tag}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                  {pkg.coins} <span className="text-sm font-bold text-slate-400">Koin</span>
                </div>

                <p className="text-base font-black text-[#0258A4] dark:text-[#38bdf8] mb-3">
                  {pkg.price}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {pkg.desc}
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Transkripsi suara akurasi tinggi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ekspor langsung ke WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Koin tidak ada masa hangus</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleBuyPackage(pkg.coins, pkg.tag)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  pkg.popular
                    ? "bg-gradient-to-r from-[#0258A4] to-[#1E4FFF] hover:from-[#01417A] hover:to-[#0258A4] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Beli Paket Koin</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-[#0E1A30] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Riwayat Transaksi Saldo</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total {coinHistory.length} transaksi
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
          {coinHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-white/40">
              <Coins className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-white/20" />
              <p className="font-semibold text-slate-700 dark:text-white/70">Belum ada riwayat transaksi</p>
              <p className="text-[11px] text-slate-500 dark:text-white/40 mt-1 max-w-sm mx-auto">
                Koin digunakan untuk notulen rapat MoM AI (5 koin / rapat) atau bertambah saat aktivasi kartu dan pembelian paket.
              </p>
            </div>
          ) : (
            coinHistory.map((tx: CoinTransaction) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.amount > 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60"
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{tx.description}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <span
                  className={`font-mono font-bold text-xs ${
                    tx.amount > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Koin
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pairing Modal */}
      <PairingModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
      />
    </div>
  );
}
