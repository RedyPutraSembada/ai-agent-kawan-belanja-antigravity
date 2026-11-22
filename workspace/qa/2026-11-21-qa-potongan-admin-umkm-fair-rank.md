# Laporan Audit Kualitas (QA) — Kawan Belanja (`kawanbelanja.com`)

- **Tanggal Audit:** 21 November 2026
- **Auditor:** Bima (`Brand & QA Checker` — Meja QA Checker Kawan Belanja)
- **Topik Estafet:** Keluhan seller UMKM soal potongan admin marketplace makin mahal & iklan boncos, memperkenalkan **Kawan Belanja (`kawanbelanja.com`)** dengan **potongan admin flat 4%** dan **sistem Fair Rank**

---

## 1. Daftar File yang Diaudit

1. **Divisi Riset (Raka):** `workspace/trends/2026-11-21-potongan-admin-umkm-fair-rank.md` (121 baris)
2. **Divisi Konten (Dina):** `workspace/content/2026-11-21-potongan-admin-umkm-fair-rank-7hari.md` (586 baris)
3. **Divisi Meta Ads (Sari):** `workspace/ads/2026-11-21-potongan-admin-umkm-fair-rank-meta-ads.md` (248 baris)

---

## 2. Keputusan Akhir

> ## **KEPUTUSAN QA: `APPROVED` (SIAP DISERAHKAN KE TIM MANUSIA)**

Seluruh materi lintas divisi dinyatakan **lolos 100% pada semua kriteria wajib** (Akurasi USP, Kualitas Bahasa & Tone of Voice, Kepatuhan Kebijakan Platform & Etika Kompetitor, serta Aturan Keamanan Operasional Draf/`PAUSED`). Terdapat **1 catatan optimasi opsional (*non-blocking*)** terkait batas 280 karakter untuk akun X standar (non-Premium) pada 4 cuitan tunggal di file Dina yang sudah disertakan versi ringkas siap pakai pada Bagian 4 di bawah.

---

## 3. Skor / Status per Kriteria Checklist

| Aspek Audit | Status | Skor | Ringkasan Verifikasi Nyata |
| :--- | :---: | :---: | :--- |
| **A. Akurasi Fakta & USP Kawan Belanja** | **LULUS** | **10/10** | Brand **Kawan Belanja** & domain **`kawanbelanja.com`** konsisten di seluruh 3 file. Biaya admin akurat disebut **flat 4% saja** (ilustrasi Rp100.000 → Rp4.000 di file Raka, Dina, dan Sari). Sistem **Fair Rank** dijelaskan tepat sebagai kesempatan tampil bergiliran di etalase paling pertama tanpa bakar uang iklan, bukan janji instan. Fitur pembeli **COD**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang** hadir lengkap di seluruh materi. |
| **B. Kualitas Bahasa & Tone of Voice** | **LULUS** | **9.5/10** | Bahasa Indonesia mengalir natural, hangat, ramah UMKM, dan bebas klise terjemahan kaku. Struktur 7 hari × 6 kanal milik Dina lengkap tanpa placeholder (7 header Hari 1–7, 7 IG, 7 TikTok, 7 FB, 7 Threads, 7 X, 7 Broadcast WA segmen Calon Seller UMKM + 7 segmen Pembeli). Seluruh 6 Headline Meta Ads Sari berada di rentang **35–37 karakter** (di bawah batas 40 karakter). |
| **C. Kepatuhan Kebijakan Platform & Hukum** | **LULUS** | **10/10** | **0 pelanggaran penyebutan merek kompetitor** (hasil pemindaian regex terhadap nama marketplace kompetitor = `NONE` di seluruh 3 file; hanya memakai istilah netral *"marketplace besar"* / *"platform sebelah"*). **0 serangan atribut personal Meta Ads** dan **0 klaim berlebihan** (*pasti kaya*, *dijamin untung 100%*, *auto viral*). |
| **D. Kepatuhan Aturan Keamanan Sistem** | **LULUS** | **10/10** | File Dina mencantumkan penanda eksplisit **`STATUS: DRAF SIAP PAKAI (DILARANG AUTO-POST VIA BOT)`**. File Sari mencantumkan **`STATUS: PAUSED (TIDAK AUTO-PUBLISH)`** di header dokumen, seluruh struktur Campaign (`KB_ID_SELLER_ACQ_FLAT4_FAIRRANK_202611` dan `KB_ID_BUYER_ACQ_COD_VOUCHER_202611`), seluruh Ad Set, dan seluruh 6 Ad (18 kemunculan label `PAUSED`). Tidak ada eksekusi auto-post atau auto-publish. |

### Bukti Verifikasi Panjang Karakter Headline Meta Ads (`workspace/ads/2026-11-21-potongan-admin-umkm-fair-rank-meta-ads.md`)

| Funnel & Variasi | Teks Headline | Jumlah Karakter | Batas Maks. | Status |
| :--- | :--- | :---: | :---: | :---: |
| Funnel 1 — Variasi A | `Admin Flat 4% Saja di Kawan Belanja` | 35 | ≤ 40 | **LULUS** |
| Funnel 1 — Variasi B | `Fair Rank: Tampil Bergiliran di Depan` | 37 | ≤ 40 | **LULUS** |
| Funnel 1 — Variasi C | `Jaga Margin UMKM dengan Admin Flat 4%` | 37 | ≤ 40 | **LULUS** |
| Funnel 2 — Variasi A | `Belanja UMKM Bisa COD & Gratis Ongkir` | 37 | ≤ 40 | **LULUS** |
| Funnel 2 — Variasi B | `Klaim Voucher Diskon & Gratis Ongkir` | 36 | ≤ 40 | **LULUS** |
| Funnel 2 — Variasi C | `Produk Lokal Pilihan, Bayar di Tempat` | 37 | ≤ 40 | **LULUS** |

