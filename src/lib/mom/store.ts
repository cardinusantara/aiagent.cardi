import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { 
  AppLocale,
  AppTheme,
  CalendarEvent,
  CardProfile,
  CoinTransaction,
  ContactLead,
  Meeting,
  PairedDevice,
  UserAccount,
 } from "./types";
import { getProfileByUsername } from "./profiles";

interface AppState {
  // Auth & Account
  account: UserAccount;
  sessionToken: string | null;
  setSession: (token: string, account: UserAccount) => void;
  loginUser: (username: string) => boolean;
  loginWithGoogle: (profile: { name: string; email: string; avatarUrl?: string }, token: string) => void;
  logout: () => void;
  resetAllData: () => void;
  setPairedApp: (device: PairedDevice | null) => void;
  updateCoinBalance: (coins: number) => void;
  deductCoins: (amount: number, reason: string) => boolean;
  addCoins: (amount: number, reason?: string) => void;

  // Digital Card Profile
  cardProfile: CardProfile;
  updateCardProfile: (updates: Partial<CardProfile>) => void;
  incrementTaps: () => void;

  // Meetings & MoM
  meetings: Meeting[];
  activeRecording: boolean;
  recordingSeconds: number;
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  setActiveRecording: (active: boolean) => void;
  setRecordingSeconds: (seconds: number | ((prev: number) => number)) => void;

  // Contacts / Leads
  contacts: ContactLead[];
  leads: ContactLead[]; // alias for convenience
  addContact: (contact: ContactLead) => void;
  updateContactStatus: (id: string, status: "hot" | "warm" | "cold") => void;

  // Calendar & Scheduling
  calendarEvents: CalendarEvent[];
  isGoogleCalendarConnected: boolean;
  setGoogleCalendarConnected: (connected: boolean) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  syncMomToCalendar: () => number;

  // Transactions
  transactions: CoinTransaction[];
  coinHistory: CoinTransaction[]; // alias for convenience

  // Active Tab Filter
  currentProductTab: "card" | "mom" | "calendar" | "wallet";
  setCurrentProductTab: (tab: "card" | "mom" | "calendar" | "wallet") => void;

  // Theme & Locale
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
}

const CLEAN_ACCOUNT: UserAccount = {
  email: "",
  name: "",
  avatarUrl: "",
  coinsBalance: 0,
  coinBalance: 0,
  freemiumGranted: false,
  subscription: {
    status: "none",
    tier: null,
    currentPeriodEnd: null,
  },
  pairedApp: null,
};

const CLEAN_CARD_PROFILE: CardProfile = {
  username: "",
  fullName: "",
  headline: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  location: "",
  bio: "",
  avatarUrl: "",
  cardDesign: "black-gold",
  socials: {},
  metrics: {
    totalTaps: 0,
    contactsSaved: 0,
    momInitiated: 0,
  },
};

const DEFAULT_ACCOUNT: UserAccount = {
  email: "deo@cardi.co.id",
  name: "Deo Cardi Nathanael",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  coinsBalance: 245,
  coinBalance: 245,
  freemiumGranted: true,
  subscription: {
    status: "active",
    tier: "pro",
    currentPeriodEnd: "2027-12-31T00:00:00Z",
  },
  pairedApp: {
    deviceId: "dev_iphone_16",
    deviceModel: "iPhone 16 Pro (Cardi MoM App)",
    pairedAt: "2026-10-15T08:30:00Z",
  },
};

