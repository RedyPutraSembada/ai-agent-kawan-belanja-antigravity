import { existsSync, promises as fs } from "fs";
import path from "path";
import {
  createDefaultOfficeState,
  type AgentKey,
  type ChatTarget,
  type OfficeState,
} from "./office";

const AGENT_RULE_FILE: Record<AgentKey, string> = {
  raka: "02-trend-hunter.md",
  dina: "03-content-multiplier.md",
  sari: "04-meta-ads-strategist.md",
  reno: "04b-visual-producer.md",
  bima: "05-quality-checker.md",
};

const AGENT_START_MSG: Record<AgentKey, string> = {
  raka: "Mulai meriset tren pasar, keluhan seller, dan angle konten untuk brief ini...",
  dina: "Mulai menyusun paket draf konten 7 hari (IG, TikTok, FB, Threads, X, WA)...",
  sari: "Mulai merancang strategi Meta Ads (PAUSED), variasi ad copy A/B/C, & prompt Google Flow...",
  reno: "Mulai menyusun rencana aset visual, props Remotion (1:1, 9:16, 4:5), dan panduan produksi...",
  bima: "Mulai mengaudit seluruh draf teks & aset visual terhadap USP Kawan Belanja...",
};

/**
 * Resolves the root folder containing office-state.json, .agent/, and workspace/.
 */
export function getWorkspaceRoot(): string {
  const parentDir = path.resolve(process.cwd(), "..");
  if (existsSync(path.join(parentDir, "office-state.json"))) {
    return parentDir;
  }
  if (existsSync(path.join(process.cwd(), "office-state.json"))) {
    return process.cwd();
  }
  return parentDir;
}

export function getOfficeStatePath(): string {
  return path.join(getWorkspaceRoot(), "office-state.json");
}

export async function readOfficeState(): Promise<OfficeState> {
  const filePath = getOfficeStatePath();
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as OfficeState;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return createDefaultOfficeState();
    }
    throw err;
  }
}

export async function writeOfficeState(state: OfficeState): Promise<void> {
  const filePath = getOfficeStatePath();
  await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

async function readRuleText(filename: string): Promise<string> {
  const rulePath = path.join(getWorkspaceRoot(), ".agent", "rules", filename);
  try {
    return await fs.readFile(rulePath, "utf-8");
  } catch {
    return "";
  }
}

function slugify(text: string): string {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/^-|-$/g, "");

  return normalized || "brief-kawanbelanja";
}

function getJakartaDatePrefix(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function truncateText(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 3)}...`;
}

async function saveAgentOutput(
  agentKey: AgentKey,
  topic: string,
  markdown: string
): Promise<string> {
  const root = getWorkspaceRoot();
  const datePrefix = getJakartaDatePrefix();
  const slug = slugify(topic);

  const outputMap: Record<AgentKey, { dir: string; file: string }> = {
    raka: { dir: "trends", file: `${datePrefix}-${slug}.md` },
    dina: { dir: "content", file: `${datePrefix}-${slug}-7hari.md` },
    sari: { dir: "ads", file: `${datePrefix}-${slug}-meta-ads.md` },
    reno: { dir: "ads", file: `${datePrefix}-${slug}-visual-plan.md` },
    bima: { dir: "qa", file: `${datePrefix}-qa-${slug}.md` },
  };

  const target = outputMap[agentKey];
  const fullDir = path.join(root, "workspace", target.dir);
  await fs.mkdir(fullDir, { recursive: true });

  const fullPath = path.join(fullDir, target.file);
  await fs.writeFile(fullPath, `${markdown.trim()}\n`, "utf-8");

  return `workspace/${target.dir}/${target.file}`;
}

async function readLatestWorkspaceDrafts(): Promise<string> {
  const root = getWorkspaceRoot();
  const folders = ["trends", "content", "ads"];
  const snippets: string[] = [];

  for (const folder of folders) {
    const dirPath = path.join(root, "workspace", folder);
    try {
      const entries = await fs.readdir(dirPath);
      const mdFiles = entries.filter((f) => f.endsWith(".md")).sort().reverse();
      if (mdFiles.length > 0) {
        const latestFile = mdFiles[0];
        const content = await fs.readFile(path.join(dirPath, latestFile), "utf-8");
        snippets.push(
          `### File: workspace/${folder}/${latestFile}\n${content.slice(0, 4000)}`
        );
      }
    } catch {
      // Ignore missing or empty workspace subfolder
    }
  }

  return snippets.join("\n\n---\n\n");
}

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 2000;
const MAX_DELAY_MS = 32000;
const INTER_AGENT_COOLDOWN_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(headerValue: string | null): number | null {
  if (!headerValue) return null;
  const seconds = Number(headerValue);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(Math.max(Math.round(seconds * 1000), 1000), 60000);
  }
  const dateMs = Date.parse(headerValue);
  if (!Number.isNaN(dateMs)) {
    const diff = dateMs - Date.now();
    if (diff > 0) {
      return Math.min(Math.max(diff, 1000), 60000);
    }
  }
  return null;
}

