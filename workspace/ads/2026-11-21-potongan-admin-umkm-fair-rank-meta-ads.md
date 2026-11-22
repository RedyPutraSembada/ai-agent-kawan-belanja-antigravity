# Draf Strategi & Kampanye Meta Ads — Kawan Belanja (`kawanbelanja.com`)

**STATUS: PAUSED (TIDAK AUTO-PUBLISH)**
- **Disusun oleh:** Sari (`Meta Ads & Funnel Specialist` — Meja Meta Ads Kawan Belanja)
- **Tanggal Draf:** 21 November 2026
- **Rujukan Lintas Divisi:**
  - Riset Raka: `workspace/trends/2026-11-21-potongan-admin-umkm-fair-rank.md`
  - Paket Konten Dina: `workspace/content/2026-11-21-potongan-admin-umkm-fair-rank-7hari.md`
- **Aturan Keamanan & Kepatuhan:**
  - Seluruh **Campaign, Ad Set, dan Ad** pada dokumen ini WAJIB berstatus **`PAUSED (TIDAK AUTO-PUBLISH)`**. Dilarang mengaktifkan atau mem-publish kampanye otomatis tanpa review tim manusia & QA Bima.
  - Seluruh copy bebas dari *personal attributes attack* Meta Ads Policy, bebas klaim berlebihan (*overclaim*), dan tidak menyebut nama merek marketplace kompetitor secara spesifik.

---

## Ringkasan Arsitektur Kampanye (Dual-Funnel)

| Funnel | Nama Campaign (`PAUSED`) | Objective Meta Ads | USP Utama yang Diangkat | Rekomendasi Porsi Budget Uji Awal |
| :--- | :--- | :--- | :--- | :--- |
| **Funnel 1: Akuisisi Seller UMKM** | `KB_ID_SELLER_ACQ_FLAT4_FAIRRANK_202611` | **Leads / Traffic** (Landing Page Pendaftaran Seller `kawanbelanja.com`) | Potongan biaya admin **flat 4% saja** + **Sistem Fair Rank** (tampil bergiliran di etalase paling pertama tanpa bakar uang iklan) | 60% dari total anggaran uji coba |
| **Funnel 2: Akuisisi Pembeli** | `KB_ID_BUYER_ACQ_COD_VOUCHER_202611` | **Sales / Traffic** (Katalog & Promo `kawanbelanja.com`) | **COD (Bayar di Tempat)**, **Voucher Gratis Ongkir**, & **Voucher Potongan Harga Barang** | 40% dari total anggaran uji coba |

---

# FUNNEL 1 — AKUISISI SELLER UMKM

## 1. Status & Struktur Campaign (`PAUSED`)
- **Nama Campaign:** `KB_ID_SELLER_ACQ_FLAT4_FAIRRANK_202611`
- **Status Campaign:** `PAUSED (Draft Only)` — **`STATUS: PAUSED (TIDAK AUTO-PUBLISH)`**
- **Objective:** **Leads** (optimasi event pendaftaran toko di `kawanbelanja.com` atau *Conversion API* `CompleteRegistration` setelah pixel siap; opsi cadangan fase awal: **Traffic** dengan optimasi *Landing Page Views* agar data audiens cepat terkumpul).
- **Strategi Budget:**
  - **Fase Uji (Hari 1–7): ABO (Ad Set Budget Optimization)** — pisahkan anggaran di tiap ad set (TOFU / MOFU / BOFU) supaya variasi audiens dan ad copy A/B/C terbaca adil. Rekomendasi awal Rp100.000–Rp150.000/hari per ad set TOFU.
  - **Fase Optimasi (Setelah data ≥50 klik berkualitas / registrasi awal): CBO (Campaign Budget Optimization)** — fokuskan anggaran ke kombinasi Ad Set dan Ad dengan *Cost per Landing Page View* & *Cost per Seller Registration* paling efisien.
- **Struktur Ad Set (`Status: PAUSED (TIDAK AUTO-PUBLISH)`):**
  - `AS1_TOFU_Broad_UMKM_Interests` (Audiens dingin — pemilik usaha kecil & reseller)
  - `AS2_MOFU_Engagement_VideoViewers` (Retargeting penonton video 50%+ & penginteraksi IG/FB 30 hari terakhir)
  - `AS3_BOFU_LPV_NoRegister` (Retargeting pengunjung halaman daftar seller `kawanbelanja.com` 14 hari terakhir yang belum menyelesaikan registrasi)
