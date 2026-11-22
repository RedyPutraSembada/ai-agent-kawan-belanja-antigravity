import { NextResponse } from "next/server";
import type { ChatTarget } from "@/lib/office";
import { runOfficeWorkflow } from "@/lib/office-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 300;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const VALID_TARGETS = new Set<ChatTarget>(["auto", "raka", "dina", "sari", "reno", "bima"]);

export async function GET() {
  const configured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

  return NextResponse.json(
    { configured, model },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      message?: unknown;
      target?: unknown;
    } | null;

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const targetRaw =
      typeof body?.target === "string" ? body.target.trim().toLowerCase() : "auto";

    if (!message) {
      return NextResponse.json(
        { error: "Pesan/brief tidak boleh kosong." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (!VALID_TARGETS.has(targetRaw as ChatTarget)) {
      return NextResponse.json(
        { error: "Target divisi tidak valid. Pilih auto, raka, dina, sari, atau bima." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (!process.env.GEMINI_API_KEY?.trim()) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY belum diatur. Buka file office-ui/.env.local, isi GEMINI_API_KEY kamu, lalu restart server (npm.cmd run dev).",
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const result = await runOfficeWorkflow(message, targetRaw as ChatTarget);

    return NextResponse.json(
      {
        ok: true,
        files: result.files,
        state: result.state,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Gagal menjalankan agen kantor.";
    return NextResponse.json(
      { error: errMsg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
