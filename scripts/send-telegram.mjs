#!/usr/bin/env node
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Force IPv4 first on Windows/Node 22 so api.telegram.org doesn't stall on IPv6 DNS
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key] && value) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT_DIR, ".env.local"));
loadEnvFile(path.join(ROOT_DIR, ".env"));
loadEnvFile(path.join(ROOT_DIR, "office-ui", ".env.local"));

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function printHelp() {
  console.log(`
Kawan Belanja — Telegram Founder & Team Reporter (Gratis 100%)

Penggunaan:
  node scripts/send-telegram.mjs --get-chats
  node scripts/send-telegram.mjs --text "Ringkasan laporan QA siap ditinjau"
  node scripts/send-telegram.mjs --file workspace/qa/2026-11-21-qa-potongan-admin-umkm-fair-rank.md
  node scripts/send-telegram.mjs --photo workspace/assets/poster.png --caption "Poster siap upload"
  node scripts/send-telegram.mjs --video workspace/assets/reels.mp4 --caption "Video Reels 9:16"

Konfigurasi wajib di .env.local (root proyek):
  TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
  TELEGRAM_CHAT_ID=123456789 (atau -4512345678 untuk Grup Privat Tim)
`);
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 35)}\n\n...(terpotong, buka file lokal untuk detail lengkap)`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatFetchError(err) {
  if (!(err instanceof Error)) return String(err);
  const cause = err.cause;
  if (cause && typeof cause === "object") {
    const code = cause.code ? `[${cause.code}] ` : "";
    const msg = cause.message || err.message;
    return `${code}${msg}`;
  }
  return err.message;
}

async function fetchWithRetry(url, buildOptions, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const options = typeof buildOptions === "function" ? buildOptions() : buildOptions;
      return await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000),
      });
    } catch (err) {
      lastError = err;
      const reason = formatFetchError(err);
      if (attempt < maxRetries) {
        const waitMs = attempt * 2000;
        console.warn(
          `Koneksi Telegram gagal (${reason}), mencoba ulang ${attempt}/${maxRetries - 1} dalam ${
            waitMs / 1000
          } detik...`
        );
        await sleep(waitMs);
      }
    }
  }
  const detail = formatFetchError(lastError);
  throw new Error(
    `Gagal menghubungi api.telegram.org (${detail}). Pastikan koneksi internet stabil & DNS tidak memblokir Telegram (coba DNS 1.1.1.1 / 8.8.8.8 jika perlu).`
  );
}

async function listKnownChats(token) {
  const res = await fetchWithRetry(`https://api.telegram.org/bot${token}/getUpdates`, {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram getUpdates gagal: ${data?.description || res.status}`);
  }

  const chatMap = new Map();
  for (const upd of data.result || []) {
    const candidates = [
      upd.message?.chat,
      upd.edited_message?.chat,
      upd.channel_post?.chat,
      upd.my_chat_member?.chat,
    ];
    for (const chat of candidates) {
      if (chat && chat.id !== undefined) {
        const label =
          chat.title ||
          [chat.first_name, chat.last_name].filter(Boolean).join(" ") ||
          chat.username ||
          "(Tanpa Nama)";
        chatMap.set(String(chat.id), {
          id: String(chat.id),
          type: chat.type || "unknown",
          label,
        });
      }
    }
  }

  if (chatMap.size === 0) {
    console.log(
      "Belum ada chat terbaca di getUpdates.\n" +
        "Silakan kirim pesan /start@username_bot_kamu di grup atau chat pribadi dengan bot terlebih dahulu, lalu jalankan ulang perintah ini."
    );
    return;
  }

  console.log("\nDaftar Chat ID yang terdeteksi oleh bot kamu:\n");
  for (const item of chatMap.values()) {
    console.log(`- Chat ID: ${item.id}  | Tipe: ${item.type}  | Nama: ${item.label}`);
  }
  console.log("\nSalin Chat ID di atas (termasuk tanda '-' jika grup) ke TELEGRAM_CHAT_ID di .env.local.\n");
}

async function sendTextMessage(token, chatId, text) {
  const body = JSON.stringify({
    chat_id: chatId,
    text: truncate(text, 3900),
    disable_web_page_preview: true,
  });

  const res = await fetchWithRetry(`https://api.telegram.org/bot${token}/sendMessage`, () => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }));

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram sendMessage gagal: ${data?.description || res.status}`);
  }
  console.log("Berhasil mengirim laporan teks ke Telegram (message_id:", data.result.message_id + ")");
}

async function sendMediaFile(token, chatId, method, fieldName, filePath, caption, mimeType) {
  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(ROOT_DIR, filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(`File tidak ditemukan: ${absPath}`);
  }

  const bytes = fs.readFileSync(absPath);
  const fileName = path.basename(absPath);

  const res = await fetchWithRetry(`https://api.telegram.org/bot${token}/${method}`, () => {
    const blob = new Blob([bytes], { type: mimeType });
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append(fieldName, blob, fileName);
    if (caption) {
      form.append("caption", truncate(caption, 950));
    }
    return {
      method: "POST",
      body: form,
    };
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram ${method} gagal: ${data?.description || res.status}`);
  }
  console.log(`Berhasil mengirim ${fieldName} (${fileName}) ke Telegram!`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    console.error(
      "TELEGRAM_BOT_TOKEN belum diisi di .env.local.\n" +
        "Buat bot gratis via @BotFather di Telegram, lalu isi token ke file .env.local di root proyek."
    );
    process.exit(1);
  }

  if (args["get-chats"]) {
    await listKnownChats(token);
    return;
  }

  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!chatId) {
    console.error(
      "TELEGRAM_CHAT_ID belum diisi di .env.local.\n" +
        "Jalankan 'node scripts/send-telegram.mjs --get-chats' untuk melihat Chat ID kamu."
    );
    process.exit(1);
  }

  if (typeof args.photo === "string") {
    const ext = path.extname(args.photo).toLowerCase();
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    await sendMediaFile(
      token,
      chatId,
      "sendPhoto",
      "photo",
      args.photo,
      typeof args.caption === "string" ? args.caption : undefined,
      mime
    );
    return;
  }

  if (typeof args.video === "string") {
    await sendMediaFile(
      token,
      chatId,
      "sendVideo",
      "video",
      args.video,
      typeof args.caption === "string" ? args.caption : undefined,
      "video/mp4"
    );
    return;
  }

  if (typeof args.file === "string") {
    const absFile = path.isAbsolute(args.file)
      ? args.file
      : path.resolve(ROOT_DIR, args.file);
    if (!fs.existsSync(absFile)) {
      throw new Error(`File laporan tidak ditemukan: ${absFile}`);
    }
    const content = fs.readFileSync(absFile, "utf8");
    const header = `Laporan Kantor Virtual Kawan Belanja\nFile: ${args.file}\n\n`;
    await sendTextMessage(token, chatId, `${header}${content}`);
    return;
  }

  if (typeof args.text === "string" && args.text.trim()) {
    await sendTextMessage(token, chatId, args.text.trim());
    return;
  }

  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