- **Metrik Evaluasi (Tanpa Janji Hasil Pasti):** CTR (Link Click-Through Rate), CPC, *Landing Page View Rate*, dan *Cost per Registration*.

---

## 2. Saran Targeting & Funnel (TOFU / MOFU / BOFU)

### A. Demografi
- **Lokasi:** Seluruh Indonesia (prioritas awal pulau Jawa, Bali, Sumatra bagian tengah-selatan, dan kota penyangga UMKM seperti Jabodetabek, Bandung, Surabaya, Solo, Yogyakarta, Semarang, Medan, Makassar).
- **Usia:** 22–50 tahun (usia produktif pelaku UMKM, pemilik toko online, dan pengrajin lokal).
- **Jenis Kelamin:** Semua (*All*).
- **Bahasa:** Bahasa Indonesia.

### B. Detailed Targeting & Audiens per Tahap Funnel
- **TOFU (Cold Audience — Kesadaran Masalah & Solusi):**
  - **Behaviors:** *Facebook Page Admins*, *Small business owners*, *Engaged Shoppers*.
  - **Interests:** *Small and medium enterprises* (UMKM), *E-commerce*, *Online shopping*, *Entrepreneurship*, *Wholesale* / *Reseller*, *Retail*, *Crafts / Handmade* (untuk menjangkau produsen lokal).
  - **Saran Exclusion:** Kecualikan *Custom Audience* seller yang sudah terdaftar (`CompleteRegistration` 180 hari) agar budget tidak terbuang ke pengguna lama.
- **MOFU (Warm Audience — Pertimbangan & Edukasi Fitur):**
  - *Custom Audience:* Pengguna yang berinteraksi dengan akun Instagram/Facebook Kawan Belanja (30 hari), menonton video Reels/Ads minimal 50% (30 hari), atau mengirim DM/menyimpan postingan.
  - *Lookalike Audience (LAL 1%–2% Indonesia):* Dibentuk dari daftar seller aktif atau pengunjung halaman pendaftaran toko berintensitas tinggi.
- **BOFU (Hot Audience — Dorongan Daftar Toko):**
  - *Custom Audience:* Pengunjung halaman seller `kawanbelanja.com` (7–14 hari terakhir) yang belum menyelesaikan pendaftaran toko.

### C. Rekomendasi Placement
- **Advantage+ Placements** (fokus observasi pada **Instagram Feed**, **Instagram Reels**, **Instagram Stories**, **Facebook Feed**, dan **Facebook Reels**). Pastikan rasio `1:1` masuk ke Feed dan rasio `9:16` masuk ke Stories/Reels agar tidak terpotong otomatis.

---

## 3. Variasi Ad Copy — Funnel Akuisisi Seller UMKM (A / B / C Test)

### Variasi A — Angle: Pain-Point Margin & Potongan Berlapis
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Empati margin tergerus potongan berlapis → solusi **Admin Flat 4% Saja**
- **Primary Text:**
  > Ramai pesanan memang menyenangkan, tapi hitungan saldo bersih sering kali jauh berbeda kalau potongan biaya admin dan layanan terasa berlapis.
  >
  > Di **Kawan Belanja (`kawanbelanja.com`)**, aturan biaya dibuat sederhana sejak hari pertama: **potongan admin flat 4% saja**. Jual produk Rp100.000, potongannya cukup Rp4.000—tanpa biaya tambahan yang membingungkan di belakang.
  >
  > Ditambah lagi, produk tokomu punya kesempatan tampil bergiliran di etalase paling pertama lewat sistem **Fair Rank**, plus dukungan pembayaran **COD**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang** untuk pembeli.
  >
  > Yuk pelajari cara kerjanya dan mulai atur etalase UMKM-mu lebih sehat hari ini.
- **Headline (35 karakter — maks. 40):** `Admin Flat 4% Saja di Kawan Belanja`
- **Description:** `Margin UMKM terjaga, hitungan jelas sejak awal.`
- **CTA Button:** `Daftar Sekarang`

