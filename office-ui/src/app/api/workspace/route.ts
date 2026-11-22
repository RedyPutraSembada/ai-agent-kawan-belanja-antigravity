import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { listWorkspaceFiles, resolveSafeWorkspaceFile } from "@/lib/workspace-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileParam = searchParams.get("file");

  if (!fileParam) {
    try {
      const files = await listWorkspaceFiles();
      return NextResponse.json({ files }, { headers: NO_CACHE_HEADERS });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Gagal membaca daftar file workspace.";
      return NextResponse.json(
        { error: errMsg },
        { status: 500, headers: NO_CACHE_HEADERS }
      );
    }
  }

  try {
    const resolved = resolveSafeWorkspaceFile(fileParam);
    const content = await fs.readFile(resolved.fullPath, "utf-8");

    return NextResponse.json(
      {
        file: resolved.relativePath,
        fileName: resolved.fileName,
        category: resolved.category,
        content,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const status = err.code === "ENOENT" ? 404 : 400;
    return NextResponse.json(
      { error: err.message || "Gagal membuka file workspace." },
      { status, headers: NO_CACHE_HEADERS }
    );
  }
}
