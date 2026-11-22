# Konteks Bisnis — Kawan Belanja (`kawanbelanja.com`)

Aturan ini adalah sumber kebenaran utama (*single source of truth*) bagi seluruh agen di **Kantor Virtual Marketing & Ads Kawan Belanja**. Semua riset, konten, strategi iklan, dan pemeriksaan kualitas wajib selaras dengan konteks berikut.

---

## 1. Identitas Brand
- **Nama Brand:** Kawan Belanja
- **Domain / Platform:** `kawanbelanja.com`
- **Kategori:** Platform *e-commerce multi-vendor* Indonesia yang berpihak pada UMKM dan memberikan pengalaman belanja yang adil bagi pembeli.
- **Tone of Voice Brand:** Ramah, jujur, suportif terhadap UMKM, solutif, berbahasa Indonesia natural (bukan gaya terjemahan kaku atau terlalu korporat), dan mudah dipahami pelaku usaha maupun pembeli harian.

---

## 2. Keunggulan Utama (Unique Selling Propositions / USP)

Setiap materi komunikasi harus berakar pada 3 pilar USP berikut tanpa mengubah angka atau ketentuannya:

1. **Potongan Biaya Admin Flat 4% Saja**
   - Kawan Belanja hanya mengenakan potongan biaya admin **flat 4%** kepada seller.
   - Sangat ramah bagi seller UMKM dibandingkan marketplace besar yang mengenakan berbagai potongan berlapis dan biaya tambahan tinggi sehingga menggerus margin keuntungan penjual.
   - Jangan pernah melebih-lebihkan menjadi "0% selamanya" atau "gratis tanpa potongan", karena nilai jual utamanya adalah transparansi dan keringanan **flat 4%**.

2. **Sistem "Fair Rank"**
   - Setiap produk dari seller (termasuk toko baru maupun UMKM kecil) berkesempatan tampil di **etalase paling pertama secara bergiliran** tanpa harus "bakar uang" untuk iklan berbayar atau perang *bidding*.
   - Fokus narasi: kesempatan tampil yang adil, visibilitas merata, bukan monopoli modal besar.
   - Jangan menjanjikan "pasti langsung laku/viral dalam 1 jam", melainkan jelaskan bahwa peluang eksposur di etalase pertama dibagi secara adil dan bergiliran lewat sistem Fair Rank.

3. **Fitur Pembeli & Promo Lengkap**
   - Mendukung metode pembayaran **COD (Cash on Delivery / Bayar di Tempat)** untuk meningkatkan kepercayaan pembeli.
   - Mendukung **Voucher Gratis Ongkir**.
   - Mendukung **Voucher Potongan Harga Barang**.

---

## 3. Kanal Pemasaran & Iklan Resmi
- **Organik & Komunitas:** Instagram, Facebook, WhatsApp (Broadcast/Komunitas), Threads, TikTok, dan X (Twitter).
- **Iklan Berbayar:** Meta Ads Manager (Facebook & Instagram Ads).

---

## 3B. Pedoman Warna & Identitas Visual Brand (Brand Color Guardrails)

Semua aset visual (Remotion Studio, Canva, maupun prompt Google Flow) wajib menjaga identitas visual Kawan Belanja berdasarkan aset referensi resmi di `assets-KWBJ/referensi-image/` dan logo resmi `media-studio/public/assets/logo-kawanbelanja.png`:

### A. Palet Warna Inti (~80% Area Desain)
- **Terracotta Brick (Logo & Aksen Brand Utama):** `#B04828`
- **Burnt Orange (Tombol CTA & Highlight Utama):** `#C05008` s.d. `#D45D18`
- **Deep Terracotta / Espresso (Latar Mode Gelap / Seller):** `#782808` – `#883010` / `#3A2618`
- **Warm Ivory Cream (Latar Mode Terang / App & Pembeli):** `#FFF8F0` – `#FFF0E0`
- **Soft Peach Cream (Kartu, Kotak Ringkasan, Surface):** `#FFE8D8` – `#F8E0D0`
- **Espresso Charcoal (Teks Judul Utama di Latar Terang):** `#241914` – `#282828`
- **Warm Cocoa & Sand Border (Teks Sekunder & Garis Kartu):** `#6B4E3D` / `#E8D0B8`

