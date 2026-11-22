"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Hash,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ChatMessage, ChatTarget } from "@/lib/office";

interface OfficeChatProps {
  messages: ChatMessage[];
  isResetting: boolean;
  onReset: () => void;
  aiConfigured: boolean | null;
  aiModel: string;
  isSending: boolean;
  sendError: string | null;
  onSendMessage: (message: string, target: ChatTarget) => Promise<boolean>;
}

const TARGET_OPTIONS: Array<{
  id: ChatTarget;
  label: string;
  hint: string;
}> = [
  { id: "auto", label: "Estafet (Semua)", hint: "Raka → Dina → Sari → Reno → Bima" },
  { id: "raka", label: "@raka", hint: "Riset Tren" },
  { id: "dina", label: "@dina", hint: "Konten 7 Hari" },
  { id: "sari", label: "@sari", hint: "Meta Ads & Flow" },
  { id: "reno", label: "@reno", hint: "Studio Visual" },
  { id: "bima", label: "@bima", hint: "QA & Reporter" },
];

function formatWibTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "--:--";
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date);
  } catch {
    return "--:--";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function OfficeChat({
  messages,
  isResetting,
  onReset,
  aiConfigured,
  aiModel,
  isSending,
  sendError,
  onSendMessage,
}: OfficeChatProps) {
  const [draft, setDraft] = useState("");
  const [target, setTarget] = useState<ChatTarget>("auto");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef<number>(messages.length);

  useEffect(() => {
    if (messages.length !== prevCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      prevCountRef.current = messages.length;
    }
  }, [messages.length]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;

    const ok = await onSendMessage(trimmed, target);
    if (ok) {
      setDraft("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <aside className="flex h-full min-h-[580px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl">
      {/* Slack-style Channel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Hash className="h-4 w-4 shrink-0 text-indigo-400" />
            <h2 className="truncate text-sm font-bold text-white">
              kantor-kawanbelanja
            </h2>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">
            Office Chat (Slack-Style) · Model:{" "}
            <span className="font-mono text-slate-300">{aiModel}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isResetting || isSending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          title="Kembalikan seluruh agen ke status idle"
        >
          <RotateCcw
            className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`}
          />
          <span>{isResetting ? "Mereset..." : "Reset Status Kantor"}</span>
        </button>
      </div>

      {/* Safety Notice Strip */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 bg-indigo-950/30 px-4 py-2 text-[11px] text-indigo-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <span>
            Mode Aman: Draf &amp; Ads{" "}
            <strong className="font-mono text-amber-300">PAUSED</strong>
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">Sync 1.5s</span>
      </div>

      {/* Messages Feed */}
      <div className="chat-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">
            Belum ada log aktivitas kantor.
          </div>
        ) : (
          messages.map((msg) => {
            const isSystem = msg.type === "system";
            const isUser = msg.type === "user";

            return (
              <div
                key={msg.id}
                className={`rounded-xl border p-3 transition ${
                  isUser
                    ? "border-violet-500/40 bg-violet-950/25"
                    : isSystem
                    ? "border-indigo-500/30 bg-indigo-950/25"
                    : "border-slate-800/90 bg-slate-950/60 hover:border-slate-700/80"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-slate-950 shadow-sm"
                    style={{ backgroundColor: msg.avatarColor || "#6366F1" }}
                  >
                    {getInitials(msg.sender)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {msg.sender}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            isUser
                              ? "bg-violet-500/20 text-violet-200"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {msg.role}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {formatWibTime(msg.timestamp)} WIB
                      </span>
                    </div>

                    <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-200">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Chat Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-800 bg-slate-950/90 p-3.5"
      >
        {aiConfigured === false && (
          <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] leading-snug text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>
              <strong className="font-semibold">GEMINI_API_KEY</strong> belum diisi di{" "}
              <code className="rounded bg-slate-900 px-1 py-0.5 font-mono text-[10px] text-amber-300">
                office-ui/.env.local
              </code>
              . Isi API key lalu restart <code className="font-mono">npm.cmd run dev</code> agar chat aktif.
            </span>
          </div>
        )}

        {sendError && (
          <div className="mb-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] leading-snug text-rose-200">
            {sendError}
          </div>
        )}

        {/* Target Division Selector */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {TARGET_OPTIONS.map((opt) => {
            const active = target === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isSending}
                onClick={() => setTarget(opt.id)}
                title={opt.hint}
                className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                  active
                    ? "border-indigo-400 bg-indigo-500/25 text-indigo-100"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Input Box & Send Button */}
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder={
              target === "auto"
                ? "Tulis brief topik untuk estafet 4 divisi (Enter kirim, Shift+Enter baris baru)..."
                : `Tulis perintah khusus untuk @${target}...`
            }
            className="min-h-[56px] flex-1 resize-none rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            className="inline-flex h-[56px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Proses...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Kirim</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Hasil otomatis tersimpan ke folder <code className="font-mono text-slate-400">workspace/</code>
          </span>
          <span className="font-mono">Enter = Kirim</span>
        </div>
      </form>
    </aside>
  );
}