type RetryCallback = (
  attempt: number,
  maxRetries: number,
  delaySeconds: number,
  reason: string
) => Promise<void> | void;

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  onRetry?: RetryCallback
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY belum diisi di office-ui/.env.local. Silakan tambahkan API key lalu restart server."
    );
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
    } catch (networkError) {
      const netMsg =
        networkError instanceof Error ? networkError.message : "Koneksi jaringan terputus";
      if (attempt < MAX_RETRIES) {
        const delayMs =
          Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt)) +
          Math.floor(Math.random() * 1000);
        await onRetry?.(attempt + 1, MAX_RETRIES, Math.ceil(delayMs / 1000), netMsg);
        await sleep(delayMs);
        continue;
      }
      throw new Error(`Gagal menghubungi Gemini API (${model}): ${netMsg}`);
    }

    const payload = (await response.json().catch(() => null)) as
      | {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
          error?: { message?: string };
        }
      | null;

    if (!response.ok) {
      const apiMsg = payload?.error?.message || `HTTP ${response.status}`;
      if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRIES) {
        const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
        const backoffMs =
          Math.min(MAX_DELAY_MS, BASE_DELAY_MS * Math.pow(2, attempt)) +
          Math.floor(Math.random() * 1000);
        const delayMs = retryAfterMs ?? backoffMs;

        await onRetry?.(attempt + 1, MAX_RETRIES, Math.ceil(delayMs / 1000), apiMsg);
        await sleep(delayMs);
        continue;
      }
      throw new Error(`Gagal memanggil Gemini API (${model}): ${apiMsg}`);
    }

    const parts = payload?.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new Error(
        `Gemini API (${model}) tidak mengembalikan teks output. Coba ulangi dengan brief yang lebih spesifik.`
      );
    }

    return text;
  }

  throw new Error(`Gagal memanggil Gemini API (${model}) setelah ${MAX_RETRIES + 1} percobaan.`);
}