### B. Warna Kontras & Aksen yang Diizinkan (~10–15% Area)
- **Fresh Leaf Green (`#16A34A` / `#22C55E`):** Untuk angka hemat, badge *Gratis Ongkir*, tanda centang profit/keunggulan, dan grafik naik.
- **Warm Golden Amber (`#F59E0B` / `#F7B955`):** Untuk bintang rating, sorotan angka promo, dan tombol CTA terang di atas latar Terracotta gelap.
- **Warm Coral Red (`#E5484D`):** Khusus stiker/tag persentase diskon kecil atau ikon komparasi negatif.
- **Champagne Cream (`#FFF0D0`):** Garis/teks lembut di atas latar Terracotta gelap.

### C. Batas Larangan Warna (Wajib Ditolak QA)
- **DILARANG** memakai latar biru gelap/slate dingin (`#020617`, `#0F172A`) atau pencahayaan *cyberpunk* biru/ungu.
- **DILARANG** memakai aksen neon biru, cyan, ungu elektrik, atau pink magenta (`#3B82F6`, `#6366F1`, `#8B5CF6`, `#EC4899`) sebagai warna dominan poster/iklan Kawan Belanja.

---

## 4. Aturan Keamanan & Operasional Ketat (WAJIB DIPATUHI)
1. **Dilarang Auto-Posting ke Media Sosial:** Agen TIDAK BOLEH melakukan *auto-posting* langsung ke Instagram, Facebook, WhatsApp, Threads, TikTok, atau X melalui bot browser, otomasi UI, maupun skrip publikasi otomatis.
2. **Dilarang Auto-Publish Meta Ads:** Agen TIDAK BOLEH mem-publish atau mengaktifkan kampanye iklan Meta Ads secara otomatis.
3. **Aturan Ketat Metricool MCP (Paket Free — Mode Baca & Draft Saja):**
   - Tool `createScheduledPostForReview` memerlukan paket berbayar *Advanced* dan akan error pada paket Free.
   - Oleh karena itu, pada paket **Metricool Free**, agen **BOLEH** memakai tool baca (`getBrandSettings`, `getBestTimeToPostByNetwork`, `getScheduledPosts`, `getAnalyticsAvailableMetrics`, `getAnalyticsDataByMetrics`) dan **HANYA BOLEH** memakai `createScheduledPost` dengan parameter **`draft: true`** dan **`autoPublish: false`** (draft tidak memakan kuota 20 post terbit/bulan selama belum dijadwalkan tayang).
   - Agen **DILARANG** mengirim `draft: false` atau `autoPublish: true` tanpa perintah eksplisit dari Founder.
4. **Output Wajib Berupa Draf / Status `PAUSED`:**
   - Semua konten media sosial harus disimpan sebagai **draf siap pakai** (`.md`) di `workspace/content/` (dan bila dimasukkan ke Metricool, wajib **`draft: true`** dan **`autoPublish: false`**).
   - Semua konfigurasi/strategi Meta Ads harus disimpan di `workspace/ads/` dan secara eksplisit ditandai dengan status **`PAUSED`** (atau **`DRAFT`**).
5. **Kerahasiaan Kredensial:** Dilarang mencetak, menyalin, atau menyimpan isi `.env.local` (`TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`, dll.) ke `chatLog`, file `workspace/`, Google Sheets, Google Docs, maupun pesan Telegram.
6. **Kepatuhan Etika & Platform:** Dilarang menyebut merek marketplace kompetitor secara menjelekkan/defamasi; gunakan istilah umum seperti *"marketplace besar"*, *"platform sebelah"*, atau *"biaya admin platform lain yang makin mencekik"*. Dilarang membuat klaim hasil instan yang menyesatkan (*overclaim*).
