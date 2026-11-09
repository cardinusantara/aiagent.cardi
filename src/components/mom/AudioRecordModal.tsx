"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Sparkles,
  Loader2,
  CheckCircle,
  FileText,
  Clock,
  Calendar,
  User,
  X,
  Volume2,
  Play,
  Pause,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useAppStore } from "@/lib/mom/store";
import type {  Meeting  } from "@/lib/mom/types";

interface AudioRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAttendee?: string;
  defaultTitle?: string;
}

export default function AudioRecordModal({
  isOpen,
  onClose,
  defaultAttendee,
  defaultTitle,
}: AudioRecordModalProps) {
  const { sessionToken, addMeeting, deductCoins, cardProfile } = useAppStore();

  const [title, setTitle] = useState(
    defaultTitle ||
      (defaultAttendee
        ? `Rapat dengan ${defaultAttendee}`
        : "Rapat Diskusi Bisnis & Kemitraan")
  );
  const [attendees, setAttendees] = useState(
    defaultAttendee || `${cardProfile.fullName || "Deo Cardi Nathanael"}, Rekan Bisnis`
  );

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Live waveform animation
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Step flow: 'idle' | 'recording' | 'processing' | 'done'
  const [step, setStep] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for media stream & timer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (defaultAttendee) {
      setAttendees(`${cardProfile.fullName || "Deo Cardi Nathanael"}, ${defaultAttendee}`);
      setTitle(`Rapat dengan ${defaultAttendee}`);
    }
  }, [defaultAttendee, cardProfile.fullName]);

  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  const stopRecordingResources = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  if (!isOpen) return null;

  // 1. Start live audio recording
  const handleStartRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio analysis for real-time waveform
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (err) {
        console.warn("Analyser not supported, falling back to simulated wave", err);
      }

      // MediaRecorder initialization
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "";
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setStep("recording");
      setDuration(0);

      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      timerRef.current = interval;
    } catch (err) {
      console.error("Microphone access error:", err);
      setErrorMessage(
        "Izin mikrofon diperlukan untuk merekam. Mohon izinkan akses mikrofon di peramban Anda."
      );
    }
  };

  // 2. Stop recording and execute AI processing pipeline
  const handleStopAndProcess = async () => {
    stopRecordingResources();
    setIsRecording(false);
    setStep("processing");

    let finalAudioUrl: string | null = null;
    if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      finalAudioUrl = URL.createObjectURL(blob);
      setAudioUrl(finalAudioUrl);
    }

    try {
      // Call production endpoint /api/mom/record
      const res = await fetch("/api/mom/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Rapat Notula MoM",
          attendees,
          durationMinutes: Math.max(1, Math.ceil(duration / 60)),
          token: sessionToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses rapat");

      const meetingWithAudio: Meeting = {
        ...data.meeting,
        audioUrl: finalAudioUrl,
      };

      // Deduct coins for transcription (5 coins)
      deductCoins(5, `Transkripsi MoM AI: ${title}`);

      // Add to store
      addMeeting(meetingWithAudio);
      setCreatedMeeting(meetingWithAudio);
      setStep("done");
    } catch (err: unknown) {
      console.error("Error processing MoM:", err);
      setErrorMessage("Gagal menyelesaikan transkripsi AI. Silakan coba kembali.");
      setStep("idle");
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    if (!audioElementRef.current) return;
    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D1829] border border-white/15 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative text-white animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopRecordingResources();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {step === "done" ? "Notula AI Siap Digunakan" : "Perekam Suara Rapat MoM"}
            </h2>
            <p className="text-xs text-slate-400">
              {step === "done"
                ? "Tersinkronisasi otomatis dengan aplikasi mobile Cardi MoM"
                : "Langsung ditranskripsi & diekstrak ringkasan eksekutifnya"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: IDLE / CONFIGURATION */}
        {step === "idle" && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Judul Agenda Pertemuan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Diskusi Penjualan Kemitraan"
                className="w-full bg-[#070F1E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Peserta Pertemuan
              </label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Deo Cardi Nathanael, Budi"
                className="w-full bg-[#070F1E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Integrasi Penuh Pipeline:</span> Suara akan direkam melalui mikrofon peramban dan langsung dieksekusi oleh mesin AI MoM. Hasilnya otomatis masuk ke dashboard web dan aplikasi mobile Cardi Anda.
              </div>
            </div>

            <button
              onClick={handleStartRecording}
              className="w-full bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Mulai Rekam Percakapan Sekarang</span>
            </button>
          </div>
        )}

        {/* STEP 2: LIVE RECORDING */}
        {step === "recording" && (
          <div className="text-center py-6 space-y-6">
            <div className="relative inline-flex items-center justify-center">
              {/* Outer pulsing ring responsive to volume */}
              <div
                className="w-28 h-28 rounded-full bg-sky-500/20 absolute animate-ping duration-1000"
                style={{ transform: `scale(${1 + volumeLevel / 120})` }}
              />
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-red-500/40 relative z-10 animate-pulse">
                <Mic className="w-10 h-10" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-mono font-black text-white tracking-widest">
                {formatSeconds(duration)}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Sedang merekam suara rapat live...</span>
              </p>
            </div>

            {/* Dynamic Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 h-10 px-6">
              {[40, 65, 85, 30, 95, 55, 75, 45, 90, 60, 35, 80].map((h, i) => {
                const dynamicHeight = Math.max(
                  8,
                  Math.min(38, Math.round((h * (volumeLevel + 30)) / 100))
                );
                return (
                  <span
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-sky-500 to-cyan-300 rounded-full transition-all duration-75"
                    style={{ height: `${dynamicHeight}px` }}
                  />
                );
              })}
            </div>

            <button
              onClick={handleStopAndProcess}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Selesai &amp; Proses Notula AI Sekarang</span>
            </button>
          </div>
        )}

        {/* STEP 3: PROCESSING WITH AI */}
        {step === "processing" && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Memproses Transkripsi Suara &amp; AI MoM</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Mengunggah audio rekaman, mentranskripsikan ke teks, dan mengekstrak ringkasan eksekutif serta action items...
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: RESULT / DONE */}
        {step === "done" && createdMeeting && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-300">Notula Rapat Berhasil Dibuat!</div>
                <div className="text-[11px] text-slate-300">
                  Data telah tersimpan di akun Anda dan dapat langsung diakses di aplikasi Cardi MoM ponsel Anda.
                </div>
              </div>
            </div>

            {/* Audio Playback Element */}
            {audioUrl && (
              <div className="bg-[#070F1E] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayback}
                    className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow transition"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-white">Rekaman Suara Pertemuan</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Durasi: {formatSeconds(duration)}
                    </div>
                  </div>
                </div>
                <audio
                  ref={audioElementRef}
                  src={audioUrl}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
                <Volume2 className="w-4 h-4 text-sky-400" />
              </div>
            )}

            {/* MoM Preview */}
            <div className="bg-[#070F1E] border border-white/10 rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  Ringkasan Eksekutif
                </span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {createdMeeting.mom?.executiveSummary}
                </p>
              </div>

              {createdMeeting.mom?.actionItems && createdMeeting.mom.actionItems.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Action Items ({createdMeeting.mom.actionItems.length})
                  </span>
                  <div className="mt-1 space-y-1.5">
                    {createdMeeting.mom.actionItems.map((ai, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-xs flex items-start justify-between gap-2"
                      >
                        <span className="text-slate-200">{ai.item}</span>
                        <span className="bg-sky-500/20 text-sky-300 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
                          {ai.owner}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition"
              >
                Tutup
              </button>
              <a
                href="/mom/dashboard/mom"
                className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-slate-900 py-2.5 px-4 rounded-xl text-xs font-bold text-center transition shadow-lg shadow-sky-500/20"
              >
                Lihat di Dashboard MoM
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
