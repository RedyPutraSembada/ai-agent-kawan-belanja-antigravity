#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
Kawan Belanja — Telegram Founder Reporter (Gratis 100%)

Penggunaan:
  node scripts/send-telegram.mjs --text "Ringkasan laporan QA siap ditinjau"
  node scripts/send-telegram.mjs --file workspace/qa/2026-11-21-qa-potongan-admin-umkm-fair-rank.md
  node scripts/send-telegram.mjs --photo workspace/assets/poster.png --caption "Poster siap upload"
  node scripts/send-telegram.mjs --video workspace/assets/reels.mp4 --caption "Video Reels 9:16"

Konfigurasi wajib di .env.local (root proyek):
  TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
  TELEGRAM_CHAT_ID=123456789
`);
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 35)}\n\n...(terpotong, buka file lokal untuk detail lengkap)`;
}

async function sendTextMessage(token, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: truncate(text, 3900),
      disable_web_page_preview: true,
    }),
  });
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
  const blob = new Blob([bytes], { type: mimeType });
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append(fieldName, blob, path.basename(absPath));
  if (caption) {
    form.append("caption", truncate(caption, 950));
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram ${method} gagal: ${data?.description || res.status}`);
  }
  console.log(`Berhasil mengirim ${fieldName} (${path.basename(absPath)}) ke Telegram!`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    console.error(
      "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diisi di .env.local.\n" +
        "Buat bot gratis via @BotFather di Telegram, lalu isi token & chat_id ke file .env.local di root proyek."
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
