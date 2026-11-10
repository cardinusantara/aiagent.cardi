import type {  CardProfile, UserAccount  } from "./types";

export interface UserEntity {
  account: UserAccount;
  cardProfile: CardProfile;
}

export const USER_REGISTRY: Record<string, UserEntity> = {
  deo: {
    account: {
      email: "deo@cardi.co.id",
      name: "Deo Cardi Nathanael",
      avatarUrl: "",
      coinsBalance: 250,
      coinBalance: 250,
      freemiumGranted: true,
      subscription: {
        status: "active",
        tier: "pro",
        currentPeriodEnd: "2026-12-31T00:00:00Z",
      },
      pairedApp: {
        deviceId: "dev_iphone_16",
        deviceModel: "iPhone 16 Pro (Cardi MoM App)",
        pairedAt: "2026-10-15T08:30:00Z",
      },
    },
    cardProfile: {
      username: "deo",
      fullName: "Deo Cardi Nathanael",
      headline: "Founder & Chief Executive Officer",
      company: "Cardi Nusantara AI",
      phone: "+62 812-8899-0011",
      email: "deo@cardi.co.id",
      website: "https://cardi.co.id",
      location: "Jakarta, Indonesia",
      bio: "Membangun ekosistem AI Meeting Intelligence dan Smart NFC Networking generasi baru di Indonesia.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
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
    },
  },
  alexander: {
    account: {
      email: "alexander@cardi.co.id",
      name: "Alexander Pratama",
      avatarUrl: "",
      coinsBalance: 180,
      coinBalance: 180,
      freemiumGranted: true,
      subscription: {
        status: "active",
        tier: "pro",
        currentPeriodEnd: "2026-11-22T00:00:00Z",
      },
      pairedApp: {
        deviceId: "dev_samsung_s24",
        deviceModel: "Samsung Galaxy S24 Ultra (Cardi MoM App)",
        pairedAt: "2026-10-20T10:00:00Z",
      },
    },
    cardProfile: {
      username: "alexander",
      fullName: "Alexander Pratama",
      headline: "Chief Technology Officer & AI Engineer",
      company: "Cardi Nusantara AI",
      phone: "+62 812-3456-7890",
      email: "alexander@cardi.co.id",
      website: "https://cardi.co.id",
      location: "Jakarta Selatan, Indonesia",
      bio: "Membangun teknologi otomasi rapat dan smart NFC networking generasi terbaru di Indonesia.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      cardDesign: "royal-blue",
      socials: {
        whatsapp: "https://wa.me/6281234567890",
        linkedin: "https://linkedin.com/in/alexander-pratama",
        github: "https://github.com/cardinusantara",
      },
      metrics: {
        totalTaps: 142,
        contactsSaved: 89,
        momInitiated: 24,
      },
    },
  },
  budi: {
    account: {
      email: "budi@mandiritech.id",
      name: "Budi Hartono",
      avatarUrl: "",
      coinsBalance: 75,
      coinBalance: 75,
      freemiumGranted: true,
      subscription: {
        status: "active",
        tier: "free",
        currentPeriodEnd: null,
      },
    },
    cardProfile: {
      username: "budi",
      fullName: "Budi Hartono",
      headline: "Head of Business Development",
      company: "PT Mandiri Tech",
      phone: "+62 811-9876-5432",
      email: "budi@mandiritech.id",
      website: "https://mandiritech.id",
      location: "SCBD Jakarta, Indonesia",
      bio: "Fokus pada akselerasi kemitraan strategis corporate B2B dan enterprise IoT.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      cardDesign: "silver-minimal",
      socials: {
        whatsapp: "https://wa.me/6281198765432",
        linkedin: "https://linkedin.com/in/budihartono",
      },
      metrics: {
        totalTaps: 45,
        contactsSaved: 31,
        momInitiated: 8,
      },
    },
  },
};

export function getProfileByUsername(username: string): CardProfile {
  const key = username.toLowerCase().trim();
  if (USER_REGISTRY[key]) {
    return USER_REGISTRY[key].cardProfile;
  }
  // Fallback template for any arbitrary username entered
  return {
    username: key,
    fullName: key.charAt(0).toUpperCase() + key.slice(1),
    headline: "Professional Member",
    company: "Cardi Network",
    phone: "+62 812-0000-0000",
    email: `${key}@cardi.co.id`,
    website: "https://cardi.co.id",
    location: "Indonesia",
    bio: "Pengguna kartu bisnis pintar Cardi Smart NFC Card & AI MoM.",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${key}`,
    cardDesign: "black-gold",
    socials: {
      whatsapp: "https://wa.me/6281200000000",
    },
    metrics: {
      totalTaps: 1,
      contactsSaved: 0,
      momInitiated: 0,
    },
  };
}