### Variasi B — Angle: Anti-Iklan Boncos & Sistem Fair Rank
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Toko baru/kecil tenggelam jika harus perang *bidding* → solusi **Fair Rank** tampil bergiliran
- **Primary Text:**
  > Produk UMKM berkualitas sering kalah terlihat hanya karena belum sanggup bersaing dalam perang *bidding* iklan berbayar setiap hari.
  >
  > Di **Kawan Belanja (`kawanbelanja.com`)**, setiap produk seller—termasuk toko baru maupun usaha rumahan—berkesempatan tampil di **etalase paling pertama secara bergiliran** melalui sistem **Fair Rank**, tanpa harus bakar uang untuk iklan.
  >
  > Bukan janji instan langsung ramai seketika, melainkan peluang eksposur yang dibagi secara adil agar usahamu lebih mudah ditemukan pembeli. Potongan adminnya juga ringan: **flat 4% saja**, lengkap dengan **COD** dan **Voucher** bagi pembeli.
- **Headline (37 karakter — maks. 40):** `Fair Rank: Tampil Bergiliran di Depan`
- **Description:** `Kesempatan etalase pertama adil untuk UMKM.`
- **CTA Button:** `Pelajari Selengkapnya`

### Variasi C — Angle: Punchy Pendek (Cocok untuk Mobile Feed & Retargeting MOFU/BOFU)
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Ringkas, fokus ke kejelasan angka **flat 4%**, **Fair Rank**, dan kemudahan pembeli
- **Primary Text:**
  > Saatnya jualan online dengan hitungan yang lebih tenang untuk UMKM:
  > ✅ Potongan admin **flat 4% saja**
  > ✅ **Sistem Fair Rank**: peluang tampil bergiliran di etalase paling pertama tanpa wajib bakar uang iklan
  > ✅ Pembeli bisa bayar **COD**, pakai **Voucher Gratis Ongkir**, & **Voucher Potongan Harga Barang**
  >
  > Buka etalase tokomu di `kawanbelanja.com` sekarang.
- **Headline (37 karakter — maks. 40):** `Jaga Margin UMKM dengan Admin Flat 4%`
- **Description:** `Tampil adil bergiliran tanpa perang iklan.`
- **CTA Button:** `Daftar Sekarang`

---

## 4. Brief Aset Visual — Funnel Akuisisi Seller UMKM

### A. Format `1:1` (1080×1080 px — Instagram Feed & Facebook Feed)
- **Konsep Visual:** Desain split-card bersih dan hangat: sisi kiri menampilkan foto autentik pelaku UMKM sedang mengemas paket rapi (pencahayaan natural, bukan foto stok yang terlalu korporat), sisi kanan menampilkan blok infografis kalkulator sederhana (*"Harga Jual Rp100.000 → Admin Flat 4% (Rp4.000) → Sisa Rp96.000"*).
- **Hierarki Text Overlay (Maksimal 20% area teks yang padat agar rapi):**
  1. *Headline besar (atas):* **`ADMIN FLAT 4% SAJA`**
  2. *Sub-headline:* **`+ Sistem Fair Rank: Etalase Depan Bergiliran`**
  3. *Micro-copy bawah:* `Tanpa harus bakar uang iklan • kawanbelanja.com`
- **Palet Warna & Mood:** Biru tepercaya (`#2563EB`) dipadukan hijau segar (`#10B981`) di atas latar putih hangat (`#F8FAFC`) dengan aksen kuning amber (`#F59E0B`) pada badge angka `4%`. Mood: jujur, optimistis, bersahabat untuk UMKM.
- **Elemen Wajib:** Logo **Kawan Belanja (`kawanbelanja.com`)** di pojok kanan atas + badge pill **`ADMIN FLAT 4%`** dan **`SISTEM FAIR RANK`**.

### B. Format `9:16` (1080×1920 px — Instagram Reels, Stories & Facebook Reels)
- **Aturan Safe Zone Teks:**
  - Kosongkan **250 px dari atas** (area nama akun & status story) dan **420 px dari bawah** (area caption, tombol CTA Meta, dan ikon like/comment di Reels), serta **120 px di sisi kanan** (deretan ikon interaksi Reels). Seluruh teks utama diletakkan di zona tengah (`Y: 320–1420 px`).
