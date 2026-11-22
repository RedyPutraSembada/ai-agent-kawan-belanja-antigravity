"use client";

import React from "react";
import type { AgentKey, AgentStatus } from "@/lib/office";

interface PixelAvatarProps {
  agentKey: AgentKey;
  status: AgentStatus;
  avatarColor: string;
}

const HAIR_COLOR: Record<AgentKey, string> = {
  raka: "#1E293B",
  dina: "#4C1D95",
  sari: "#78350F",
  reno: "#312E81",
  bima: "#0F172A",
};

const SKIN_COLOR: Record<AgentKey, string> = {
  raka: "#FDBA74",
  dina: "#FED7AA",
  sari: "#FDBA74",
  reno: "#FED7AA",
  bima: "#F59E0B",
};

export function PixelAvatar({ agentKey, status, avatarColor }: PixelAvatarProps) {
  const isWorking = status === "working";
  const isIdle = status === "idle";
  const isDone = status === "done";

  const hair = HAIR_COLOR[agentKey];
  const skin = agentKey === "bima" ? "#FBBF77" : SKIN_COLOR[agentKey];

  return (
    <div className="relative mx-auto flex h-44 w-full max-w-[230px] items-center justify-center select-none">
      {/* Ambient floor glow under desk */}
      <div
        className="pointer-events-none absolute bottom-3 h-16 w-44 rounded-full blur-xl transition-all duration-500"
        style={{
          backgroundColor: isWorking
            ? avatarColor
            : isDone
            ? "#10B981"
            : "#334155",
          opacity: isWorking ? 0.35 : isDone ? 0.28 : 0.16,
        }}
      />

      {/* Done floating green badge */}
      {isDone && (
        <div className="animate-done-badge absolute right-3 top-2 z-20 flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0L2.72 7.78a.75.75 0 0 1 1.06-1.06L7 9.94l5.72-5.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
          <span>SELESAI</span>
        </div>
      )}

      {/* Working active indicator pill */}
      {isWorking && (
        <div className="absolute right-3 top-2 z-20 flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-amber-300 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          AKTIF
        </div>
      )}

      {/* Isometric Desk + Pixel Character SVG */}
      <svg
        viewBox="0 0 220 170"
        className="relative z-10 h-full w-full overflow-visible"
        role="img"
        aria-label={`Ilustrasi meja kerja ${agentKey} status ${status}`}
      >
        {/* Isometric floor tile shadow */}
        <polygon
          points="110,158 22,118 110,78 198,118"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="2"
        />
        <polygon
          points="110,152 32,117 110,82 188,117"
          fill="#131C31"
          stroke={isWorking ? avatarColor : isDone ? "#10B981" : "#334155"}
          strokeOpacity={isWorking ? "0.6" : "0.35"}
          strokeWidth="1.5"
        />

        {/* Character Chair Backrest */}
        <rect
          x="86"
          y="46"
          width="48"
          height="42"
          rx="6"
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Character Body Group */}
        <g className={isWorking ? "animate-typing-body" : "animate-idle-body"}>
          {/* Torso / Shirt */}
          <rect
            x="84"
            y="68"
            width="52"
            height="34"
            rx="8"
            fill={avatarColor}
          />
          {/* Collar / Hoodie detail */}
          <rect
            x="101"
            y="68"
            width="18"
            height="8"
            rx="3"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />

          {/* Head */}
          <rect
            x="92"
            y="30"
            width="36"
            height="36"
            rx="8"
            fill={skin}
          />

          {/* Hair styles per agent */}
          {agentKey === "raka" && (
            <>
              <rect x="90" y="25" width="40" height="14" rx="5" fill={hair} />
              <rect x="90" y="32" width="6" height="12" rx="2" fill={hair} />
              <rect x="124" y="32" width="6" height="12" rx="2" fill={hair} />
            </>
          )}
          {agentKey === "dina" && (
            <>
              <rect x="89" y="24" width="42" height="16" rx="6" fill={hair} />
              <rect x="88" y="34" width="8" height="24" rx="3" fill={hair} />
              <rect x="124" y="34" width="8" height="24" rx="3" fill={hair} />
              {/* Studio headphones */}
              <path
                d="M89 44 C89 22, 131 22, 131 44"
                fill="none"
                stroke="#F472B6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <rect x="85" y="39" width="7" height="14" rx="3" fill="#EC4899" />
              <rect x="128" y="39" width="7" height="14" rx="3" fill="#EC4899" />
            </>
          )}
          {agentKey === "sari" && (
            <>
              <rect x="90" y="25" width="40" height="14" rx="6" fill={hair} />
              <circle cx="129" cy="28" r="7" fill={hair} />
              <rect x="89" y="33" width="6" height="16" rx="2" fill={hair} />
            </>
          )}
          {agentKey === "reno" && (
            <>
              <rect x="89" y="24" width="42" height="13" rx="5" fill={hair} />
              <rect x="92" y="21" width="24" height="6" rx="2" fill="#A78BFA" />
              <rect x="88" y="33" width="5" height="10" rx="2" fill={hair} />
            </>
          )}
          {agentKey === "bima" && (
            <>
              <rect x="91" y="26" width="38" height="12" rx="4" fill={hair} />
              <rect x="95" y="23" width="30" height="6" rx="2" fill={hair} />
            </>
          )}

          {/* Eyes */}
          {isIdle ? (
            <>
              {/* Relaxed calm eyes */}
              <rect x="99" y="46" width="6" height="2.5" rx="1" fill="#0F172A" />
              <rect x="115" y="46" width="6" height="2.5" rx="1" fill="#0F172A" />
            </>
          ) : (
            <>
              <rect x="100" y="44" width="5" height="6" rx="1.5" fill="#0F172A" />
              <rect x="115" y="44" width="5" height="6" rx="1.5" fill="#0F172A" />
              <rect x="101" y="45" width="2" height="2" fill="#FFFFFF" />
              <rect x="116" y="45" width="2" height="2" fill="#FFFFFF" />
            </>
          )}

          {/* Raka's glasses */}
          {agentKey === "raka" && (
            <g stroke="#0F172A" strokeWidth="2" fill="none">
              <rect x="97" y="42" width="11" height="9" rx="2" fill="#38BDF8" fillOpacity="0.18" />
              <rect x="112" y="42" width="11" height="9" rx="2" fill="#38BDF8" fillOpacity="0.18" />
              <line x1="108" y1="46" x2="112" y2="46" />
            </g>
          )}

          {/* Mouth */}
          {isDone ? (
            <path
              d="M104 56 Q110 61 116 56"
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ) : isWorking ? (
            <rect x="106" y="56" width="8" height="2.5" rx="1" fill="#7C2D12" />
          ) : (
            <path
              d="M105 56 Q110 59 115 56"
              fill="none"
              stroke="#7C2D12"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Isometric Desk Surface */}
        <polygon
          points="42,102 110,74 178,102 110,130"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="2"
        />
        {/* Desk Front Left & Right Thickness */}
        <polygon
          points="42,102 110,130 110,141 42,113"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <polygon
          points="110,130 178,102 178,113 110,141"
          fill="#162033"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Desk LED Status Strip */}
        <line
          x1="46"
          y1="104"
          x2="108"
          y2="130"
          stroke={isWorking ? avatarColor : isDone ? "#10B981" : "#334155"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Laptop / Workstation Monitor */}
        <g className={isWorking ? "animate-screen-pulse" : ""}>
          {/* Laptop base */}
          <polygon
            points="88,97 110,88 132,97 110,106"
            fill="#334155"
            stroke="#64748B"
            strokeWidth="1.2"
          />
          {/* Laptop upright screen */}
          <rect
            x="88"
            y="66"
            width="44"
            height="28"
            rx="3"
            fill="#0F172A"
            stroke="#64748B"
            strokeWidth="2"
          />
          {/* Screen Display Content */}
          <rect
            x="92"
            y="70"
            width="36"
            height="20"
            rx="1.5"
            fill={isWorking ? "#0B192C" : isDone ? "#052E16" : "#1E293B"}
          />

          {/* Role-specific screen graphics */}
          {isWorking && (
            <>
              {agentKey === "raka" && (
                <g>
                  <rect x="96" y="81" width="5" height="6" fill="#38BDF8" />
                  <rect x="103" y="76" width="5" height="11" fill="#60A5FA" />
                  <rect x="110" y="73" width="5" height="14" fill="#93C5FD" />
                  <rect x="117" y="78" width="5" height="9" fill="#3B82F6" />
                </g>
              )}
              {agentKey === "dina" && (
                <g>
                  <rect x="96" y="73" width="24" height="3" rx="1" fill="#F472B6" />
                  <rect x="96" y="78" width="18" height="2.5" rx="1" fill="#FBCFE8" />
                  <rect x="96" y="83" width="26" height="2.5" rx="1" fill="#EC4899" />
                </g>
              )}
              {agentKey === "sari" && (
                <g>
                  <circle cx="104" cy="80" r="6" fill="none" stroke="#FBBF24" strokeWidth="2" />
                  <circle cx="104" cy="80" r="2" fill="#F59E0B" />
                  <rect x="114" y="75" width="10" height="3" rx="1" fill="#FDE68A" />
                  <rect x="114" y="81" width="8" height="3" rx="1" fill="#F59E0B" />
                </g>
              )}
              {agentKey === "reno" && (
                <g>
                  <polygon points="99,74 99,86 109,80" fill="#A78BFA" />
                  <rect x="112" y="75" width="12" height="3" rx="1" fill="#C4B5FD" />
                  <rect x="112" y="81" width="9" height="3" rx="1" fill="#8B5CF6" />
                </g>
              )}
              {agentKey === "bima" && (
                <g>
                  <rect x="96" y="74" width="10" height="3" rx="1" fill="#34D399" />
                  <rect x="96" y="80" width="16" height="3" rx="1" fill="#6EE7B7" />
                  <path
                    d="M116 80 L119 83 L125 76"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </>
          )}

          {isDone && (
            <path
              d="M103 80 L108 85 L118 75"
              fill="none"
              stroke="#34D399"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {isIdle && (
            <text
              x="110"
              y="83"
              textAnchor="middle"
              fill="#64748B"
              fontSize="8"
              fontWeight="bold"
              fontFamily="monospace"
            >
              STANDBY
            </text>
          )}
        </g>

        {/* Typing Hands (animated when working) */}
        <g>
          <rect
            x="92"
            y="91"
            width="10"
            height="7"
            rx="3"
            fill={skin}
            className={isWorking ? "animate-hand-left" : ""}
          />
          <rect
            x="118"
            y="91"
            width="10"
            height="7"
            rx="3"
            fill={skin}
            className={isWorking ? "animate-hand-right" : ""}
          />
        </g>

        {/* Left Desk Accessory: Coffee Mug (steaming when idle) */}
        <g transform="translate(56, 86)">
          {isIdle && (
            <>
              <path
                d="M4 -2 C2 -6, 6 -8, 4 -12"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="animate-steam-1"
              />
              <path
                d="M9 -3 C7 -7, 11 -9, 9 -13"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="animate-steam-2"
              />
            </>
          )}
          <rect x="1" y="2" width="12" height="12" rx="2.5" fill="#F8FAFC" />
          <rect x="2" y="2" width="10" height="3" rx="1" fill="#78350F" />
          <path
            d="M13 5 C17 5, 17 11, 13 11"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="2"
          />
        </g>

        {/* Right Desk Accessory: Desk Lamp / Role Prop */}
        <g transform="translate(148, 76)">
          <rect x="3" y="18" width="12" height="4" rx="1.5" fill="#475569" />
          <path
            d="M9 18 L9 6 L16 3"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polygon points="13,0 22,5 15,9" fill="#64748B" />
          {isWorking && (
            <polygon
              points="15,8 22,5 25,22 6,22"
              fill={avatarColor}
              fillOpacity="0.22"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
