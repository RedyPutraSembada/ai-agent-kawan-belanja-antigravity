import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ComparisonRow {
  feature: string;
  otherMarketplace: string;
  kawanBelanja: string;
}

export interface ComparisonCardProps {
  badgeText: string;
  title: string;
  subtitle: string;
  leftTitle: string;
  rightTitle: string;
  rows: ComparisonRow[];
  footerCta: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  badgeText,
  title,
  subtitle,
  leftTitle,
  rightTitle,
  rows,
  footerCta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <AbsoluteFill className="bg-slate-950 text-white font-sans overflow-hidden">
      <div
        className="absolute -top-24 left-1/3 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(99, 102, 241, 0.25)" }}
      />
      <div
        className="absolute -bottom-24 right-0 h-[450px] w-[450px] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(16, 185, 129, 0.22)" }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col justify-between p-12"
        style={{
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [20, 0])}px)`,
        }}
      >
        {/* Header */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 text-xl font-black text-white">
                KB
              </div>
              <span className="text-2xl font-extrabold">kawanbelanja.com</span>
            </div>
            <span className="rounded-full bg-indigo-500 px-5 py-2 text-base font-extrabold text-white">
              {badgeText}
            </span>
          </div>

          <h1 className="text-[52px] font-black leading-[1.1] tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-3 text-2xl font-medium text-slate-300">{subtitle}</p>
        </div>

        {/* Comparison Table */}
        <div className="my-auto overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-900/95 shadow-2xl">
          <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-950/90 px-6 py-5 text-xl font-black">
            <div className="col-span-4 text-slate-400">Aspek</div>
            <div className="col-span-4 text-center text-rose-300">{leftTitle}</div>
            <div className="col-span-4 text-center text-emerald-300">
              {rightTitle}
            </div>
          </div>

          <div className="divide-y divide-slate-800/90">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center gap-3 px-6 py-5"
              >
                <div className="col-span-4 text-xl font-bold text-slate-100">
                  {row.feature}
                </div>
                <div className="col-span-4 rounded-xl bg-rose-500/10 px-3 py-3 text-center text-lg font-semibold text-rose-200">
                  ✕ {row.otherMarketplace}
                </div>
                <div className="col-span-4 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-3 text-center text-lg font-extrabold text-emerald-200">
                  ✓ {row.kawanBelanja}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 px-8 py-5 text-center text-2xl font-black text-slate-950 shadow-xl">
          {footerCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
