import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { resolveSafeAssetFile } from "@/lib/workspace-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const download = searchParams.get("download") === "1";

  if (!name) {
    return NextResponse.json(
      { error: "Parameter ?name= wajib diisi." },
      { status: 400 }
    );
  }

  try {
    const resolved = resolveSafeAssetFile(name);
    const data = await fs.readFile(resolved.fullPath);

    const headers: Record<string, string> = {
      "Content-Type": resolved.mimeType,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${resolved.fileName}"`;
    }

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers,
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const status = err.code === "ENOENT" ? 404 : 400;
    return NextResponse.json(
      { error: err.message || "Gagal memuat aset." },
      { status }
    );
  }
}