function buildAgentPrompt(
  agentKey: AgentKey,
  userMessage: string,
  priorOutputs: Partial<Record<AgentKey, { path: string; content: string }>>,
  existingDrafts: string
): string {
  const sharedNotes =
    "Catatan sistem: Sistem backend sudah menangani update office-state.json dan penyimpanan file Markdown secara otomatis. Berikan HANYA isi dokumen Markdown lengkap yang siap disimpan (tanpa pembungkus kode tambahan yang tidak perlu).";

  if (agentKey === "raka") {
    return `${sharedNotes}\n\nPermintaan Boss/Owner:\n${userMessage}\n\nSusun riset tren & market insight lengkap sesuai struktur output standar Raka.`;
  }

  if (agentKey === "dina") {
    const rakaContext = priorOutputs.raka
      ? `\n\nHasil riset terbaru dari Raka (${priorOutputs.raka.path}):\n${priorOutputs.raka.content}`
      : "";
    return `${sharedNotes}\n\nPermintaan Boss/Owner:\n${userMessage}${rakaContext}\n\nSusun paket draf konten 7 hari lengkap (IG, TikTok, FB, Threads, X, Broadcast WA Seller & Pembeli) sesuai struktur output standar Dina.`;
  }

  if (agentKey === "sari") {
    const contextBlocks = [
      priorOutputs.raka
        ? `Hasil riset Raka (${priorOutputs.raka.path}):\n${priorOutputs.raka.content}`
        : "",
      priorOutputs.dina
        ? `Ringkasan paket konten Dina (${priorOutputs.dina.path}):\n${priorOutputs.dina.content.slice(
            0,
            2500
          )}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");

    return `${sharedNotes}\n\nPermintaan Boss/Owner:\n${userMessage}${
      contextBlocks ? `\n\nKonteks divisi sebelumnya:\n${contextBlocks}` : ""
    }\n\nSusun strategi kampanye Meta Ads berstatus PAUSED (Akuisisi Seller & Pembeli, targeting TOFU/MOFU/BOFU, minimal 3 variasi ad copy A/B/C), saran props Remotion untuk Reno, serta 2–3 prompt sinematik berbahasa Inggris siap copy-paste ke Google Flow sesuai standar Sari.`;
  }

  if (agentKey === "reno") {
    const sariContext = priorOutputs.sari
      ? `\n\nArahan strategi & visual dari Sari (${priorOutputs.sari.path}):\n${priorOutputs.sari.content}`
      : "";
    return `${sharedNotes}\n\nPermintaan Boss/Owner:\n${userMessage}${sariContext}\n\nSusun rencana produksi aset visual untuk Remotion Studio (media-studio/): sertakan JSON props siap pakai untuk komposisi PromoSquare (1:1), PromoVertical (9:16), dan ComparisonCard (4:5), saran foto stok/screenshot kawanbelanja.com, serta perintah npx.cmd remotion still/render untuk menghasilkan file PNG/MP4 ke workspace/assets/.`;
  }

  const pipelineMaterial = Object.entries(priorOutputs)
    .map(([key, val]) => `### Output ${key} (${val.path})\n${val.content}`)
    .join("\n\n---\n\n");

  const auditSource = pipelineMaterial || existingDrafts;
  return `${sharedNotes}\n\nPermintaan Boss/Owner:\n${userMessage}\n\nMateri yang harus diaudit:\n${
    auditSource || "(Belum ada file di workspace; lakukan pengecekan berdasarkan permintaan di atas.)"
  }\n\nLakukan audit QA menyeluruh (Akurasi admin flat 4%, Fair Rank, COD, Voucher Gratis Ongkir & Potongan Harga, naturalitas bahasa Indonesia, prompt Google Flow, kepatuhan Meta Ads, dan status draft/PAUSED) lalu keluarkan laporan QA dengan keputusan APPROVED atau REVISI.`;
}

function summarizeOutput(markdown: string): string {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, "").replace(/[*_`]/g, "").trim())
    .filter((line) => line.length > 12);

  return truncateText(lines.slice(0, 2).join(" — ") || "Dokumen draf siap ditinjau.", 150);
}

export async function runOfficeWorkflow(
  userMessage: string,
  target: ChatTarget
): Promise<{ files: string[]; state: OfficeState }> {
  const brandContext = await readRuleText("00-kawanbelanja-context.md");
  const sequence: AgentKey[] =
    target === "auto" ? ["raka", "dina", "sari", "reno", "bima"] : [target];

  let state = await readOfficeState();
  const defaults = createDefaultOfficeState();
  for (const key of ["raka", "dina", "sari", "reno", "bima"] as AgentKey[]) {
    if (!state.agents[key]) {
      state.agents[key] = defaults.agents[key];
    }
  }

  const targetLabel =
    target === "auto"
      ? "Estafet Lengkap (Raka → Dina → Sari → Reno → Bima)"
      : `@${target}`;

  state.lastUpdated = new Date().toISOString();
  state.chatLog.push({
    id: `msg-user-${Date.now()}`,
    sender: "Anda (Owner)",
    role: `Brief → ${targetLabel}`,
    avatarColor: "#8B5CF6",
    message: userMessage,
    timestamp: state.lastUpdated,
    type: "user",
  });
  await writeOfficeState(state);

  const savedFiles: string[] = [];
  const priorOutputs: Partial<Record<AgentKey, { path: string; content: string }>> = {};
  const existingDrafts =
    target === "bima" ? await readLatestWorkspaceDrafts() : "";

  for (let i = 0; i < sequence.length; i++) {
    const agentKey = sequence[i];
    const agent = state.agents[agentKey];
    const startNow = new Date().toISOString();

    state.lastUpdated = startNow;
    state.agents[agentKey].status = "working";
    state.agents[agentKey].task = `Mengerjakan: ${truncateText(userMessage, 68)}`;
    state.chatLog.push({
      id: `msg-${agentKey}-start-${Date.now()}`,
      sender: agent.name,
      role: agent.role,
      avatarColor: agent.avatarColor,
      message: AGENT_START_MSG[agentKey],
      timestamp: startNow,
      type: "update",
    });
    await writeOfficeState(state);

    try {
      const roleRule = await readRuleText(AGENT_RULE_FILE[agentKey]);
      const systemPrompt = [brandContext, roleRule].filter(Boolean).join("\n\n---\n\n");
      const prompt = buildAgentPrompt(
        agentKey,
        userMessage,
        priorOutputs,
        existingDrafts
      );

      const generatedMarkdown = await callGemini(
        systemPrompt,
        prompt,
        async (attempt, maxRetries, delaySeconds) => {
          state.lastUpdated = new Date().toISOString();
          state.agents[agentKey].task =
            `Server padat, coba ulang ${attempt}/${maxRetries} (${delaySeconds} dtk)...`;
          await writeOfficeState(state);
        }
      );
      const savedPath = await saveAgentOutput(agentKey, userMessage, generatedMarkdown);

      savedFiles.push(savedPath);
      priorOutputs[agentKey] = { path: savedPath, content: generatedMarkdown };

      const doneNow = new Date().toISOString();
      state.lastUpdated = doneNow;
      state.agents[agentKey].status = "done";
      state.agents[agentKey].task = `Selesai → ${savedPath}`;
      state.chatLog.push({
        id: `msg-${agentKey}-done-${Date.now()}`,
        sender: agent.name,
        role: agent.role,
        avatarColor: agent.avatarColor,
        message: `Selesai! Output tersimpan di ${savedPath}\nRingkasan: ${summarizeOutput(
          generatedMarkdown
        )}`,
        timestamp: doneNow,
        type: "update",
      });
      await writeOfficeState(state);

      if (i < sequence.length - 1) {
        await sleep(INTER_AGENT_COOLDOWN_MS);
      }
    } catch (error) {
      const errNow = new Date().toISOString();
      const errMsg =
        error instanceof Error ? error.message : "Terjadi kesalahan saat memproses tugas.";

      state.lastUpdated = errNow;
      state.agents[agentKey].status = "idle";
      state.agents[agentKey].task = `Gagal memproses brief (${truncateText(errMsg, 55)})`;
      state.chatLog.push({
        id: `msg-${agentKey}-err-${Date.now()}`,
        sender: "Sistem Kantor",
        role: "Error Monitor",
        avatarColor: "#EF4444",
        message: `${agent.name} gagal menyelesaikan tugas: ${errMsg}`,
        timestamp: errNow,
        type: "system",
      });
      await writeOfficeState(state);
      throw error;
    }
  }

  return { files: savedFiles, state };
}
