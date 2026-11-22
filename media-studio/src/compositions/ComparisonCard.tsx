import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandHeader, KWBJ, type BrandTheme } from "../theme";

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
  theme?: BrandTheme;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  badgeText,
  title,
  subtitle,
  leftTitle,
  rightTitle,
  rows,
  footerCta,
  theme = "warm-light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  const isDark = theme === "warm-terracotta";

  return (
    <AbsoluteFill
      className="font-sans overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(155deg, ${KWBJ.deepTerracotta} 0%, ${KWBJ.terracottaMid} 50%, ${KWBJ.terracotta} 100%)`
          : `linear-gradient(155deg, ${KWBJ.ivory} 0%, ${KWBJ.warmCream} 55%, ${KWBJ.peach} 100%)`,
        color: isDark ? KWBJ.ivory : KWBJ.charcoal,
      }}
    >
      <div
        className="absolute -top-24 left-1/3 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(247, 185, 85, 0.2)"
            : "rgba(192, 80, 8, 0.14)",
        }}
      />
      <div
        className="absolute -bottom-24 right-0 h-[440px] w-[440px] rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(58, 38, 24, 0.55)"
            : "rgba(232, 208, 184, 0.55)",
        }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col justify-between p-12"
        style={{
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [18, 0])}px)`,
        }}
      >
        <div>
          <BrandHeader theme={theme} badgeText={badgeText} />

          <h1
            className="mt-8 text-[50px] font-black leading-[1.1] tracking-tight"
            style={{ color: isDark ? "#FFFFFF" : KWBJ.charcoal }}
          >
            {title}
          </h1>
          <p
            className="mt-3 text-2xl font-medium"
            style={{ color: isDark ? KWBJ.champagne : KWBJ.cocoa }}
          >
            {subtitle}
          </p>
        </div>

        {/* Comparison Table Card */}
        <div
          className="my-auto overflow-hidden rounded-3xl shadow-2xl"
          style={{
            backgroundColor: "#FFFFFF",
            border: `2px solid ${KWBJ.peachBorder}`,
          }}
        >
          <div
            className="grid grid-cols-12 px-6 py-5 text-xl font-black"
            style={{
              backgroundColor: KWBJ.peach,
              borderBottom: `2px solid ${KWBJ.peachBorder}`,
            }}
          >
            <div className="col-span-4" style={{ color: KWBJ.cocoa }}>
              Aspek
            </div>
            <div className="col-span-4 text-center" style={{ color: KWBJ.coral }}>
              {leftTitle}
            </div>
            <div className="col-span-4 text-center" style={{ color: KWBJ.burntOrange }}>
              {rightTitle}
            </div>
          </div>

          <div>
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center gap-3 px-6 py-5"
                style={{
                  backgroundColor: idx % 2 === 1 ? KWBJ.ivory : "#FFFFFF",
                  borderBottom:
                    idx < rows.length - 1 ? `1px solid ${KWBJ.peachBorder}` : "none",
                }}
              >
                <div
                  className="col-span-4 text-xl font-extrabold"
                  style={{ color: KWBJ.charcoal }}
                >
                  {row.feature}
                </div>
                <div
                  className="col-span-4 rounded-xl px-3 py-3 text-center text-lg font-bold"
                  style={{
                    backgroundColor: "rgba(229, 72, 77, 0.1)",
                    color: "#B91C1C",
                  }}
                >
                  ✕ {row.otherMarketplace}
                </div>
                <div
                  className="col-span-4 rounded-xl px-3 py-3 text-center text-lg font-black"
                  style={{
                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                    border: "1.5px solid rgba(22, 163, 74, 0.35)",
                    color: "#15803D",
                  }}
                >
                  ✓ {row.kawanBelanja}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="rounded-2xl px-8 py-5 text-center text-2xl font-black shadow-xl"
          style={{
            backgroundColor: isDark ? KWBJ.amber : KWBJ.burntOrange,
            color: isDark ? KWBJ.charcoal : "#FFFFFF",
          }}
        >
          {footerCta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
