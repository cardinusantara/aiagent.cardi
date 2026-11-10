// Cardi Ecosystem Type Definitions
// Aligned with @cardi/shared backend contracts and NFC Business Card requirements

export type AppTheme = "dark" | "light";
export type AppLocale = "id" | "en";

export type SubscriptionTier = "free" | "pro" | "team";

export interface AccountSubscriptionSummary {
  status: "none" | "active" | "canceled" | "lapsed";
  tier: SubscriptionTier | null;
  currentPeriodEnd: string | null;
}

export interface PairedDevice {
  deviceId: string;
  deviceModel: string;
  pairedAt: string;
}

export interface UserAccount {
  email: string;
  name?: string;
  avatarUrl?: string;
  coinsBalance: number;
  coinBalance?: number; // alias for convenience
  freemiumGranted: boolean;
  subscription: AccountSubscriptionSummary;
  pairedApp?: PairedDevice | null;
}

export interface AuthSession {
  token: string;
  account: UserAccount;
}

export interface PairStartResponse {
  pairingId: string;
  expiresAt: string;
}

export type PairPollResponse =
  | { status: "pending" }
  | { status: "expired" }
  | { status: "confirmed"; sessionToken: string; account: UserAccount };

// Minutes of Meeting (MoM)
export interface MomListItem {
  text: string;
  sourceMs: number[];
}

export interface ActionItem {
  item: string;
  owner: string;
  dueDate: string | null;
  dueDateText: string | null;
  sourceMs: number[];
}

export interface DiscussionPoint {
  topic: string;
  detail: string;
  sourceMs: number[];
}

export interface Mom {
  shortSummary: string;
  executiveSummary: string;
  discussionPoints: DiscussionPoint[];
  decisions: MomListItem[];
  actionItems: ActionItem[];
  openIssues: MomListItem[];
  nextSteps: MomListItem[];
  model: string;
  promptVersion: string;
}

export type MeetingStatus =
  | "scheduled"
  | "recording"
  | "awaiting_upload"
  | "transcribing"
  | "summarizing"
  | "ready"
  | "failed";

export interface Meeting {
  id: string;
  title: string;
  titleIsDefault: boolean;
  date: string;
  startTime: string | null;
  durationMinutes: number | null;
  attendees: string | null;
  location: string | null;
  status: MeetingStatus;
  failedStage: string | null;
  failureReason: string | null;
  mom: Mom | null;
  momReadAt: string | null;
  updatedAt: string;
  createdAt: string;
  audioUrl?: string | null;
}

// Calendar Event Definition
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm - HH:mm
  attendees: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  source: "NFC Tap" | "MoM Action Item" | "Manual" | "Google Calendar";
  googleCalendarUrl?: string;
  momId?: string;
  notes?: string;
}

export interface SyncResponse {
  entries: Array<{ deleted: false; meeting: Meeting } | { deleted: true; id: string; updatedAt: string }>;
  until: string;
  account: { coinsBalance: number; subscription: AccountSubscriptionSummary } | null;
}

// NFC Digital Card Profile
export interface CardProfile {
  username: string;
  fullName: string;
  headline: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  bio: string;
  avatarUrl: string;
  cardDesign: "black-gold" | "royal-blue" | "silver-minimal";
  socials: {
    whatsapp?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    twitter?: string;
  };
  metrics: {
    totalTaps: number;
    contactsSaved: number;
    momInitiated: number;
  };
}

// Contact / Lead Entity
export type LeadStatus = "hot" | "warm" | "cold";

export interface ContactLead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  tappedAt?: string;
  createdAt: string;
  status: LeadStatus;
  notes?: string;
  connectedMomId?: string;
}

// Wallet & Coin Transaction
export interface CoinTransaction {
  id: string;
  type: "usage" | "topup" | "bonus";
  amount: number;
  service: "mom_transcribe" | "nfc_card_tap" | "voice_schedule" | "topup_pack";
  description: string;
  timestamp?: string;
  createdAt: string;
}
