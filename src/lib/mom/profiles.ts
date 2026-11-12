import type { CardProfile, UserAccount } from "./types";

export interface UserEntity {
  account: UserAccount;
  cardProfile: CardProfile;
}

// Hanya menyimpan verified profile organisasi atau kosong jika belum terdaftar
export const USER_REGISTRY: Record<string, UserEntity> = {
  deo: {
    account: {
      email: "deo@cardi.co.id",
      name: "Deo Cardi Nathanael",
      avatarUrl: "",
      coinsBalance: 0,
      coinBalance: 0,
      freemiumGranted: true,
      subscription: {
        status: "active",
        tier: "pro",
        currentPeriodEnd: "2026-12-31T00:00:00Z",
      },
      pairedApp: {
        deviceId: "dev_verified_primary",
        deviceModel: "Cardi MoM App",
        pairedAt: "2026-01-01T00:00:00Z",
      },
    },
    cardProfile: {
      username: "deo",
      fullName: "Deo Cardi Nathanael",
      headline: "Founder & Chief Executive Officer",
      company: "Cardi",
      phone: "+62 812-8899-0011",
      email: "deo@cardi.co.id",
      website: "https://www.cardi.co.id",
      location: "Jakarta, Indonesia",
      bio: "Membangun solusi AI Meeting Intelligence dan Smart NFC Networking untuk efisiensi bisnis.",
      avatarUrl: "",
      cardDesign: "black-gold",
      socials: {
        whatsapp: "https://wa.me/6281288990011",
        linkedin: "https://linkedin.com/in/deocardi",
      },
      metrics: {
        totalTaps: 0,
        contactsSaved: 0,
        momInitiated: 0,
      },
    },
  },
};

export function getProfileByUsername(username: string): CardProfile {
  const key = username.toLowerCase().trim();
  if (USER_REGISTRY[key]) {
    return USER_REGISTRY[key].cardProfile;
  }
  // Default clean profile template untuk username baru (tanpa data fiktif / fake stats)
  return {
    username: key,
    fullName: key.charAt(0).toUpperCase() + key.slice(1),
    headline: "Pengguna Cardi Smart Card",
    company: "Cardi Network",
    phone: "",
    email: "",
    website: "https://www.cardi.co.id",
    location: "Indonesia",
    bio: "Pengguna kartu bisnis pintar Cardi Smart NFC Card dan AI MoM.",
    avatarUrl: "",
    cardDesign: "black-gold",
    socials: {},
    metrics: {
      totalTaps: 0,
      contactsSaved: 0,
      momInitiated: 0,
    },
  };
}


