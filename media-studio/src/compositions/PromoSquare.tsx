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

export interface PromoSquareProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  uspPills: string[];
  imageFile: string;
  theme?: BrandTheme;
}

export const PromoSquare: React.FC<PromoSquareProps> = ({
  eyebrow,
  title,
  subtitle,
  badgeText,
  ctaText,
  uspPills,
  imageFile,
  theme = "warm-terracotta",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateY = interpolate(entrance, [0, 1], [20, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

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
          ? `linear-gradient(145deg, ${KWBJ.deepTerracotta} 0%, ${KWBJ.terracottaMid} 48%, ${KWBJ.terracotta} 100%)`
          : `linear-gradient(145deg, ${KWBJ.ivory} 0%, ${KWBJ.warmCream} 55%, ${KWBJ.peach} 100%)`,
        color: isDark ? KWBJ.ivory : KWBJ.charcoal,
      }}
    >
      {/* Warm sunlight ambient blobs */}
      <div
        className="absolute -top-28 -right-20 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(247, 185, 85, 0.22)"
            : "rgba(192, 80, 8, 0.16)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-24 h-[440px] w-[440px] rounded-full blur-3xl"
        style={{
          backgroundColor: isDark
            ? "rgba(58, 38, 24, 0.55)"
            : "rgba(232, 208, 184, 0.55)",
        }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col justify-between p-12"
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        <BrandHeader theme={theme} badgeText={badgeText} />

        {/* Middle Hero: Copy Left + On-Brand Showcase Right */}
        <div className="my-auto grid grid-cols-12 items-center gap-8 py-4">
          <div className="col-span-7 flex flex-col gap-5">
            <span
              className="inline-block w-fit rounded-xl px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider"
              style={{
                backgroundColor: isDark ? "rgba(255, 240, 208, 0.16)" : KWBJ.peach,
                border: `1.5px solid ${
                  isDark ? "rgba(255, 240, 208, 0.35)" : KWBJ.peachBorder
                }`,
                color: isDark ? KWBJ.champagne : KWBJ.burntOrange,
              }}
            >
              {eyebrow}
            </span>

            <h1
              className="text-[52px] font-black leading-[1.08] tracking-tight"
              style={{ color: isDark ? "#FFFFFF" : KWBJ.charcoal }}
            >
              {title}
            </h1>

            <p
              className="text-[23px] font-medium leading-relaxed"
              style={{ color: isDark ? KWBJ.champagne : KWBJ.cocoa }}
            >
              {subtitle}
            </p>

            <div className="mt-1 flex flex-wrap gap-2.5">
              {uspPills.slice(0, 3).map((pill, idx) => (
                <span
                  key={idx}
                  className="rounded-xl px-4 py-2 text-base font-bold shadow-sm"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(36, 25, 20, 0.55)"
                      : "#FFFFFF",
                    border: `1.5px solid ${
                      isDark ? "rgba(255, 240, 208, 0.28)" : KWBJ.peachBorder
                    }`,
                    color: isDark ? KWBJ.ivory : KWBJ.charcoal,
                  }}
                >
                  <span style={{ color: isDark ? KWBJ.leafGreenBright : KWBJ.leafGreen }}>
                    ✓
                  </span>{" "}
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="col-span-5">
            <div
              className="overflow-hidden rounded-3xl p-4 shadow-2xl"
              style={{
                backgroundColor: isDark ? KWBJ.ivory : "#FFFFFF",
                border: `2px solid ${KWBJ.peachBorder}`,
              }}
            >
              {hasImage ? (
                <div className="relative h-[430px] w-full overflow-hidden rounded-2xl">
                  <Img src={resolvedSrc} className="h-full w-full object-cover" />
                  <div
                    className="absolute bottom-3 left-3 right-3 rounded-xl px-4 py-2.5 shadow-md"
                    style={{
                      backgroundColor: "rgba(36, 25, 20, 0.88)",
                    }}
                  >
                    <div
                      className="text-xs font-extrabold uppercase tracking-wider"
                      style={{ color: KWBJ.amber }}
                    >
                      Etalase Fair Rank Aktif
                    </div>
                    <div className="text-base font-bold text-white">
                      Admin Flat 4% • Bisa COD
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-[430px] flex-col justify-between rounded-2xl p-5"
                  style={{
                    background: `linear-gradient(180deg, ${KWBJ.warmCream} 0%, ${KWBJ.peach} 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-lg px-3 py-1 text-xs font-extrabold tracking-wide text-white"
                      style={{ backgroundColor: KWBJ.terracotta }}
                    >
                      FAIR RANK #1
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: KWBJ.cocoa }}
                    >
                      Tanpa Bakar Iklan
                    </span>
                  </div>

                  <div className="my-auto space-y-3.5">
                    <div
                      className="rounded-2xl p-5 shadow-sm"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: `1.5px solid ${KWBJ.peachBorder}`,
                      }}
                    >
                      <div
                        className="text-xs font-bold uppercase tracking-wide"
                        style={{ color: KWBJ.cocoa }}
                      >
                        Potongan Biaya Admin
                      </div>
                      <div
                        className="mt-1 text-5xl font-black"
                        style={{ color: KWBJ.burntOrange }}
                      >
                        FLAT 4%
                      </div>
                      <div
                        className="mt-1 text-sm font-semibold"
                        style={{ color: KWBJ.leafGreen }}
                      >
                        ✓ Margin seller UMKM lebih utuh
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1.5px solid ${KWBJ.peachBorder}`,
                        }}
                      >
                        <div className="text-xs font-semibold" style={{ color: KWBJ.cocoa }}>
                          Pembayaran
                        </div>
                        <div
                          className="mt-1 text-lg font-black"
                          style={{ color: KWBJ.charcoal }}
                        >
                          Bayar COD
                        </div>
                      </div>
                      <div
                        className="rounded-xl p-3.5"
                        style={{
                          backgroundColor: "#FFFFFF",
                          border: `1.5px solid ${KWBJ.peachBorder}`,
                        }}
                      >
                        <div className="text-xs font-semibold" style={{ color: KWBJ.cocoa }}>
                          Promo Pembeli
                        </div>
                        <div
                          className="mt-1 text-lg font-black"
                          style={{ color: KWBJ.leafGreen }}
                        >
                          Gratis Ongkir
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl px-4 py-2.5 text-center text-sm font-extrabold"
                    style={{
                      backgroundColor: KWBJ.peachMid,
                      color: KWBJ.charcoal,
                    }}
                  >
                    + Voucher Potongan Harga Barang
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div
          className="flex items-center justify-between rounded-2xl px-7 py-5 shadow-lg"
          style={{
            backgroundColor: isDark ? "rgba(36, 25, 20, 0.72)" : "#FFFFFF",
            border: `2px solid ${
              isDark ? "rgba(255, 240, 208, 0.25)" : KWBJ.peachBorder
            }`,
          }}
        >
          <div
            className="text-xl font-bold"
            style={{ color: isDark ? KWBJ.champagne : KWBJ.charcoal }}
          >
            Jualan adil, belanja lebih hemat
          </div>
          <div
            className="rounded-xl px-6 py-3 text-xl font-black shadow-md"
            style={{
              backgroundColor: isDark ? KWBJ.amber : KWBJ.burntOrange,
              color: isDark ? KWBJ.charcoal : "#FFFFFF",
            }}
          >
            {ctaText} →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