---

## 4. Daftar Temuan & Perbaikan Spesifik

### A. Verifikasi Kata Sensitif yang Lolos Konteks (Tidak Bermasalah)
Dalam pemindaian kata kunci sensitif (`0%`, `pasti laku`, `bangkrut`, `rugi terus`), ditemukan kemunculan yang **aman secara semantik** karena digunakan dalam konteks edukasi/klarifikasi/larangan:
1. **Penyebutan `0%` di Raka (baris 48, 113), Dina (baris 170, 433, 442, 443, 456, 459, 466, 481, 489, 498), dan Sari (baris 247):** Seluruhnya menegaskan bahwa admin Kawan Belanja **bukan 0%**, melainkan **flat 4% saja**, sebagai klarifikasi jujur terhadap FAQ calon seller.
2. **Penyebutan `"apakah langsung pasti laku?"` di Dina (Hari 6 TikTok, baris 456):** Diikuti langsung oleh bantahan jujur *"Bukan janji instan ya! Fair Rank memastikan produk toko baru maupun kecil punya giliran tampil di etalase paling pertama tanpa harus bakar uang iklan."*
3. **Penyebutan `"Apakah kamu bangkrut/rugi terus?"` di Raka (Catatan Handoff untuk Sari, baris 120):** Ditulis sebagai **contoh kalimat yang wajib dihindari** oleh tim ads agar tidak melanggar kebijakan Meta Ads; kalimat tersebut **tidak muncul** di naskah iklan Sari maupun konten Dina.

### B. Catatan Optimasi Opsional (*Non-Blocking*) — Batas 280 Karakter X (Twitter)
- **Lokasi:** `workspace/content/2026-11-21-potongan-admin-umkm-fair-rank-7hari.md` — bagian `### 5. X (Twitter)` pada **Hari 2, Hari 4, Hari 6, dan Hari 7**.
- **Temuan:** Mini-thread pada Hari 1 (249/267/247 karakter), Hari 3 (212/217/192 karakter), dan Hari 5 (245/211/191 karakter) sudah berada di bawah 280 karakter per cuitan. Namun, 4 cuitan tunggal berikut melampaui 280 karakter jika diposting melalui akun X non-Premium:
  - **Hari 2 (287 karakter teks polos):** *"Aturan sederhana di kawanbelanja.com buat seller UMKM: Jual barang Rp100.000 → potongan admin flat 4% (Rp4.000)..."*
  - **Hari 4 (326 karakter teks polos):** *"Belanja di kawanbelanja.com enaknya dua arah: Buat pembeli: ada COD..."*
  - **Hari 6 (336 karakter teks polos):** *"Biar jelas tanpa gimmick: - Admin seller di kawanbelanja.com bukan 0%..."*
  - **Hari 7 (323 karakter teks polos):** *"Buat teman-teman UMKM yang akhir pekan ini lagi beres-beres stok & hitung margin..."*
- **Saran Perbaikan Opsional Siap Pakai (≤ 280 Karakter per Cuitan untuk Akun X Standar):**
  - **Hari 2 (240 karakter):**
    > Aturan sederhana di `kawanbelanja.com` buat seller UMKM:
    > Jual Rp100.000 → admin flat 4% (Rp4.000).
    > Jual Rp250.000 → admin flat 4% (Rp10.000).
    >
    > Bukan "0%" yang bikin curiga di belakang, cukup flat 4% saja yang jujur & jelas sejak hari pertama.
  - **Hari 4 (245 karakter):**
    > Belanja di `kawanbelanja.com` enaknya dua arah:
    > Pembeli: ada COD (Bayar di Tempat), Voucher Gratis Ongkir, & Voucher Potongan Harga Barang.
    > Seller UMKM: admin cuma flat 4% saja + Fair Rank tampil bergiliran di etalase pertama.
    > Sama-sama nyaman! 🛒
  - **Hari 6 (242 karakter):**
    > Fakta singkat `kawanbelanja.com` tanpa gimmick:
    > - Admin seller bukan 0%, tapi flat 4% saja.
    > - Fair Rank: giliran tampil di etalase pertama tanpa wajib perang bidding iklan.
    > - Pembeli: COD, Voucher Gratis Ongkir, & Voucher Potongan Harga Barang.
  - **Hari 7 (247 karakter):**
    > Buat UMKM yang akhir pekan ini lagi hitung ulang margin:
    > Coba buka etalase di `kawanbelanja.com` — admin flat 4% saja, ada Fair Rank (giliran etalase pertama tanpa wajib perang iklan), plus COD & Voucher buat pembeli. Cek juga produk lokalnya ya! 🤝

---

## 5. Ringkasan Penutup

Audit QA lengkap terhadap riset Raka, paket konten 7 hari Dina, dan draf Meta Ads Sari dinyatakan **`APPROVED`**. Seluruh USP Kawan Belanja (`kawanbelanja.com`, **potongan admin flat 4%**, **sistem Fair Rank** bergiliran di etalase paling pertama tanpa bakar uang iklan, **COD**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang**) terjamin akurat, bebas penyebutan merek kompetitor, bebas overclaim, seluruh 6 Headline Meta Ads ≤ 40 karakter (35–37 karakter), dan aman dalam status **draf siap pakai / `PAUSED`**. Tim manusia dapat langsung meninjau dan memakai materi ini (dengan opsi menggunakan versi ringkas ≤ 280 karakter untuk cuitan tunggal X Hari 2, 4, 6, 7 bila memakai akun X non-Premium).
