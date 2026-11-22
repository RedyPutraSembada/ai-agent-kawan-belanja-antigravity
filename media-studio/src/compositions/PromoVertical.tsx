import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandHeader, KWBJ, type BrandTheme } from "../theme";

export interface PromoVerticalProps {
  hook: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  productName: string;
  productPrice: string;
  promoVoucher: string;
  imageFile: string;
  uspBadges: string[];
  theme?: BrandTheme;
}

export const PromoVertical: React.FC<PromoVerticalProps> = ({
  hook,
  title,
  subtitle,
  badgeText,
  ctaText,
  productName,
  productPrice,
  promoVoucher,
  imageFile,
  uspBadges,
  theme = "warm-light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const cardSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const badgesSpring = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const ctaScale = interpolate(Math.sin(frame / 10), [-1, 1], [0.98, 1.03]);

  const isDark = theme === "warm-terracotta";
  const hasImage = Boolean(imageFile && imageFile.trim().length > 0);
  const resolvedSrc = hasImage
    ? imageFile.startsWith("http")
      ? imageFile
      : staticFile(`assets/${imageFile.replace(/^assets\//, "")}`)
    : "";

  return (
    <AbsoluteFill
      className="font-sans overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(160deg, ${KWBJ.deepTerracotta} 0%, ${KWBJ.terracottaMid} 52%, ${KWBJ.terracotta} 100%)`
          : `linear-gradient(160deg, ${KWBJ.ivory} 0%, ${KWBJ.warmCream} 55%, ${KWBJ.peach} 100%)`,
        color: isDark ? KWBJ.ivory : KWBJ.charcoal,
      }}
    >
      <div
        className="absolute -top-24 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(247, 185, 85, 0.2)"
            : "rgba(192, 80, 8, 0.14)",
        }}
      />
      <div
        className="absolute bottom-24 right-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(58, 38, 24, 0.5)"
            : "rgba(232, 208, 184, 0.65)",
        }}
      />

      {/* Safe zone padding for TikTok / IG Reels UI (top 140px, bottom 200px) */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-12 pt-32 pb-48">
        <div
          style={{
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [28, 0])}px)`,
          }}
        >
          <BrandHeader theme={theme} badgeText={badgeText} />

          <div
            className="mt-7 mb-4 inline-block rounded-2xl px-5 py-2.5 text-2xl font-extrabold"
            style={{
              backgroundColor: isDark ? "rgba(255, 240, 208, 0.16)" : KWBJ.peach,
              border: `1.5px solid ${
                isDark ? "rgba(255, 240, 208, 0.35)" : KWBJ.peachBorder
              }`,
              color: isDark ? KWBJ.amber : KWBJ.burntOrange,
            }}
          >
            {hook}
          </div>

          <h1
            className="text-[62px] font-black leading-[1.06] tracking-tight"
            style={{ color: isDark ? "#FFFFFF" : KWBJ.charcoal }}
          >
            {title}
          </h1>
          <p
            className="mt-4 text-[27px] font-medium leading-snug"
            style={{ color: isDark ? KWBJ.champagne : KWBJ.cocoa }}
          >
            {subtitle}
          </p>
        </div>

        {/* Simulated Fair Rank Product / App Showcase Card */}
        <div
          className="my-auto rounded-[36px] p-7 shadow-2xl"
          style={{
            backgroundColor: "#FFFFFF",
            border: `2.5px solid ${KWBJ.peachBorder}`,
            opacity: cardSpring,
            transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="rounded-xl px-4 py-1.5 text-lg font-extrabold text-white"
              style={{ backgroundColor: KWBJ.terracotta }}
            >
              ★ GILIRAN ETALASE #1 (FAIR RANK)
            </span>
            <span
              className="rounded-xl px-4 py-1.5 text-lg font-extrabold"
              style={{
                backgroundColor: "rgba(22, 163, 74, 0.14)",
                color: KWBJ.leafGreen,
              }}
            >
              ✓ Bisa COD
            </span>
          </div>

          {hasImage ? (
            <div className="h-[430px] w-full overflow-hidden rounded-2xl">
              <Img src={resolvedSrc} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className="flex h-[370px] flex-col items-center justify-center rounded-2xl p-8 text-center"
              style={{
                background: `linear-gradient(150deg, ${KWBJ.warmCream} 0%, ${KWBJ.peach} 100%)`,
                border: `1.5px solid ${KWBJ.peachBorder}`,
              }}
            >
              <div
                className="mb-4 rounded-2xl px-6 py-3 text-3xl font-black text-white shadow-md"
                style={{ backgroundColor: KWBJ.burntOrange }}
              >
                POTONGAN ADMIN FLAT 4%
              </div>
              <div
                className="text-4xl font-black"
                style={{ color: KWBJ.charcoal }}
              >
                {productName}
              </div>
              <div
                className="mt-3 text-2xl font-extrabold"
                style={{ color: KWBJ.leafGreen }}
              >
                {promoVoucher}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-black" style={{ color: KWBJ.charcoal }}>
                {productName}
              </div>
              <div
                className="mt-1 text-xl font-bold"
                style={{ color: KWBJ.leafGreen }}
              >
                {promoVoucher}
              </div>
            </div>
            <div
              className="rounded-2xl px-5 py-3 text-3xl font-black"
              style={{
                backgroundColor: KWBJ.peach,
                color: KWBJ.burntOrange,
              }}
            >
              {productPrice}
            </div>
          </div>
        </div>

        {/* Animated USP Badges + Bottom CTA */}
        <div
          className="space-y-6"
          style={{
            opacity: badgesSpring,
            transform: `translateY(${interpolate(badgesSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div className="flex flex-wrap gap-3">
            {uspBadges.slice(0, 4).map((badge, idx) => (
              <span
                key={idx}
                className="rounded-2xl px-5 py-3 text-2xl font-extrabold shadow-sm"
                style={{
                  backgroundColor: isDark
                    ? "rgba(36, 25, 20, 0.65)"
                    : "#FFFFFF",
                  border: `1.5px solid ${
                    isDark ? "rgba(255, 240, 208, 0.35)" : KWBJ.peachBorder
                  }`,
                  color: isDark ? KWBJ.ivory : KWBJ.charcoal,
                }}
              >
                <span style={{ color: isDark ? KWBJ.leafGreenBright : KWBJ.leafGreen }}>
                  ✓
                </span>{" "}
                {badge}
              </span>
            ))}
          </div>

          <div
            className="rounded-3xl px-8 py-6 text-center text-3xl font-black shadow-2xl"
            style={{
              backgroundColor: isDark ? KWBJ.amber : KWBJ.burntOrange,
              color: isDark ? KWBJ.charcoal : "#FFFFFF",
              transform: `scale(${ctaScale})`,
            }}
          >
            {ctaText} →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
