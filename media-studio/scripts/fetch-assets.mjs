#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STUDIO_DIR = path.resolve(__dirname, "..");
const ASSETS_DIR = path.join(STUDIO_DIR, "public", "assets");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let val = line.slice(eqIndex + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key] && val) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(STUDIO_DIR, ".env.local"));
loadEnvFile(path.join(STUDIO_DIR, ".env"));

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

function sanitizeFileName(name, fallbackExt = ".jpg") {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "-");
  if (/\.(png|jpe?g|webp)$/i.test(base)) {
    return base;
  }
  return `${base}${fallbackExt}`;
}

function printHelp() {
  console.log(`
Kawan Belanja — Pengumpul Aset Visual Otomatis (media-studio/public/assets/)

1. Mode Direct URL (Gratis tanpa API Key — unduh gambar yang ditemukan agen):
   node scripts/fetch-assets.mjs --url "https://example.com/foto.jpg" --out seller-umkm.jpg

2. Mode Pexels API (Opsional, pakai PEXELS_API_KEY gratis di media-studio/.env):
   node scripts/fetch-assets.mjs --query "indonesian small business packaging" --orientation square --out packaging.jpg

3. Mode Screenshot Asli kawanbelanja.com (via Browser Control Antigravity):
   - Buka https://kawanbelanja.com lewat Browser Subagent Antigravity.
   - Ambil screenshot halaman etalase / fitur Fair Rank / checkout COD.
   - Simpan file PNG/JPG hasil screenshot ke:
     media-studio/public/assets/kawanbelanja-screen.png
   - Lalu isi "imageFile": "kawanbelanja-screen.png" di media-studio/render-props.json.
`);
}

async function downloadToAssets(imageUrl, outName) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const res = await fetch(imageUrl, {
    headers: {
      "User-Agent": "KawanBelanjaMediaStudio/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Gagal mengunduh gambar (${res.status} ${res.statusText})`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`URL bukan file gambar (content-type: ${contentType || "unknown"})`);
  }

  let ext = ".jpg";
  if (contentType.includes("png")) ext = ".png";
  else if (contentType.includes("webp")) ext = ".webp";

  const safeName = sanitizeFileName(outName, ext);
  const outPath = path.join(ASSETS_DIR, safeName);
  const arrayBuf = await res.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  if (buf.length < 1024) {
    throw new Error(`Ukuran gambar terlalu kecil (${buf.length} bytes), kemungkinan rusak.`);
  }

  fs.writeFileSync(outPath, buf);
  console.log(`Aset berhasil disimpan: media-studio/public/assets/${safeName} (${buf.length} bytes)`);
  return safeName;
}

async function searchPexels(query, orientation = "square") {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "PEXELS_API_KEY belum diisi di media-studio/.env. Gunakan --url untuk download langsung tanpa API key, atau daftar Pexels API gratis."
    );
  }

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "3");
  if (["landscape", "portrait", "square"].includes(orientation)) {
    url.searchParams.set("orientation", orientation);
  }

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error (${res.status})`);
  }

  const data = await res.json();
  const photo = data?.photos?.[0];
  if (!photo) {
    throw new Error(`Tidak ditemukan foto Pexels untuk query: "${query}"`);
  }

  console.log(`Ditemukan foto Pexels oleh ${photo.photographer} (${photo.url})`);
  return photo.src?.large2x || photo.src?.large || photo.src?.original;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (typeof args.url === "string") {
    const outName = typeof args.out === "string" ? args.out : `asset-${Date.now()}.jpg`;
    await downloadToAssets(args.url, outName);
    return;
  }

  if (typeof args.query === "string") {
    const orientation =
      typeof args.orientation === "string" ? args.orientation : "square";
    const imageUrl = await searchPexels(args.query, orientation);
    const outName =
      typeof args.out === "string"
        ? args.out
        : `${args.query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`;
    await downloadToAssets(imageUrl, outName);
    return;
  }

  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
