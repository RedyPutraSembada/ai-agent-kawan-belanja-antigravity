import React from "react";
import { Img, staticFile } from "remotion";

export type BrandTheme = "warm-light" | "warm-terracotta";

export const KWBJ = {
  terracotta: "#B04828",
  burntOrange: "#C05008",
  burntOrangeLight: "#D45D18",
  deepTerracotta: "#782808",
  terracottaMid: "#883010",
  espressoDark: "#3A2618",
  ivory: "#FFF8F0",
  warmCream: "#FFF0E0",
  peach: "#FFE8D8",
  peachMid: "#F8E0D0",
  peachBorder: "#E8D0B8",
  charcoal: "#241914",
  cocoa: "#6B4E3D",
  leafGreen: "#16A34A",
  leafGreenBright: "#22C55E",
  amber: "#F7B955",
  coral: "#E5484D",
  champagne: "#FFF0D0",
} as const;

interface BrandHeaderProps {
  theme: BrandTheme;
  badgeText: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ theme, badgeText }) => {
  const isDark = theme === "warm-terracotta";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <Img
          src={staticFile("assets/logo-kawanbelanja.png")}
          className="h-14 w-14 rounded-2xl shadow-lg"
          style={{
            border: isDark
              ? `2px solid ${KWBJ.champagne}`
              : `2px solid ${KWBJ.peachBorder}`,
          }}
        />
        <div>
          <div className="text-[30px] font-black leading-none tracking-tight">
            <span style={{ color: isDark ? KWBJ.amber : KWBJ.burntOrange }}>
              kawan
            </span>
            <span style={{ color: isDark ? KWBJ.ivory : KWBJ.charcoal }}>
              belanja
            </span>
          </div>
          <div
            className="mt-1 text-sm font-semibold tracking-wide"
            style={{ color: isDark ? KWBJ.champagne : KWBJ.cocoa }}
          >
            kawanbelanja.com
          </div>
        </div>
      </div>

      <div
        className="rounded-full px-5 py-2.5 text-base font-extrabold tracking-wide shadow-md"
        style={{
          backgroundColor: isDark ? KWBJ.amber : KWBJ.terracotta,
          color: isDark ? KWBJ.charcoal : "#FFFFFF",
        }}
      >
        {badgeText}
      </div>
    </div>
  );
};
