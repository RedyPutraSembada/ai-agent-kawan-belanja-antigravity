import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { markdownToDocxBuffer } from "@/lib/markdown-to-docx";
import { resolveSafeWorkspaceFile } from "@/lib/workspace-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileParam = searchParams.get("file");

  if (!fileParam) {
    return NextResponse.json(
      { error: "Parameter ?file= wajib diisi." },
      { status: 400 }
    );
  }

  try {
    const resolved = resolveSafeWorkspaceFile(fileParam);
    const markdown = await fs.readFile(resolved.fullPath, "utf-8");
    const docBaseName = resolved.fileName.replace(/\.md$/i, "");
    const buffer = await markdownToDocxBuffer(markdown, docBaseName);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${docBaseName}.docx"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    const status = err.code === "ENOENT" ? 404 : 400;
    return NextResponse.json(
      { error: err.message || "Gagal mengonversi file ke .docx." },
      { status }
    );
  }
}
