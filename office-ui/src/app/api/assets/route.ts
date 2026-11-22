import { NextResponse } from "next/server";
import { listWorkspaceAssets } from "@/lib/workspace-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const assets = await listWorkspaceAssets();
    return NextResponse.json({ assets }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Gagal membaca galeri aset.";
    return NextResponse.json(
      { error: errMsg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
