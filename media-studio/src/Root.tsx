import React from "react";
import { Composition } from "remotion";
import {
  ComparisonCard,
  type ComparisonCardProps,
} from "./compositions/ComparisonCard";
import { PromoSquare, type PromoSquareProps } from "./compositions/PromoSquare";
import {
  PromoVertical,
  type PromoVerticalProps,
} from "./compositions/PromoVertical";

const defaultSquareProps: PromoSquareProps = {
  eyebrow: "UNTUK SELLER UMKM INDONESIA",
  title: "Jualan Tanpa Boncos, Admin Cuma Flat 4%",
  subtitle:
    "Setiap produk berkesempatan tampil di etalase paling pertama secara bergiliran lewat sistem Fair Rank.",
  badgeText: "FLAT 4% • FAIR RANK",
  ctaText: "Buka Toko di kawanbelanja.com",
  uspPills: [
    "Potongan Admin Flat 4%",
    "Sistem Fair Rank Bergiliran",
    "COD & Voucher Gratis Ongkir",
  ],
  imageFile: "",
  theme: "warm-terracotta",
};

const defaultVerticalProps: PromoVerticalProps = {
  hook: "Belanja Hemat & Aman Setiap Hari",
  title: "Saatnya Belanja di Kawan Belanja",
  subtitle:
    "Bisa bayar COD, dapat Voucher Gratis Ongkir & Potongan Harga, dan dukung seller UMKM dengan admin flat 4%.",
  badgeText: "BELANJA CERDAS",
  ctaText: "Belanja & Buka Toko di kawanbelanja.com",
  productName: "Produk UMKM Pilihan Terkurasi",
  productPrice: "Bisa COD",
  promoVoucher: "Gratis Ongkir + Voucher Potongan Harga",
  imageFile: "",
  uspBadges: [
    "Admin Flat 4%",
    "Fair Rank Bergiliran",
    "Bayar di Tempat (COD)",
    "Voucher Potongan Harga",
  ],
  theme: "warm-light",
};

const defaultComparisonProps: ComparisonCardProps = {
  badgeText: "PERBANDINGAN ADIL UMKM",
  title: "Kenapa Banyak Seller Melirik Kawan Belanja?",
  subtitle: "Transparan untuk penjual, hemat & aman untuk pembeli.",
  leftTitle: "Marketplace Biasa",
  rightTitle: "Kawan Belanja",
  rows: [
    {
      feature: "Potongan Admin",
      otherMarketplace: "Berlapis & tinggi",
      kawanBelanja: "Flat 4% saja",
    },
    {
      feature: "Tampil di Etalase #1",
      otherMarketplace: "Harus bakar uang iklan",
      kawanBelanja: "Fair Rank bergiliran",
    },
    {
      feature: "Metode Pembayaran",
      otherMarketplace: "Syarat berbelit",
      kawanBelanja: "Mendukung COD",
    },
    {
      feature: "Promo Belanja",
      otherMarketplace: "Klaim terbatas",
      kawanBelanja: "Voucher Ongkir & Diskon",
    },
  ],
  footerCta: "Coba Jualan & Belanja Adil di kawanbelanja.com →",
  theme: "warm-light",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoSquare"
        component={PromoSquare as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultSquareProps as unknown as Record<string, unknown>}
      />
      <Composition
        id="PromoVertical"
        component={PromoVertical as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultVerticalProps as unknown as Record<string, unknown>}
      />
      <Composition
        id="ComparisonCard"
        component={ComparisonCard as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={defaultComparisonProps as unknown as Record<string, unknown>}
      />
    </>
  );
};
