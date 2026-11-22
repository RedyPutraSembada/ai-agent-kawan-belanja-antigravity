"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Eye,
  FileDown,
  FileText,
  FolderOpen,
  RefreshCw,
  X,
} from "lucide-react";
import type { WorkspaceCategory, WorkspaceFileItem } from "@/lib/office";

interface WorkspaceViewerProps {
  refreshTrigger?: string;
}

const CATEGORY_META: Record<
  WorkspaceCategory,
  { label: string; badgeClass: string }
> = {
  trends: {
    label: "Riset (Raka)",
    badgeClass: "border-blue-500/40 bg-blue-500/15 text-blue-300",
  },
  content: {
    label: "Konten 7 Hari (Dina)",
    badgeClass: "border-pink-500/40 bg-pink-500/15 text-pink-300",
  },
  ads: {
    label: "Meta Ads (Sari)",
    badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  },
  qa: {
    label: "Audit QA (Bima)",
    badgeClass: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  },
};

const FILTER_TABS: Array<{ id: "all" | WorkspaceCategory; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "trends", label: "Riset (Raka)" },
  { id: "content", label: "Konten (Dina)" },
  { id: "ads", label: "Meta Ads (Sari)" },
  { id: "qa", label: "QA (Bima)" },
];

function formatWibDateTime(isoString: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(new Date(isoString));
  } catch {
    return "-";
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function WorkspaceViewer({ refreshTrigger }: WorkspaceViewerProps) {
  const [files, setFiles] = useState<WorkspaceFileItem[]>([]);
  const [filter, setFilter] = useState<"all" | WorkspaceCategory>("all");
  const [loading, setLoading] = useState(true);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{
    item: WorkspaceFileItem;
    content: string;
  } | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { files?: WorkspaceFileItem[] };
      if (Array.isArray(data.files)) {
        setFiles(data.files);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles, refreshTrigger]);

  const handleCopy = async (item: WorkspaceFileItem, existingContent?: string) => {
    try {
      let text = existingContent;
      if (!text) {
        const res = await fetch(
          `/api/workspace?file=${encodeURIComponent(item.relativePath)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { content?: string };
        text = data.content ?? "";
      }
      await navigator.clipboard.writeText(text);
      setCopiedPath(item.relativePath);
      setTimeout(() => {
        setCopiedPath((prev) => (prev === item.relativePath ? null : prev));
      }, 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handlePreview = async (item: WorkspaceFileItem) => {
    setLoadingPreview(true);
    try {
      const res = await fetch(
        `/api/workspace?file=${encodeURIComponent(item.relativePath)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = (await res.json()) as { content?: string };
      setPreviewFile({ item, content: data.content ?? "" });
    } finally {
      setLoadingPreview(false);
    }
  };

  const visibleFiles =
    filter === "all" ? files : files.filter((f) => f.category === filter);

  return (
    <section className="mt-6 rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5 shadow-2xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
            <FolderOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Hasil Output Workspace &amp; Export Word (.docx)
            </h2>
            <p className="text-xs text-slate-400">
              Preview draf, salin teks, atau download format{" "}
              <span className="font-mono text-indigo-300">.docx</span> siap buka di Word &amp; Google Docs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadFiles()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh ({files.length})</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                active
                  ? "border-indigo-400 bg-indigo-500/25 text-indigo-100"
                  : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* File List */}
      {loading ? (
        <div className="h-24 animate-pulse rounded-xl border border-slate-800 bg-slate-950/60" />
      ) : visibleFiles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-8 text-center text-xs text-slate-400">
          Belum ada file output di kategori ini. Jalankan salah satu divisi terlebih dahulu.
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibleFiles.map((item) => {
            const meta = CATEGORY_META[item.category];
            const isCopied = copiedPath === item.relativePath;
            const docxUrl = `/api/workspace/docx?file=${encodeURIComponent(
              item.relativePath
            )}`;

            return (
              <div
                key={item.relativePath}
                className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/75 p-3.5 transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {formatWibDateTime(item.updatedAt)} WIB · {formatBytes(item.sizeBytes)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <p className="truncate font-mono text-xs font-semibold text-slate-100">
                      {item.relativePath}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={loadingPreview}
                    onClick={() => void handlePreview(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleCopy(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href={docxUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/20 px-2.5 py-1.5 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-600/35"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>Download .docx</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/80 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-bold text-white">
                  {previewFile.item.relativePath}
                </p>
                <p className="text-[11px] text-slate-400">
                  {CATEGORY_META[previewFile.item.category].label} ·{" "}
                  {formatWibDateTime(previewFile.item.updatedAt)} WIB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void handleCopy(previewFile.item, previewFile.content)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  {copiedPath === previewFile.item.relativePath ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={`/api/workspace/docx?file=${encodeURIComponent(
                    previewFile.item.relativePath
                  )}`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>Download .docx</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Tutup preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="chat-scrollbar flex-1 overflow-y-auto p-5">
              <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-slate-200">
                {previewFile.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