const DEFAULT_CARD_PROFILE: CardProfile = {
  username: "deo",
  fullName: "Deo Cardi Nathanael",
  headline: "Founder & Chief Executive Officer",
  company: "Cardi Nusantara AI",
  phone: "+62 812-8899-0011",
  email: "deo@cardi.co.id",
  website: "https://cardi.co.id",
  location: "Jakarta, Indonesia",
  bio: "Membangun ekosistem AI Meeting Intelligence dan Smart NFC Networking generasi baru di Indonesia.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  cardDesign: "black-gold",
  socials: {
    whatsapp: "https://wa.me/6281288990011",
    linkedin: "https://linkedin.com/in/deocardi",
    instagram: "https://instagram.com/deocardi",
    github: "https://github.com/cardinusantara",
  },
  metrics: {
    totalTaps: 320,
    contactsSaved: 215,
    momInitiated: 64,
  },
};

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "mtg_init_1",
    title: "Rapat Kemitraan Eksekutif Cardi Smart NFC & AI MoM",
    titleIsDefault: false,
    date: "2026-11-06",
    startTime: "14:00",
    durationMinutes: 28,
    attendees: "Deo Cardi Nathanael, Tim Bisnis & Mitra Strategis",
    location: "Pertemuan Tatap Muka (NFC Tap)",
    status: "ready",
    failedStage: null,
    failureReason: null,
    momReadAt: null,
    updatedAt: "2026-11-06T14:35:00Z",
    createdAt: "2026-11-06T14:00:00Z",
    mom: {
      shortSummary: "Pembahasan integrasi kartu bisnis digital NFC dengan asisten transkripsi notulen AI Cardi MoM untuk eksekutif perusahaan.",
      executiveSummary: "Pertemuan menyepakati percepatan transisi dari kartu nama konvensional menuju Cardi Smart NFC Card. Fitur pencatatan otomatis AI MoM dinilai sangat menghemat waktu follow-up dan mempermudah delegasi tugas tim.",
      discussionPoints: [
        {
          topic: "Efisiensi Pertukaran Kontak Tanpa Aplikasi",
          detail: "Lawan bicara dapat langsung menyimpan profil (.vcf) dan nomor WhatsApp hanya dengan sekali tap kartu fisik ke smartphone.",
          sourceMs: [0, 30000],
        },
        {
          topic: "Otomatisasi Notulen Rapat & Action Items",
          detail: "Transkripsi AI mengekstrak keputusan penting dan memetakan tugas ke PIC masing-masing secara real-time.",
          sourceMs: [30000, 60000],
        },
        {
          topic: "Sinkronisasi Google Calendar Dua Arah",
          detail: "Action items dari hasil rapat langsung dijadwalkan ke Google Calendar kedua belah pihak.",
          sourceMs: [60000, 90000],
        },
      ],
      decisions: [
        {
          text: "Menggunakan Cardi Smart NFC Card sebagai standar networking eksekutif tim.",
          sourceMs: [25000],
        },
        {
          text: "Menjadwalkan sesi onboarding dan aktivasi kartu batch pertama.",
          sourceMs: [55000],
        },
      ],
      actionItems: [
        {
          item: "Kirimkan proposal teknis dan invoice paket tim eksekutif.",
          owner: "Deo Cardi Nathanael",
          dueDate: "2026-11-08",
          dueDateText: "2 hari lagi",
          sourceMs: [45000],
        },
        {
          item: "Jadwalkan sesi onboarding via Google Meet.",
          owner: "Tim Mitra",
          dueDate: "2026-11-10",
          dueDateText: "4 hari lagi",
          sourceMs: [80000],
        },
      ],
      openIssues: [],
      nextSteps: [
        {
          text: "Kirimkan ringkasan notulen ke grup WhatsApp peserta rapat.",
          sourceMs: [85000],
        },
      ],
      model: "cardi-ai-voice-v2",
      promptVersion: "2.4",
    },
  },
];

const INITIAL_CONTACTS: ContactLead[] = [
  {
    id: "lead_1",
    name: "Budi Santoso",
    company: "PT Mandiri Digital Nusantara",
    phone: "+62 812-9988-7766",
    email: "budi.santoso@mandiridigital.id",
    tappedAt: "Kemarin, 14:20",
    createdAt: "2026-11-05T14:20:00Z",
    status: "hot",
    notes: "Tertarik implementasi 50 kartu NFC untuk tim sales & business development.",
  },
  {
    id: "lead_2",
    name: "Siti Rahmawati",
    company: "Inovasi Retail Indonesia",
    phone: "+62 813-1122-3344",
    email: "siti.rahma@innovretail.co.id",
    tappedAt: "3 hari lalu",
    createdAt: "2026-11-03T10:15:00Z",
    status: "warm",
    notes: "Follow-up proposal paket Starter dan integrasi WhatsApp.",
  },
];

const INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: "tx_init_1",
    type: "topup",
    amount: 250,
    service: "topup_pack",
    description: "Bonus Aktivasi Paket Executive NFC Card (250 Koin)",
    createdAt: "2026-11-04T09:00:00Z",
  },
  {
    id: "tx_init_2",
    type: "usage",
    amount: -5,
    service: "mom_transcribe",
    description: "Transkripsi AI: Rapat Kemitraan Eksekutif Cardi",
    createdAt: "2026-11-06T14:35:00Z",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth & Account State (Clean Zero)
      account: DEFAULT_ACCOUNT,
      sessionToken: "tok_deo_demo",
      setSession: (token, account) => set({ sessionToken: token, account }),

      loginUser: (username: string) => {
        const key = username.toLowerCase().trim();
        const profile = getProfileByUsername(key);
        const newAccount: UserAccount = {
          email: profile.email || `${key}@cardi.co.id`,
          name: profile.fullName || key,
          coinsBalance: 50,
          coinBalance: 50,
          freemiumGranted: true,
          subscription: {
            status: "active",
            tier: "pro",
            currentPeriodEnd: "2026-12-31T00:00:00Z",
          },
        };
        set({
          account: newAccount,
          cardProfile: profile,
          sessionToken: `tok_${key}_active`,
        });
        return true;
      },

      loginWithGoogle: (profile, token) => {
        const usernameClean = profile.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        const newAccount: UserAccount = {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl || "",
          coinsBalance: 60,
          coinBalance: 60,
          freemiumGranted: true,
          subscription: {
            status: "active",
            tier: "pro",
            currentPeriodEnd: "2027-12-31T00:00:00Z",
          },
        };

        const existingProfile = get().cardProfile;
        const updatedCardProfile: CardProfile = {
          ...existingProfile,
          fullName: existingProfile.fullName || profile.name,
          email: existingProfile.email || profile.email,
          username: existingProfile.username || usernameClean,
          avatarUrl: existingProfile.avatarUrl || profile.avatarUrl || "",
        };

        set({
          account: newAccount,
          sessionToken: token,
          cardProfile: updatedCardProfile,
        });
      },

      logout: () => {
        set({
          sessionToken: null,
          account: CLEAN_ACCOUNT,
        });
      },

      resetAllData: () => {
        set({
          account: CLEAN_ACCOUNT,
          sessionToken: null,
          cardProfile: DEFAULT_CARD_PROFILE,
          meetings: INITIAL_MEETINGS,
          contacts: [],
          leads: [],
          transactions: [],
          coinHistory: [],
          activeRecording: false,
          recordingSeconds: 0,
          calendarEvents: [],
        });
      },

      setPairedApp: (device) =>
        set((state) => ({
          account: { ...state.account, pairedApp: device },
        })),

      updateCoinBalance: (coins) =>
        set((state) => ({
          account: { ...state.account, coinsBalance: coins, coinBalance: coins },
        })),

      deductCoins: (amount, reason) => {
        const current = get().account.coinsBalance ?? get().account.coinBalance ?? 0;
        if (current < amount) return false;
        const newTx: CoinTransaction = {
          id: `tx_${Date.now()}`,
          type: "usage",
          amount,
          service: "mom_transcribe",
          description: reason,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          const updatedBalance = (state.account.coinsBalance ?? 0) - amount;
          const updatedAccount = {
            ...state.account,
            coinsBalance: updatedBalance,
            coinBalance: updatedBalance,
          };
          const updatedTransactions = [newTx, ...state.transactions];
          return {
            account: updatedAccount,
            transactions: updatedTransactions,
            coinHistory: updatedTransactions,
          };
        });
        return true;
      },

      addCoins: (amount, reason = "Top-up Saldo Koin") => {
        const newTx: CoinTransaction = {
          id: `tx_${Date.now()}`,
          type: "topup",
          amount,
          service: "topup_pack",
          description: reason,
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          const updatedBalance = (state.account.coinsBalance ?? 0) + amount;
          const updatedAccount = {
            ...state.account,
            coinsBalance: updatedBalance,
            coinBalance: updatedBalance,
          };
          const updatedTransactions = [newTx, ...state.transactions];
          return {
            account: updatedAccount,
            transactions: updatedTransactions,
            coinHistory: updatedTransactions,
          };
        });
      },

      // NFC Card Profile (Clean Zero)
      cardProfile: DEFAULT_CARD_PROFILE,
      updateCardProfile: (updates) =>
        set((state) => ({
          cardProfile: { ...state.cardProfile, ...updates },
        })),
      incrementTaps: () =>
        set((state) => ({
          cardProfile: {
            ...state.cardProfile,
            metrics: {
              ...state.cardProfile.metrics,
              totalTaps: state.cardProfile.metrics.totalTaps + 1,
            },
          },
        })),

      // Meetings (Clean Zero)
      meetings: INITIAL_MEETINGS,
      activeRecording: false,
      recordingSeconds: 0,
      setMeetings: (meetings) => set({ meetings }),
      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [meeting, ...state.meetings],
          cardProfile: {
            ...state.cardProfile,
            metrics: {
              ...state.cardProfile.metrics,
              momInitiated: state.cardProfile.metrics.momInitiated + 1,
            },
          },
        })),
      setActiveRecording: (active) => set({ activeRecording: active }),
      setRecordingSeconds: (seconds) =>
        set((state) => ({
          recordingSeconds:
            typeof seconds === "function" ? seconds(state.recordingSeconds) : seconds,
        })),

      // Leads / Contacts (Clean Zero)
      contacts: INITIAL_CONTACTS,
      leads: INITIAL_CONTACTS,
      addContact: (contact) =>
        set((state) => {
          const updated = [contact, ...state.contacts];
          return {
            contacts: updated,
            leads: updated,
            cardProfile: {
              ...state.cardProfile,
              metrics: {
                ...state.cardProfile.metrics,
                contactsSaved: state.cardProfile.metrics.contactsSaved + 1,
              },
            },
          };
        }),
      updateContactStatus: (id, status) =>
        set((state) => {
          const updated = state.contacts.map((c) => (c.id === id ? { ...c, status } : c));
          return { contacts: updated, leads: updated };
        }),

      // Calendar & Scheduling
      calendarEvents: [
        {
          id: "ev_1",
          title: "Follow-up Demo Integrasi NFC Card & MoM",
          date: "2026-11-07",
          time: "14:00 - 15:00",
          attendees: "Deo Cardi Nathanael, Tim Bisnis",
          location: "Google Meet / Virtual Room",
          status: "upcoming",
          source: "MoM Action Item",
          googleCalendarUrl: "https://calendar.google.com",
        },
        {
          id: "ev_2",
          title: "Pertemuan Kerjasama NFC Smart Card",
          date: "2026-11-08",
          time: "10:30 - 11:30",
          attendees: "Client Baru (Tamu NFC)",
          location: "Plaza Senayan, Jakarta",
          status: "upcoming",
          source: "NFC Tap",
          googleCalendarUrl: "https://calendar.google.com",
        },
      ],
      isGoogleCalendarConnected: true,
      setGoogleCalendarConnected: (connected) => set({ isGoogleCalendarConnected: connected }),
      addCalendarEvent: (event) =>
        set((state) => ({ calendarEvents: [event, ...state.calendarEvents] })),
      deleteCalendarEvent: (id) =>
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((e) => e.id !== id),
        })),
      syncMomToCalendar: () => {
        const meetings = get().meetings;
        let syncedCount = 0;
        const newEvents: CalendarEvent[] = [];

        meetings.forEach((m) => {
          if (m.mom?.actionItems && m.mom.actionItems.length > 0) {
            m.mom.actionItems.forEach((ai, idx) => {
              const eventDate = ai.dueDate || new Date(Date.now() + (idx + 1) * 86400000).toISOString().split("T")[0];
              newEvents.push({
                id: `ev_mom_${m.id}_${idx}`,
                title: `[Tindak Lanjut] ${ai.item}`,
                date: eventDate,
                time: "09:00 - 10:00",
                attendees: `${ai.owner || "PIC"} & Tim`,
                location: "Google Meet / Ruang Rapat",
                status: "upcoming",
                source: "MoM Action Item",
                momId: m.id,
                notes: `Dibuat otomatis dari notula AI: ${m.title}`,
                googleCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  `[Action Item] ${ai.item}`
                )}&dates=${eventDate.replace(/-/g, "")}T020000Z/${eventDate.replace(/-/g, "")}T030000Z&details=${encodeURIComponent(
                  `Tindak lanjut dari notula rapat: ${m.title}\nPIC: ${ai.owner}`
                )}`,
              });
              syncedCount++;
            });
          }
        });

        if (newEvents.length > 0) {
          set((state) => ({
            calendarEvents: [...newEvents, ...state.calendarEvents],
          }));
        }
        return syncedCount;
      },

      // Transactions history (Clean Zero)
      transactions: INITIAL_TRANSACTIONS,
      coinHistory: INITIAL_TRANSACTIONS,

      // Switcher
      currentProductTab: "card",
      setCurrentProductTab: (tab) => set({ currentProductTab: tab }),

      // Theme & Localization (Dark / Light, ID / EN) - Default: Light Mode
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      locale: "id",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set((s) => ({ locale: s.locale === "id" ? "en" : "id" })),
    }),
    {
      name: "cardi_nfc_storage_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
