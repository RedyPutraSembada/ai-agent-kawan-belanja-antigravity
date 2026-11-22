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

  const ctaScale = interpolate(
    Math.sin(frame / 10),
    [-1, 1],
    [0.98, 1.03]
  );

  const hasImage = Boolean(imageFile && imageFile.trim().length > 0);
  const resolvedSrc = hasImage
    ? imageFile.startsWith("http")
      ? imageFile
      : staticFile(`assets/${imageFile.replace(/^assets\//, "")}`)
    : "";

  return (
    <AbsoluteFill className="bg-slate-950 text-white font-sans overflow-hidden">
      {/* Dynamic Gradients */}
      <div
        className="absolute -top-24 left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.25)" }}
      />
      <div
        className="absolute bottom-24 right-0 h-[550px] w-[550px] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(16, 185, 129, 0.24)" }}
      />

      {/* Safe zone padding for TikTok / IG Reels UI (top 140px, bottom 220px) */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-12 pt-32 pb-48">
        {/* Top Brand + Hook */}
        <div
          style={{
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 text-xl font-black text-white">
                KB
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                kawanbelanja.com
              </span>
            </div>
            <span className="rounded-full bg-amber-400 px-5 py-2 text-lg font-black text-slate-950">
              {badgeText}
            </span>
          </div>

          <div className="mb-4 inline-block rounded-xl border border-rose-400/40 bg-rose-500/20 px-5 py-2 text-2xl font-extrabold text-rose-200">
            {hook}
          </div>

          <h1 className="text-[64px] font-black leading-[1.06] tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-4 text-[28px] font-medium leading-snug text-slate-300">
            {subtitle}
          </p>
        </div>

        {/* Simulated Fair Rank Product Card */}
        <div
          className="my-auto rounded-[36px] border-2 border-slate-700/90 bg-slate-900/95 p-7 shadow-2xl"
          style={{
            opacity: cardSpring,
            transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-xl bg-emerald-500/20 px-4 py-1.5 text-lg font-extrabold text-emerald-300">
              ★ GILIRAN ETALASE PERTAMA (FAIR RANK)
            </span>
            <span className="rounded-xl bg-blue-500/20 px-4 py-1.5 text-lg font-bold text-blue-200">
              Bisa COD
            </span>
          </div>

          {hasImage ? (
            <div className="h-[430px] w-full overflow-hidden rounded-2xl bg-slate-800">
              <Img src={resolvedSrc} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-[380px] flex-col items-center justify-center rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-8 text-center">
              <div className="mb-4 rounded-2xl bg-emerald-500/20 px-6 py-3 text-3xl font-black text-emerald-300">
                POTONGAN ADMIN FLAT 4%
              </div>
              <div className="text-4xl font-black text-white">
                {productName}
              </div>
              <div className="mt-3 text-2xl font-bold text-amber-300">
                {promoVoucher}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold text-white">
                {productName}
              </div>
              <div className="mt-1 text-xl font-bold text-amber-300">
                {promoVoucher}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-800 px-5 py-3 text-3xl font-black text-emerald-400">
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
                className="rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-3 text-2xl font-extrabold text-emerald-200"
              >
                ✓ {badge}
              </span>
            ))}
          </div>

          <div
            className="rounded-3xl bg-gradient-to-r from-emerald-400 to-teal-300 px-8 py-6 text-center text-3xl font-black text-slate-950 shadow-2xl"
            style={{ transform: `scale(${ctaScale})` }}
          >
            {ctaText} →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
