"use client";

import React from "react";
import { CheckCircle2, Coffee, Sparkles } from "lucide-react";
import type { AgentInfo, AgentKey, AgentStatus } from "@/lib/office";
import { PixelAvatar } from "./PixelAvatar";

interface DeskCardProps {
  agentKey: AgentKey;
  agent: AgentInfo;
}

const STATUS_BADGE: Record<
  AgentStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  working: {
    label: "Working",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-400/40",
    dot: "bg-amber-400 animate-pulse",
  },
  idle: {
    label: "Idle / Standby",
    bg: "bg-slate-800/80",
    text: "text-slate-300",
    border: "border-slate-700",
    dot: "bg-slate-400",
  },
  done: {
    label: "Done",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-400/40",
    dot: "bg-emerald-400",
  },
};

export function DeskCard({ agentKey, agent }: DeskCardProps) {
  const badge = STATUS_BADGE[agent.status] ?? STATUS_BADGE.idle;
  const isWorking = agent.status === "working";
  const isDone = agent.status === "done";

  return (
    <article
      className={`isometric-desk-card group relative flex flex-col justify-between rounded-2xl border bg-slate-900/90 p-4 transition-all duration-300 ${
        isWorking
          ? "border-amber-400/60 ring-1 ring-amber-400/20"
          : isDone
          ? "border-emerald-400/60 ring-1 ring-emerald-400/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Top Row: Desk Nameplate & Status Pill */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-sm shadow-sm"
            style={{ backgroundColor: agent.avatarColor }}
          />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            {agent.desk}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      {/* Floating Task Speech Bubble above Character */}
      <div className="animate-bubble relative mb-2 rounded-xl border border-slate-700/80 bg-slate-950/90 px-3.5 py-2.5 shadow-inner">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink-0">
            {isWorking ? (
              <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
            ) : isDone ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Coffee className="h-4 w-4 text-slate-400" />
            )}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-200">
            {agent.task}
          </p>
        </div>
        {/* Speech bubble pointer */}
        <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-700/80 bg-slate-950" />
      </div>

      {/* Isometric Pixel Workstation Avatar */}
      <PixelAvatar
        agentKey={agentKey}
        status={agent.status}
        avatarColor={agent.avatarColor}
      />

      {/* Bottom Agent Nameplate */}
      <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-950/75 px-3 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-white">
              {agent.name}
            </h3>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-950"
              style={{ backgroundColor: agent.avatarColor }}
            >
              @{agentKey}
            </span>
          </div>
          <p className="truncate text-xs text-slate-400">{agent.role}</p>
        </div>
      </div>
    </article>
  );
}
