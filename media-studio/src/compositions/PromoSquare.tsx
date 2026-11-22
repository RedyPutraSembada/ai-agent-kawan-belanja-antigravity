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

export interface PromoSquareProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  uspPills: string[];
  imageFile: string;
  accentTheme?: "emerald" | "indigo" | "amber";
}

const THEME_STYLES: Record<
  NonNullable<PromoSquareProps["accentTheme"]>,
  { glow: string; badgeBg: string; ctaBg: string; pillBorder: string }
> = {
  emerald: {
    glow: "rgba(16, 185, 129, 0.28)",
    badgeBg: "bg-emerald-400 text-slate-950",
    ctaBg: "bg-emerald-500 text-slate-950",
    pillBorder: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  },
  indigo: {
    glow: "rgba(99, 102, 241, 0.30)",
    badgeBg: "bg-indigo-400 text-slate-950",
    ctaBg: "bg-indigo-500 text-white",
    pillBorder: "border-indigo-400/40 bg-indigo-500/15 text-indigo-200",
  },
  amber: {
    glow: "rgba(245, 158, 11, 0.28)",
    badgeBg: "bg-amber-400 text-slate-950",
    ctaBg: "bg-amber-400 text-slate-950",
    pillBorder: "border-amber-400/40 bg-amber-500/15 text-amber-200",
  },
};

export const PromoSquare: React.FC<PromoSquareProps> = ({
  eyebrow,
  title,
  subtitle,
  badgeText,
  ctaText,
  uspPills,
  imageFile,
  accentTheme = "emerald",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateY = interpolate(entrance, [0, 1], [24, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const theme = THEME_STYLES[accentTheme] ?? THEME_STYLES.emerald;
  const hasImage = Boolean(imageFile && imageFile.trim().length > 0);
  const resolvedSrc = hasImage
    ? imageFile.startsWith("http")
      ? imageFile
      : staticFile(`assets/${imageFile.replace(/^assets\//, "")}`)
    : "";

  return (
    <AbsoluteFill className="bg-slate-950 text-white font-sans overflow-hidden">
      {/* Ambient background glow & subtle grid */}
      <div
        className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ backgroundColor: theme.glow }}
      />
      <div
        className="absolute -bottom-36 -left-24 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.14) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col justify-between p-12"
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        {/* Top Bar: Brand + Promo Badge */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 text-2xl font-black text-white shadow-lg">
              KB
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-white">
                Kawan Belanja
              </div>
              <div className="text-base font-medium text-slate-400">
                kawanbelanja.com
              </div>
            </div>
          </div>

          <div
            className={`rounded-full px-5 py-2.5 text-base font-extrabold tracking-wide shadow-lg ${theme.badgeBg}`}
          >
            {badgeText}
          </div>
        </div>

        {/* Middle Hero: Copy Left + Visual Card Right */}
        <div className="my-auto grid grid-cols-12 items-center gap-8 py-4">
          <div className="col-span-7 flex flex-col gap-5">
            <span className="inline-block w-fit rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-1.5 text-sm font-bold uppercase tracking-widest text-blue-300">
              {eyebrow}
            </span>

            <h1 className="text-[54px] font-black leading-[1.08] tracking-tight text-white">
              {title}
            </h1>

            <p className="text-2xl font-medium leading-relaxed text-slate-300">
              {subtitle}
            </p>

            <div className="mt-2 flex flex-wrap gap-2.5">
              {uspPills.slice(0, 3).map((pill, idx) => (
                <span
                  key={idx}
                  className={`rounded-xl border px-4 py-2 text-base font-bold ${theme.pillBorder}`}
                >
                  ✓ {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side Visual Showcase or Fallback Store Card */}
          <div className="col-span-5">
            <div className="overflow-hidden rounded-3xl border-2 border-slate-700/80 bg-slate-900/95 p-4 shadow-2xl">
              {hasImage ? (
                <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-slate-800">
                  <Img
                    src={resolvedSrc}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/85 px-4 py-2.5 backdrop-blur">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Etalase Fair Rank Aktif
                    </div>
                    <div className="text-base font-bold text-white">
                      Admin Flat 4% • Bisa COD
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[420px] flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950 p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-bold text-emerald-300">
                      FAIR RANK #1
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      Tanpa Bakar Iklan
                    </span>
                  </div>

                  <div className="my-auto space-y-4">
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5">
                      <div className="text-sm font-semibold text-slate-400">
                        Biaya Admin Seller
                      </div>
                      <div className="mt-1 text-5xl font-black text-emerald-400">
                        FLAT 4%
                      </div>
                      <div className="mt-1 text-sm text-slate-300">
                        Margin UMKM lebih terjaga
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3.5">
                        <div className="text-xs text-slate-400">Pembayaran</div>
                        <div className="mt-1 text-lg font-extrabold text-white">
                          Bayar COD
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3.5">
                        <div className="text-xs text-slate-400">Promo Pembeli</div>
                        <div className="mt-1 text-lg font-extrabold text-amber-300">
                          Gratis Ongkir
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-800/80 px-4 py-2.5 text-center text-sm font-bold text-slate-200">
                    Voucher Potongan Harga Barang Tersedia
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 px-7 py-5">
          <div className="text-xl font-bold text-slate-200">
            Gabung &amp; belanja hemat sekarang
          </div>
          <div
            className={`rounded-xl px-6 py-3 text-xl font-black shadow-lg ${theme.ctaBg}`}
          >
            {ctaText} →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
