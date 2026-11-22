export type AgentKey = "raka" | "dina" | "sari" | "reno" | "bima";
export type AgentStatus = "idle" | "working" | "done";
export type ChatTarget = "auto" | AgentKey;
export type WorkspaceCategory = "trends" | "content" | "ads" | "qa";

export interface WorkspaceFileItem {
  category: WorkspaceCategory;
  fileName: string;
  relativePath: string;
  sizeBytes: number;
  updatedAt: string;
}

export interface AssetFileItem {
  fileName: string;
  relativePath: string;
  mediaType: "image" | "video";
  sizeBytes: number;
  updatedAt: string;
}

export interface AgentInfo {
  name: string;
  role: string;
  desk: string;
  status: AgentStatus;
  task: string;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatarColor: string;
  message: string;
  timestamp: string;
  type?: "system" | "update" | "info" | "user";
}

export interface OfficeState {
  officeName: string;
  lastUpdated: string;
  agents: Record<AgentKey, AgentInfo>;
  chatLog: ChatMessage[];
}

export const AGENT_ORDER: AgentKey[] = ["raka", "dina", "sari", "reno", "bima"];

/**
 * Builds a clean default idle state for all 5 Kawan Belanja virtual office agents.
 */
export function createDefaultOfficeState(reason?: string): OfficeState {
  const now = new Date().toISOString();

  return {
    officeName: "Kantor Virtual Marketing & Ads — Kawan Belanja",
    lastUpdated: now,
    agents: {
      raka: {
        name: "Raka",
        role: "Trend & Market Researcher",
        desk: "Meja Riset",
        status: "idle",
        task: "Siap meriset tren belanja, keluhan seller, dan peluang pasar UMKM.",
        avatarColor: "#3B82F6",
      },
      dina: {
        name: "Dina",
        role: "Social Media & Copywriter",
        desk: "Meja Konten",
        status: "idle",
        task: "Siap mengubah topik riset jadi paket konten 7 hari (IG, TikTok, FB, Threads, X, WA).",
        avatarColor: "#EC4899",
      },
      sari: {
        name: "Sari",
        role: "Meta Ads & Funnel Strategist",
        desk: "Meja Meta Ads",
        status: "idle",
        task: "Siap menyusun draf kampanye Meta Ads (PAUSED) & prompt Google Flow.",
        avatarColor: "#F59E0B",
      },
      reno: {
        name: "Reno",
        role: "Visual & Video Producer",
        desk: "Meja Studio Visual",
        status: "idle",
        task: "Siap mengumpulkan aset & merender poster PNG / video Reels Remotion ke workspace/assets/.",
        avatarColor: "#8B5CF6",
      },
      bima: {
        name: "Bima",
        role: "Brand QA & Reporter",
        desk: "Meja QA Checker",
        status: "idle",
        task: "Siap memeriksa akurasi USP, validasi aset visual, & kirim laporan ke Founder.",
        avatarColor: "#10B981",
      },
    },
    chatLog: [
      {
        id: `msg-reset-${Date.now()}`,
        sender: "Sistem Kantor",
        role: "Koordinator Kawan Belanja",
        avatarColor: "#6366F1",
        message:
          reason ??
          "Status kantor direset. Seluruh 5 divisi (Raka, Dina, Sari, Reno, Bima) kembali dalam status idle dan siap menerima penugasan baru. Aturan keamanan aktif: hanya draf siap pakai & kampanye PAUSED.",
        timestamp: now,
        type: "system",
      },
    ],
  };
}
