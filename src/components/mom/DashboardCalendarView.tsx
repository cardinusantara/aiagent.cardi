import { Link, useRouter, usePathname, useSearchParams } from "@/lib/mom/nav";
"use client";
import "@/styles/mom.css";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Mic,
  ExternalLink,
  CheckCircle,
  Download,
  Sparkles,
  RefreshCw,
  Video,
  Check,
  CalendarCheck,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import AudioRecordModal from "@/components/mom/AudioRecordModal";
import type {  CalendarEvent  } from "@/lib/mom/types";

export default function DashboardCalendarPage() {
  const {
    account,
    theme,
    locale,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    syncMomToCalendar,
    isGoogleCalendarConnected,
    setGoogleCalendarConnected,
  } = useAppStore();

  const isDark = theme === "dark";

  // State for recording modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedMeetingTitle, setSelectedMeetingTitle] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState("");

  // State for Add Event Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 - 11:00");
  const [attendees, setAttendees] = useState("");
  const [location, setLocation] = useState("Google Meet / Online");
  const [notes, setNotes] = useState("");

  React.useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Sync feedback
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const filteredEvents = calendarEvents.filter((e) => {
    if (filter === "all") return true;
    return e.status === filter;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const googleMeetUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${date.replace(/-/g, "")}T030000Z/${date.replace(/-/g, "")}T040000Z&details=${encodeURIComponent(
      notes || `Rapat bersama: ${attendees}`
    )}&location=${encodeURIComponent(location)}`;

    const newEv: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title,
      date,
      time,
      attendees: attendees || account.name || "Peserta Rapat",
      location,
      notes,
      status: "upcoming",
      source: "Manual",
      googleCalendarUrl: googleMeetUrl,
    };

    addCalendarEvent(newEv);
    setShowAddModal(false);
    setTitle("");
    setAttendees("");
    setNotes("");
  };

  const handleSyncMoM = () => {
    const count = syncMomToCalendar();
    setSyncFeedback(
      count > 0
        ? `Berhasil menambahkan ${count} agenda dari Action Items MoM ke kalender!`
        : "Seluruh action items dari notula rapat sudah tersinkronisasi."
    );
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const handleExportIcs = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cardi MoM//NFC Calendar//ID\n";
    calendarEvents.forEach((ev) => {
      const cleanDate = ev.date.replace(/-/g, "");
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${cleanDate}T090000Z\nDTEND:${cleanDate}T100000Z\nDESCRIPTION:${ev.notes || ev.attendees}\nLOCATION:${ev.location}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "cardi-mom-calendar.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Google Calendar Sync Status */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark
            ? "bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border-sky-500/20"
            : "bg-gradient-to-r from-sky-50 via-white to-white border-sky-200 shadow-xs"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">
                  {locale === "id"
                    ? "Integrasi Google Calendar & MoM"
                    : "Google Calendar & MoM Sync"}
                </h1>
                <span className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isGoogleCalendarConnected ? "Terhubung" : "Aktif"}</span>
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {account.email
                  ? `Akun tersinkron: ${account.email}`
                  : "Agenda otomatis sinkron dengan Google Calendar dan Notula Rapat AI MoM."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSyncMoM}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
              }`}
              title="Ekstrak Action Items dari seluruh notula rapat MoM menjadi jadwal kalender"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Sinkronkan MoM AI</span>
            </button>

            <button
              onClick={handleExportIcs}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
              }`}
              title="Unduh format .ics untuk Apple Calendar & Outlook"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Ekspor iCal (.ics)</span>
            </button>

            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition cursor-pointer"
            >
              <span>Buka Google Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {syncFeedback && (
          <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border w-fit ${
            isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "all"
                ? "bg-sky-600 text-white shadow-xs"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua Jadwal ({calendarEvents.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "upcoming"
                ? "bg-sky-600 text-white shadow-xs"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mendatang
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "completed"
                ? "bg-sky-600 text-white shadow-xs"
                : isDark
                ? "text-slate-400 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Pertemuan</span>
        </button>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-3xl border ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <CalendarCheck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold">Belum Ada Jadwal Pertemuan</h3>
          <p
            className={`text-xs mt-1 max-w-sm mx-auto ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Jadwal pertemuan baru akan muncul ketika Anda menambahkannya secara manual, dari aksi tap kartu NFC, atau disinkronkan otomatis dari Action Items MoM.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Agenda Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                isDark
                  ? "bg-[#0E1A30]/80 border-white/10 hover:border-sky-500/40"
                  : "bg-white border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
                        ev.source === "MoM Action Item"
                          ? "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30"
                          : ev.source === "NFC Tap"
                          ? "bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30"
                          : "bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/30"
                      }`}
                    >
                      {ev.source}
                    </span>
                    <span
                      className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                        ev.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                          : "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30"
                      }`}
                    >
                      {ev.status === "completed" ? "Selesai" : "Mendatang"}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteCalendarEvent(ev.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                    title="Hapus Agenda"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
                  {ev.title}
                </h3>

                <div
                  className={`space-y-1.5 text-xs mb-4 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{ev.date}</span>
                    <span className="text-slate-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>{ev.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">{ev.attendees}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>

                  {ev.notes && (
                    <p
                      className={`text-[11px] italic mt-1 pl-2.5 border-l-2 border-sky-500/40 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {ev.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? "border-white/10" : "border-slate-100"
                }`}
              >
                {/* One click MoM Recording for this specific meeting */}
                <button
                  onClick={() => {
                    setSelectedMeetingTitle(ev.title);
                    setSelectedAttendee(ev.attendees);
                    setIsRecordModalOpen(true);
                  }}
                  className="bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Rekam MoM</span>
                </button>

                {/* Direct Google Calendar Link */}
                <a
                  href={
                    ev.googleCalendarUrl ||
                    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      ev.title
                    )}&dates=${ev.date.replace(/-/g, "")}T030000Z/${ev.date.replace(
                      /-/g,
                      ""
                    )}T040000Z&details=${encodeURIComponent(
                      ev.attendees
                    )}&location=${encodeURIComponent(ev.location)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`border w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150 ${
              isDark
                ? "bg-[#0E1A30] border-white/15 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Jadwalkan Pertemuan Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nama Agenda / Rapat
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rapat Kerjasama Bisnis"
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 ${
                    isDark
                      ? "bg-[#070F1E] border-white/15 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 ${
                      isDark
                        ? "bg-[#070F1E] border-white/15 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="14:00 - 15:00"
                    className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 ${
                      isDark
                        ? "bg-[#070F1E] border-white/15 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Peserta Rapat
                </label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Deo Cardi Nathanael, Nama Klien"
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 ${
                    isDark
                      ? "bg-[#070F1E] border-white/15 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Lokasi / Tautan Google Meet
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Google Meet / Kantor"
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 ${
                    isDark
                      ? "bg-[#070F1E] border-white/15 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Catatan agenda atau link dokumen pendukung..."
                  className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 resize-none ${
                    isDark
                      ? "bg-[#070F1E] border-white/15 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-bold transition shadow-md shadow-sky-600/20"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIO RECORD MODAL */}
      <AudioRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        defaultAttendee={selectedAttendee}
        defaultTitle={selectedMeetingTitle}
      />
    </div>
  );
}
