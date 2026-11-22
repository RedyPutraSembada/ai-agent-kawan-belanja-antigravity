# Protokol Kantor Virtual & Sinkronisasi Status (`office-state.json`)

Aturan ini mengatur tata cara kerja seluruh 5 divisi di **Kantor Virtual Marketing & Ads Kawan Belanja** agar dashboard web (`office-ui/`) dan log komunikasi antar divisi selalu sinkron secara *real-time*, sekaligus menjaga efisiensi token.

---

## 1. Daftar Key Agen Resmi (5 Divisi)
Gunakan *key* berikut secara tepat di dalam file `office-state.json`:
- `raka` — **Raka** (`Trend & Market Researcher` | `Meja Riset` | `#3B82F6`)
- `dina` — **Dina** (`Social Media & Copywriter` | `Meja Konten` | `#EC4899`)
- `sari` — **Sari** (`Meta Ads & Funnel Strategist` | `Meja Meta Ads` | `#F59E0B`)
- `reno` — **Reno** (`Visual & Video Producer` | `Meja Studio Visual` | `#8B5CF6`)
- `bima` — **Bima** (`Brand QA & Reporter` | `Meja QA Checker` | `#10B981`)

---

## 2. Protokol Wajib Update `office-state.json`

Setiap kali menjalankan peran salah satu divisi, agen **WAJIB** memperbarui file `office-state.json` di root folder proyek (`d:\Ngoding Antigravity\ai-agent-antigravity\office-state.json`) dalam **dua fase**:

### Fase A — Sebelum Mulai Bekerja
1. Ubah `agents.<key>.status` menjadi `"working"`.
2. Isi `agents.<key>.task` dengan deskripsi singkat & jelas tugas yang sedang dikerjakan (maksimal ~80–100 karakter agar terbaca rapi di balon status dashboard).
3. Perbarui `lastUpdated` dengan timestamp ISO-8601 terbaru (misal zona waktu `+07:00`).
4. Tambahkan satu objek pesan baru ke array `chatLog`:
   ```json
   {
     "id": "msg-<timestamp-unik>",
     "sender": "Reno",
     "role": "Visual & Video Producer",
     "avatarColor": "#8B5CF6",
     "message": "Mulai menyiapkan aset dan merender poster PNG & video Reels Remotion...",
     "timestamp": "2026-11-22T19:00:00+07:00",
     "type": "update"
   }
   ```

### Fase B — Setelah Selesai Bekerja
1. Ubah `agents.<key>.status` menjadi `"done"`.
2. Perbarui `agents.<key>.task` dengan ringkasan hasil singkat + path file output (contoh: `"Selesai → workspace/assets/2026-11-22-promo-square.png"`).
3. Perbarui `lastUpdated` dengan timestamp ISO-8601 terbaru.
4. Tambahkan pesan ringkasan hasil ke `chatLog` (termasuk path file output dan catatan estafet/handoff ke divisi berikutnya).

---

## 3. Alur Estafet Kerja & Efisiensi Token

### Alur Estafet Penuh (5 Divisi)
1. **Raka (`raka`)** meriset tren/keluhan pasar → `workspace/trends/`.
2. **Dina (`dina`)** mengubah riset menjadi paket konten 7 hari → `workspace/content/`.
3. **Sari (`sari`)** menyusun strategi Meta Ads (`PAUSED`) & prompt Google Flow → `workspace/ads/`.
4. **Reno (`reno`)** mengumpulkan aset visual & merender poster `.png` / video `.mp4` lewat Remotion (`media-studio/`) → `workspace/assets/`.
5. **Bima (`bima`)** mengaudit seluruh output teks & visual (`workspace/assets/`), mencatat laporan QA → `workspace/qa/`, dan mengirim ringkasan laporan ke Founder (Telegram jika terkonfigurasi).

### Mode Modular Hemat Token
- Jika founder hanya membutuhkan revisi visual/poster baru, panggil **`reno`** (dan **`bima`** untuk QA) tanpa mengulang riset Raka atau paket konten 7 hari Dina.
- Jika hanya butuh strategi iklan baru untuk topik riset yang sudah ada di `workspace/trends/`, mulai langsung dari **`sari` → `reno` → `bima`**.

---

## 3B. Peta Integrasi Eksternal & Prinsip Hemat Token
Selalu simpan draf utama ke folder lokal `workspace/` terlebih dahulu, baru panggil integrasi eksternal sesuai pembagian tugas berikut (jangan memanggil tool eksternal berulang-ulang jika belum diperlukan):
- **Raka (`raka`):** Pencarian Web + *(opsional)* baca metrik performa konten lama lewat **Metricool MCP**.
- **Dina (`dina`):** *(opsional)* cek jam posting terbaik via **Metricool MCP**, sinkron kalender 7 hari ke **Google Sheets**, serta kirim draf **For Review** ke Metricool setelah QA lolos (jika diminta Founder).
- **Sari (`sari`):** Strategi Meta Ads (`PAUSED`) & Google Flow Prompts + *(opsional)* ekspor ringkasan kampanye ke **Google Docs** (jika diminta).
- **Reno (`reno`):** Render `.png`/`.mp4` lewat **Remotion Studio** (`media-studio/`) + *(opsional)* upload hasil ke **Google Drive** agar tim mudah mengunduh di HP, atau penyesuaian desain via **Canva**.
- **Bima (`bima`):** Audit QA teks & visual + kirim ringkasan laporan dan preview poster ke **Grup Telegram Tim** lewat `scripts/send-telegram.mjs`.

---

## 4. Aturan Integritas JSON
- Selalu pertahankan struktur lengkap `officeName`, `lastUpdated`, `agents` (`raka`, `dina`, `sari`, `reno`, `bima`), dan `chatLog`.
- Jangan menghapus key `name`, `role`, `desk`, atau `avatarColor` milik agen mana pun.
- Pastikan nilai `status` hanya berupa salah satu dari: `"idle"`, `"working"`, atau `"done"`.
- Pastikan `office-state.json` selalu valid JSON sebelum dan sesudah diedit agar endpoint `/api/status` di `office-ui` tidak error.
