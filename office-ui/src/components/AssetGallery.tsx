"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Download,
  Film,
  Image as ImageIcon,
  Maximize2,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import type { AssetFileItem } from "@/lib/office";

interface AssetGalleryProps {
  refreshTrigger?: string;
}

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
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function AssetGallery({ refreshTrigger }: AssetGalleryProps) {
  const [assets, setAssets] = useState<AssetFileItem[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [loading, setLoading] = useState(true);
  const [zoomAsset, setZoomAsset] = useState<AssetFileItem | null>(null);

  const loadAssets = useCallback(async () => {
    try {
      const res = await fetch("/api/assets", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { assets?: AssetFileItem[] };
      if (Array.isArray(data.assets)) {
        setAssets(data.assets);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets, refreshTrigger]);

  const visibleAssets =
    filter === "all" ? assets : assets.filter((a) => a.mediaType === filter);

  return (
    <section className="mt-6 rounded-3xl border border-slate-800/90 bg-slate-900/80 p-5 shadow-2xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/15 text-violet-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Galeri Aset Terbaru (workspace/assets/)
            </h2>
            <p className="text-xs text-slate-400">
              Pratinjau poster PNG &amp; video Reels MP4 hasil render{" "}
              <span className="font-semibold text-violet-300">Reno (Remotion Studio)</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadAssets()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh ({assets.length})</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: "all", label: "Semua" },
            { id: "image", label: "Poster / Gambar" },
            { id: "video", label: "Video MP4" },
          ] as const
        ).map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                active
                  ? "border-violet-400 bg-violet-500/25 text-violet-100"
                  : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="h-32 animate-pulse rounded-xl border border-slate-800 bg-slate-950/60" />
      ) : visibleAssets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-8 text-center text-xs text-slate-400">
          Belum ada aset ter-render di <code className="font-mono">workspace/assets/</code>.
          Panggil <strong>Reno</strong> untuk merender poster atau video dari{" "}
          <code className="font-mono">media-studio/</code>.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAssets.map((item) => {
            const viewUrl = `/api/assets/file?name=${encodeURIComponent(
              item.fileName
            )}&v=${encodeURIComponent(item.updatedAt)}`;
            const downloadUrl = `/api/assets/file?name=${encodeURIComponent(
              item.fileName
            )}&download=1`;

            return (
              <div
                key={item.fileName}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 transition hover:border-slate-700"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                  {item.mediaType === "video" ? (
                    <video
                      src={viewUrl}
                      controls
                      muted
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={viewUrl}
                      alt={item.fileName}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setZoomAsset(item)}
                    className="absolute right-2.5 top-2.5 rounded-lg border border-slate-700/80 bg-slate-950/80 p-1.5 text-slate-200 backdrop-blur hover:bg-slate-800"
                    title="Perbesar pratinjau"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {item.mediaType === "video" ? (
                        <Film className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                      )}
                      <p className="truncate font-mono text-xs font-semibold text-white">
                        {item.fileName}
                      </p>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">
                      {formatWibDateTime(item.updatedAt)} WIB · {formatBytes(item.sizeBytes)}
                    </p>
                  </div>

                  <a
                    href={downloadUrl}
                    download={item.fileName}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/15 px-3 py-1.5 text-xs font-semibold text-violet-200 transition hover:bg-violet-500/30"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Aset</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {zoomAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={() => setZoomAsset(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="truncate font-mono text-xs font-bold text-white">
                {zoomAsset.relativePath}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`/api/assets/file?name=${encodeURIComponent(
                    zoomAsset.fileName
                  )}&download=1`}
                  download={zoomAsset.fileName}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setZoomAsset(null)}
                  className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Tutup lightbox"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-950 p-4">
              {zoomAsset.mediaType === "video" ? (
                <video
                  src={`/api/assets/file?name=${encodeURIComponent(
                    zoomAsset.fileName
                  )}`}
                  controls
                  autoPlay
                  className="max-h-[72vh] w-auto rounded-xl"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/assets/file?name=${encodeURIComponent(
                    zoomAsset.fileName
                  )}`}
                  alt={zoomAsset.fileName}
                  className="max-h-[72vh] w-auto rounded-xl object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
