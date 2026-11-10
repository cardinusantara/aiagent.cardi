import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState, useRef } from "react";
import {
  Mic,
  FileText,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Share2,
  Download,
  Search,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  CalendarPlus,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import type {  Meeting  } from "@/lib/mom/types";
import AudioRecordModal from "@/components/mom/AudioRecordModal";
import { CardiMomLogo } from "@/components/mom/CardiMomLogo";

export default function DashboardMomPage() {
  const { meetings, theme, locale, syncMomToCalendar } = useAppStore();
  const isDark = theme === "dark";

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    meetings[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState<string | null>(null);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const selectedMeeting =
    meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  const filteredMeetings = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.attendees?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const formatWhatsAppMinutes = (m: Meeting) => {
    if (!m.mom) return "";
    const lines = [
      `*NOTULA RESMI CARDI MOM: ${m.title.toUpperCase()}*`,
      `📅 Tanggal: ${m.date} | ⏱️ Durasi: ${m.durationMinutes ?? "-"} menit`,
      `👥 Peserta: ${m.attendees || "-"}`,
      ``,
      `*RINGKASAN EKSEKUTIF:*`,
      m.mom.executiveSummary,
      ``,
      `*KEPUTUSAN:*`,
      ...m.mom.decisions.map((d, i) => `• ${d.text}`),
      ``,
      `*ACTION ITEMS (TINDAK LANJUT):*`,
      ...m.mom.actionItems.map(
        (ai, i) =>
          `[ ] ${ai.item} (PIC: ${ai.owner || "-"}, Deadline: ${
            ai.dueDateText || ai.dueDate || "-"
          })`
      ),
      ``,
      `_Dibuat otomatis via Cardi Smart NFC & AI MoM (cardi.co.id)_`,
    ];
    return lines.join("\n");
  };

  const handleShareToWhatsApp = () => {
    if (!selectedMeeting) return;
    const text = encodeURIComponent(formatWhatsAppMinutes(selectedMeeting));
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopyMinutes = () => {
    if (!selectedMeeting) return;
    navigator.clipboard.writeText(formatWhatsAppMinutes(selectedMeeting));
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const toggleAudio = () => {
    if (!audioElementRef.current) return;
    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleSyncToCalendar = () => {
    const count = syncMomToCalendar();
    setCalendarSyncSuccess(
      count > 0
        ? `${count} agenda action items berhasil disinkronkan ke kalender!`
        : "Seluruh action items rapat ini sudah terdaftar di kalender."
    );
    setTimeout(() => setCalendarSyncSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CardiMomLogo size="sm" colorMode={isDark ? "dark" : "light"} />
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "bg-sky-50 text-sky-700 border border-sky-200"
              }`}
            >
              Notula Rapat &amp; AI Intelligence
            </span>
          </div>
          <p
            className={`text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Rekam pembicaraan rapat langsung dari mikrofon atau tap kartu NFC, transkripsi otomatis, dan ringkasan eksekutif AI.
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/25 transition active:scale-[0.98] cursor-pointer"
        >
          <Mic className="w-4 h-4 animate-pulse" />
          <span>Rekam Notula Rapat Baru</span>
        </button>
      </div>

      {/* 2-Column Split: Meeting List (Left) and Meeting Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Meeting List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search
              className={`w-4 h-4 absolute left-3 top-2.5 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              placeholder="Cari judul atau nama peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-sky-500 transition ${
                isDark
                  ? "bg-[#0E1A30] border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Cards List */}
          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredMeetings.length === 0 ? (
              <div
                className={`text-center py-12 rounded-2xl border p-4 ${
                  isDark
                    ? "bg-[#0E1A30]/60 border-white/10"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Belum ada notula rapat yang tersimpan.
                </p>
                <button
                  onClick={() => setIsRecordModalOpen(true)}
                  className="mt-3 text-xs font-bold text-sky-500 hover:text-sky-400 inline-flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Mulai Rekam Sekarang</span>
                </button>
              </div>
            ) : (
              filteredMeetings.map((mtg) => {
                const isSelected = mtg.id === selectedMeeting?.id;
                return (
                  <div
                    key={mtg.id}
                    onClick={() => setSelectedMeetingId(mtg.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-left ${
                      isSelected
                        ? "bg-sky-500/10 border-sky-500 shadow-sm"
                        : isDark
                        ? "bg-[#0E1A30]/80 border-white/10 hover:border-white/20 hover:bg-[#12213D]"
                        : "bg-white border-slate-200 hover:border-sky-200 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={`text-xs font-bold line-clamp-1 ${
                          isSelected
                            ? "text-sky-400"
                            : isDark
                            ? "text-white"
                            : "text-slate-900"
                        }`}
                      >
                        {mtg.title}
                      </h4>
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                        Siap
                      </span>
                    </div>

                    <p
                      className={`text-[11px] line-clamp-2 mb-2 italic ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {mtg.mom?.shortSummary || "Ringkasan notula AI..."}
                    </p>

                    <div
                      className={`flex items-center justify-between text-[10px] border-t pt-2 ${
                        isDark
                          ? "border-white/5 text-slate-500"
                          : "border-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {mtg.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {mtg.durationMinutes} menit
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Meeting Detail (8 Cols) */}
        <div
          className={`lg:col-span-8 border rounded-2xl p-6 shadow-xl flex flex-col min-h-[600px] transition-colors ${
            isDark
              ? "bg-[#0E1A30] border-white/10"
              : "bg-white border-slate-200 shadow-slate-100"
          }`}
        >
          {selectedMeeting ? (
            <div className="space-y-6">
              {/* Meeting Header */}
              <div
                className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b ${
                  isDark ? "border-white/10" : "border-slate-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Cardi MoM AI Verified
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-400">
                      {selectedMeeting.location || "Tatap Muka (NFC Tap)"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {selectedMeeting.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      {selectedMeeting.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {selectedMeeting.durationMinutes} Menit
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      {selectedMeeting.attendees}
                    </span>
                  </div>
                </div>

                {/* Actions & Share */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSyncToCalendar}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition border border-sky-500/30"
                    title="Jadwalkan seluruh Action Items ke Google Calendar"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Sync Kalender</span>
                  </button>

                  <button
                    onClick={handleShareToWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                    title="Bagikan format pesan WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCopyMinutes}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
                    }`}
                  >
                    {copiedShare ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedShare ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>
              </div>

              {calendarSyncSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{calendarSyncSuccess}</span>
                </div>
              )}

              {/* Audio Player if recorded */}
              {selectedMeeting.audioUrl && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 ${
                    isDark
                      ? "bg-[#070F1E] border-white/10"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAudio}
                      className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow transition"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Pemutar Rekaman Suara Rapat
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Format Audio: WebM/Opus (Kualitas Studio)
                      </div>
                    </div>
                  </div>
                  <audio
                    ref={audioElementRef}
                    src={selectedMeeting.audioUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5 text-sky-400 text-xs font-semibold">
                    <Volume2 className="w-4 h-4" />
                    <span>Live Audio</span>
                  </div>
                </div>
              )}

              {/* 1. Ringkasan Eksekutif */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-sky-50/50 border-sky-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-sky-500 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Ringkasan Eksekutif AI</span>
                </div>
                <p
                  className={`text-xs leading-relaxed font-normal ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {selectedMeeting.mom?.executiveSummary}
                </p>
              </div>

              {/* 2. Poin-poin Pembahasan */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-white">
                  Poin Pembahasan Rapat
                </h3>
                <div className="space-y-2.5">
                  {selectedMeeting.mom?.discussionPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs ${
                        isDark
                          ? "bg-white/5 border-white/5"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        {pt.topic}
                      </h4>
                      <p
                        className={`leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {pt.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Keputusan Rapat */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-white">
                  Keputusan yang Disepakati
                </h3>
                <div className="space-y-2">
                  {selectedMeeting.mom?.decisions.map((dec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-900 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{dec.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Action Items (Tindak Lanjut & PIC) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Action Items (Tindak Lanjut &amp; PIC)
                  </h3>
                  <button
                    onClick={handleSyncToCalendar}
                    className="text-[11px] text-sky-500 hover:underline font-semibold flex items-center gap-1"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Tambahkan ke Kalender</span>
                  </button>
                </div>

                <div
                  className={`border rounded-xl overflow-hidden ${
                    isDark ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr
                        className={`border-b uppercase text-[10px] font-bold ${
                          isDark
                            ? "bg-white/5 border-white/10 text-slate-400"
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}
                      >
                        <th className="p-3">Tugas / Item Tindak Lanjut</th>
                        <th className="p-3">PIC (Penanggung Jawab)</th>
                        <th className="p-3">Tenggat Waktu</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDark ? "divide-white/5" : "divide-slate-100"
                      }`}
                    >
                      {selectedMeeting.mom?.actionItems.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`transition ${
                            isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="p-3 font-medium text-slate-900 dark:text-white">
                            {item.item}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                isDark ? "bg-white/10" : "bg-slate-100"
                              }`}
                            >
                              {item.owner || "Belum ditentukan"}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px]">
                            {item.dueDateText || item.dueDate || "Segera"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <FileText className="w-12 h-12 text-slate-400 mb-3 opacity-40" />
              <p className="text-xs text-slate-400">
                Pilih salah satu rapat dari daftar sebelah kiri untuk melihat notula lengkap.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Record Modal */}
      <AudioRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
    </div>
  );
}