- **Storyboard 5 Scene (Durasi Total ~25–30 Detik):**
  - **Scene 1 (0–4 dtk — Hook Visual):** Video close-up tangan seller menumpuk dus paket dan mengecek buku catatan kas dengan raut mikir. *Teks layar:* `"Orderan masuk, tapi saldo bersih kok makin tipis?"`
  - **Scene 2 (5–10 dtk — Masalah):** Transisi cepat menunjukkan teks ilustrasi potongan berlapis & biaya iklan yang menumpuk (tanpa menyebut nama merek kompetitor). *Teks layar:* `"Potongan berlapis + perang bidding iklan"`
  - **Scene 3 (11–18 dtk — Solusi Admin Flat 4%):** Layar berubah terang ke tampilan antarmuka bersih `kawanbelanja.com` dengan animasi badge `4%`. *Teks layar:* `"Di Kawan Belanja: Admin Flat 4% Saja"`
  - **Scene 4 (19–24 dtk — Solusi Fair Rank):** Visual mock-up etalase pertama bergantian menampilkan produk kerajinan, camilan, dan fesyen UMKM lokal. *Teks layar:* `"Sistem Fair Rank: Giliran tampil di etalase pertama"`
  - **Scene 5 (25–30 dtk — End-Card CTA):** Latar bersih berisi logo **Kawan Belanja**, ringkasan 3 poin (`Flat 4% • Fair Rank • COD & Voucher`), dan panah mengarah ke tombol CTA di bawah. *Teks layar:* `"Kenali ekosistem UMKM di kawanbelanja.com"`
- **Saran Audio / Voiceover:** Musik latar akustik ringan bertempo sedang (*upbeat-warm*), dipadukan suara voiceover Bahasa Indonesia natural yang ramah dan tidak terburu-buru (gaya ngobrol rekan usaha, bukan gaya iklan televisi yang berteriak).

---
---

# FUNNEL 2 — AKUISISI PEMBELI

## 1. Status & Struktur Campaign (`PAUSED`)
- **Nama Campaign:** `KB_ID_BUYER_ACQ_COD_VOUCHER_202611`
- **Status Campaign:** `PAUSED (Draft Only)` — **`STATUS: PAUSED (TIDAK AUTO-PUBLISH)`**
- **Objective:** **Sales** (optimasi `ViewContent` → `AddToCart` → `Purchase` di `kawanbelanja.com`; opsi fase awal bila data pixel masih baru: **Traffic** menuju halaman kurasi produk promo & voucher).
- **Strategi Budget:**
  - **Fase Uji (Hari 1–7): ABO** agar anggaran pengujian audiens minat belanja produk lokal dan audiens pencari promo/COD bisa dievaluasi terpisah. Rekomendasi awal Rp75.000–Rp125.000/hari per ad set TOFU.
  - **Fase Optimasi:** Pindah ke **CBO** setelah kategori produk dan variasi kreatif dengan *Cost per Add to Cart* / *Cost per Purchase* terendah teridentifikasi.
- **Struktur Ad Set (`Status: PAUSED (TIDAK AUTO-PUBLISH)`):**
  - `AS1_TOFU_OnlineShoppers_COD_Promo` (Audiens luas pembeli online harian & pencari produk lokal)
  - `AS2_MOFU_Catalog_Engagers_30D` (Retargeting penginteraksi iklan/postingan IG & FB 30 hari)
  - `AS3_BOFU_ViewContent_AddToCart_14D` (Retargeting pengunjung yang sudah lihat produk atau masukkan keranjang namun belum *checkout*)
- **Metrik Evaluasi:** CTR, *Cost per View Content*, *Cost per Add to Cart*, dan *ROAS / Cost per Checkout*.

---

## 2. Saran Targeting & Funnel (TOFU / MOFU / BOFU)

### A. Demografi
- **Lokasi:** Indonesia (fokus wilayah dengan jaringan ekspedisi COD lancar: Jawa, Bali, kota-kota besar Sumatra, Kalimantan, dan Sulawesi).
- **Usia:** 20–48 tahun (pembeli aktif kebutuhan rumah tangga, fesyen lokal, kuliner kemasan, hingga produk perawatan harian).
- **Jenis Kelamin:** Semua (*All*).
- **Bahasa:** Bahasa Indonesia.

### B. Detailed Targeting & Audiens per Tahap Funnel
- **TOFU (Cold Audience — Penemuan Produk UMKM & Fitur Hemat):**
  - **Behaviors:** *Engaged Shoppers* (pengguna yang aktif mengklik tombol *Shop Now* dalam 7 hari terakhir).
  - **Interests:** *Online shopping*, *Coupons* / *Discounts and allowances*, *Indonesian cuisine / Local snacks*, *Modest fashion / Batik / Streetwear lokal*, *Home & kitchen*, *Handicrafts*.
  - **Saran Exclusion:** Kecualikan pembeli yang baru menyelesaikan *Purchase* dalam 3 hari terakhir pada ad set prospek dingin.
