"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BadgePercent,
  CheckCircle2,
  Clock,
  RefreshCw,
  Scale,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { AGENT_ORDER, type ChatTarget, type OfficeState } from "@/lib/office";
import { DeskCard } from "./DeskCard";
import { OfficeChat } from "./OfficeChat";
import { AssetGallery } from "./AssetGallery";
import { WorkspaceViewer } from "./WorkspaceViewer";

export function VirtualOfficeDashboard() {
  const [officeState, setOfficeState] = useState<OfficeState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [aiModel, setAiModel] = useState<string>("gemini-3.8-flash");
  const [lastPolledAt, setLastPolledAt] = useState<string>("--:--:--");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as OfficeState;
      setOfficeState(data);
      setError(null);
      setLastPolledAt(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }).format(new Date())
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat status";
      setError(msg);
    }
  }, []);

  const fetchChatConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        configured?: boolean;
        model?: string;
      };
      if (typeof data.configured === "boolean") {
        setAiConfigured(data.configured);
      }
      if (typeof data.model === "string" && data.model) {
        setAiModel(data.model);
      }
    } catch {
      // Non-fatal check
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
    void fetchChatConfig();

    const timer = setInterval(() => {
      void fetchStatus();
    }, 1500);

    return () => clearInterval(timer);
  }, [fetchStatus, fetchChatConfig]);

  const handleReset = async () => {
    setIsResetting(true);
    setSendError(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as OfficeState;
      setOfficeState(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mereset status";
      setError(msg);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendMessage = async (
    message: string,
    target: ChatTarget
  ): Promise<boolean> => {
    setIsSending(true);
    setSendError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, target }),
      });

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        state?: OfficeState;
      } | null;

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      if (data?.state) {
        setOfficeState(data.state);
      } else {
        await fetchStatus();
      }
      setAiConfigured(true);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim perintah ke AI agen.";
      setSendError(msg);
      await fetchStatus();
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const agentList = officeState
    ? AGENT_ORDER.map((key) => ({
        key,
        info: officeState.agents[key],
      })).filter((item) => Boolean(item.info))
    : [];

  const workingCount = agentList.filter((a) => a.info.status === "working").length;
  const doneCount = agentList.filter((a) => a.info.status === "done").length;
  const idleCount = agentList.filter((a) => a.info.status === "idle").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/90 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/25">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  {officeState?.officeName ??
                    "Kantor Virtual Marketing & Ads — Kawan Belanja"}
                </h1>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                  kawanbelanja.com
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-slate-300">
                  <BadgePercent className="h-3.5 w-3.5 text-blue-400" />
                  Admin Flat 4%
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-slate-300">
                  <Scale className="h-3.5 w-3.5 text-pink-400" />
                  Fair Rank Bergiliran
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-slate-300">
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  COD &amp; Voucher Ongkir/Diskon
                </span>
              </div>
            </div>
          </div>

          {/* Live Telemetry & Counters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-amber-300">
                <Activity className="h-3.5 w-3.5" />
                {workingCount} Working
              </span>
              <span className="text-slate-700">|</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                <Clock className="h-3.5 w-3.5" />
                {idleCount} Idle
              </span>
              <span className="text-slate-700">|</span>
              <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {doneCount} Done
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-[11px] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>LIVE · {lastPolledAt} WIB</span>
              <RefreshCw className="ml-1 h-3 w-3 text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
            Terjadi gangguan membaca status kantor: <span className="font-mono">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left: Isometric Office Floor (4 Desks) */}
          <section className="xl:col-span-8">
            <div className="office-floor-grid rounded-3xl border border-slate-800/90 p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Denah Lantai Kantor Virtual (Isometric Grid)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pantau animasi &amp; progres real-time seluruh divisi Kawan Belanja
                  </p>
                </div>
                <span className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                  {agentList.length || 5} Meja Aktif
                </span>
              </div>

              {!officeState ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {AGENT_ORDER.map((k) => (
                    <div
                      key={k}
                      className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {agentList.map(({ key, info }) => (
                    <DeskCard key={key} agentKey={key} agent={info} />
                  ))}
                </div>
              )}
            </div>

            <AssetGallery refreshTrigger={officeState?.lastUpdated} />

            <WorkspaceViewer refreshTrigger={officeState?.lastUpdated} />
          </section>

          {/* Right: Slack-Style Office Chat + Interactive Composer */}
          <section className="xl:col-span-4">
            <div className="h-full xl:sticky xl:top-6 xl:h-[calc(100vh-124px)]">
              <OfficeChat
                messages={officeState?.chatLog ?? []}
                isResetting={isResetting}
                onReset={handleReset}
                aiConfigured={aiConfigured}
                aiModel={aiModel}
                isSending={isSending}
                sendError={sendError}
                onSendMessage={handleSendMessage}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
