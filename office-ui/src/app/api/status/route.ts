import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { createDefaultOfficeState, type OfficeState } from "@/lib/office";
import { getOfficeStatePath } from "@/lib/office-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  const filePath = getOfficeStatePath();

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as OfficeState;
    return NextResponse.json(parsed, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      const fallback = createDefaultOfficeState(
        "File office-state.json belum ditemukan, menampilkan status bawaan kantor."
      );
      return NextResponse.json(fallback, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(
      {
        error: "Gagal membaca ../office-state.json",
        details: err.message,
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST() {
  const filePath = getOfficeStatePath();
  const resetState = createDefaultOfficeState();

  try {
    await fs.writeFile(filePath, `${JSON.stringify(resetState, null, 2)}\n`, "utf-8");
    return NextResponse.json(resetState, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      {
        error: "Gagal mereset ../office-state.json",
        details: err.message,
      },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