- **MOFU (Warm Audience — Pengingat Voucher & Rasa Aman COD):**
  - *Custom Audience:* Penonton video iklan 50%+ dan penginteraksi akun IG/FB Kawan Belanja (30 hari).
  - *Lookalike Audience (LAL 1% Indonesia):* Berdasarkan profil pembeli yang pernah melakukan *checkout* dengan Voucher / COD.
- **BOFU (Hot Audience — Penuntasan Checkout):**
  - *Custom Audience:* Pengunjung yang sudah `ViewContent` atau `AddToCart` dalam 14 hari terakhir namun belum `Purchase` — dorong dengan pengingat **COD**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang**.

### C. Rekomendasi Placement
- **Instagram Feed**, **Instagram Reels**, **Instagram Stories**, **Facebook Feed**, **Facebook Marketplace (Feed)**, dan **Facebook Reels**. Gunakan aset `1:1` untuk penempatan Feed dan `9:16` untuk Stories/Reels.

---

## 3. Variasi Ad Copy — Funnel Akuisisi Pembeli (A / B / C Test)

### Variasi A — Angle: Rasa Aman COD + Dukung Produk UMKM Lokal
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Menghilangkan ragu transaksi di toko baru lewat **COD (Bayar di Tempat)** + **Voucher Gratis Ongkir**
- **Primary Text:**
  > Ingin belanja produk UMKM Indonesia langsung dari pembuatnya, tapi masih lebih nyaman bayar saat barang sudah sampai di tangan?
  >
  > Di **Kawan Belanja (`kawanbelanja.com`)**, kamu bisa belanja dengan tenang menggunakan metode pembayaran **COD (Bayar di Tempat)**! Tidak perlu ragu soal ongkos kirim juga, karena tersedia **Voucher Gratis Ongkir** dan **Voucher Potongan Harga Barang** yang bikin keranjang belanja makin hemat.
  >
  > Temukan beragam camilan lokal, fesyen harian, hingga perlengkapan rumah tangga dari pelaku UMKM Indonesia sekarang.
- **Headline (37 karakter — maks. 40):** `Belanja UMKM Bisa COD & Gratis Ongkir`
- **Description:** `Cek paket dulu, baru bayar di rumah.`
- **CTA Button:** `Belanja Sekarang`

### Variasi B — Angle: Hemat Maksimal dengan Kombinasi Voucher
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Sensitivitas harga & ongkir → **Voucher Gratis Ongkir** + **Voucher Potongan Harga Barang**
- **Primary Text:**
  > Sering batal *checkout* karena ongkir terasa berat di akhir? Saatnya belanja lebih ringan di **Kawan Belanja (`kawanbelanja.com`)**!
  >
  > Nikmati kombinasi promo ramah kantong:
  > 🚚 **Voucher Gratis Ongkir** biar belanja lintas kota tetap hemat
  > 🏷️ **Voucher Potongan Harga Barang** untuk produk pilihan UMKM
  > 📦 Pilihan bayar **COD (Bayar di Tempat)** yang praktis dan aman
  >
  > Selain lebih hemat, potongan admin seller di platform ini hanya flat 4% sehingga banyak UMKM bisa menawarkan harga yang wajar langsung untukmu.
- **Headline (36 karakter — maks. 40):** `Klaim Voucher Diskon & Gratis Ongkir`
- **Description:** `Tersedia COD di kawanbelanja.com.`
- **CTA Button:** `Belanja Sekarang`

### Variasi C — Angle: Variasi Produk Lokal yang Tidak Monoton (Fair Rank Benefit untuk Pembeli)
- **Status Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`
- **Angle:** Halaman depan penuh ragam produk UMKM asli, bukan produk iklan yang sama berulang-ulang
- **Primary Text:**
  > Bosan melihat etalase belanja yang isinya itu-itu saja? Di **Kawan Belanja (`kawanbelanja.com`)**, produk UMKM dari berbagai daerah tampil bergiliran di etalase depan sehingga kamu lebih mudah menemukan barang lokal berkualitas yang unik dan terjangkau.
  >
  > Lengkap dengan fitur **COD (Bayar di Tempat)**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang** agar pengalaman belanjamu makin nyaman dari awal sampai paket tiba.
- **Headline (37 karakter — maks. 40):** `Produk Lokal Pilihan, Bayar di Tempat`
- **Description:** `Pakai Voucher Gratis Ongkir & Diskon.`
- **CTA Button:** `Pelajari Selengkapnya`

---

## 4. Brief Aset Visual — Funnel Akuisisi Pembeli

### A. Format `1:1` (1080×1080 px — Instagram Feed & Facebook Feed)
- **Konsep Visual:** Kolase gaya katalog hangat (*clean grid*) menampilkan 3–4 kategori produk UMKM yang rapi (kopi/camilan kemasan lokal, tas rajut/fesyen kasual, perlengkapan dapur estetik) dengan ilustrasi kurir menyerahkan paket di sudut bawah sebagai simbol pembayaran **COD**.
- **Hierarki Text Overlay:**
  1. *Headline besar (atas):* **`BELANJA PRODUK UMKM BISA COD`**
  2. *Highlight Badge:* **`Voucher Gratis Ongkir + Potongan Harga Barang`**
  3. *Footer:* `kawanbelanja.com`
- **Palet Warna & Mood:** Hangat, cerah, dan mengundang klik — kombinasi biru Kawan Belanja (`#2563EB`), hijau promo (`#10B981`), dan sentuhan krem/putih bersih (`#FFFFFF` / `#FFFBEB`) agar foto produk UMKM tetap menjadi fokus utama.
- **Elemen Wajib:** Logo **Kawan Belanja (`kawanbelanja.com`)**, ikon/badge **`COD BAYAR DI TEMPAT`**, **`VOUCHER GRATIS ONGKIR`**, dan **`VOUCHER POTONGAN HARGA`**.

### B. Format `9:16` (1080×1920 px — Instagram Reels, Stories & Facebook Reels)
- **Aturan Safe Zone Teks:**
  - Pastikan semua badge voucher dan teks inti berada di dalam area aman vertikal (`Y: 320–1420 px`) dan tidak menyentuh sisi kanan (`120 px`) agar tidak tertutup tombol interaksi Reels/Stories maupun tombol *Belanja Sekarang*.
- **Storyboard 4 Scene (Durasi Total ~20–25 Detik):**
  - **Scene 1 (0–4 dtk — Hook Visual):** Pembeli sedang scrolling ponsel dengan ekspresi ragu melihat angka ongkir, lalu tersenyum saat membuka tampilan `kawanbelanja.com`. *Teks layar:* `"Cari produk lokal yang ramah ongkir & aman?"`
  - **Scene 2 (5–11 dtk — Unboxing & COD):** Visual paket UMKM tiba di teras rumah dan pembeli membayar langsung ke kurir dengan senyum santai. *Teks layar:* `"Bisa COD (Bayar di Tempat)"`
  - **Scene 3 (12–18 dtk — Demo Voucher):** Tampilan animasi *tap* mengaktifkan dua kartu voucher di halaman *checkout*: **Voucher Gratis Ongkir** dan **Voucher Potongan Harga Barang**. *Teks layar:* `"Pakai Voucher Gratis Ongkir + Potongan Harga Barang"`
  - **Scene 4 (19–24 dtk — End-Card CTA):** Montase cepat aneka produk UMKM lokal yang rapi diikuti logo `kawanbelanja.com`. *Teks layar:* `"Belanja hemat & dukung UMKM di kawanbelanja.com"`
- **Saran Audio / Voiceover:** Musik latar ceria bertempo ringan, disertai suara voiceover singkat yang menekankan kata kunci **COD**, **Voucher Gratis Ongkir**, dan **Voucher Potongan Harga Barang** dengan intonasi santai dan jelas.

---

## Ringkasan Verifikasi Kepatuhan Sebelum Hand-off ke QA (`Bima`)
- **Status Seluruh Campaign / Ad Set / Ad:** `PAUSED (TIDAK AUTO-PUBLISH)`.
- **Panjang Headline Meta Ads (Maks. 40 Karakter):** Seluruh 6 variasi berada di rentang 35–37 karakter.
- **Kebijakan Iklan & Brand:** Bebas penyebutan nama merek marketplace kompetitor, bebas serangan atribut personal negatif, bebas klaim 0% admin, dan bebas janji instan.
