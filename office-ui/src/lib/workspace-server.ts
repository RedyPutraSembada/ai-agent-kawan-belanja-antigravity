import { promises as fs } from "fs";
import path from "path";
import type { AssetFileItem, WorkspaceCategory, WorkspaceFileItem } from "./office";
import { getWorkspaceRoot } from "./office-server";

const CATEGORIES: WorkspaceCategory[] = ["trends", "content", "ads", "qa"];
const SAFE_RELATIVE_PATTERN = /^workspace\/(trends|content|ads|qa)\/[^/\\]+\.md$/;
const SAFE_ASSET_NAME_PATTERN = /^[^/\\]+\.(png|jpe?g|webp|mp4|webm)$/i;

const ASSET_MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function listWorkspaceAssets(): Promise<AssetFileItem[]> {
  const root = getWorkspaceRoot();
  const assetsDir = path.join(root, "workspace", "assets");
  const items: AssetFileItem[] = [];

  try {
    const entries = await fs.readdir(assetsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !SAFE_ASSET_NAME_PATTERN.test(entry.name)) {
        continue;
      }
      const fullPath = path.join(assetsDir, entry.name);
      const stat = await fs.stat(fullPath);
      const ext = path.extname(entry.name).toLowerCase();
      items.push({
        fileName: entry.name,
        relativePath: `workspace/assets/${entry.name}`,
        mediaType: ext === ".mp4" || ext === ".webm" ? "video" : "image",
        sizeBytes: stat.size,
        updatedAt: stat.mtime.toISOString(),
      });
    }
  } catch {
    // Skip if workspace/assets does not exist yet
  }

  items.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  return items;
}

export function resolveSafeAssetFile(fileName: string): {
  fullPath: string;
  fileName: string;
  mimeType: string;
} {
  const cleanName = path.basename(fileName.trim());
  if (!SAFE_ASSET_NAME_PATTERN.test(cleanName)) {
    throw new Error("Nama file aset tidak valid.");
  }

  const root = getWorkspaceRoot();
  const assetsBase = path.resolve(root, "workspace", "assets");
  const fullPath = path.resolve(assetsBase, cleanName);

  if (!fullPath.startsWith(assetsBase + path.sep)) {
    throw new Error("Akses di luar folder workspace/assets ditolak.");
  }

  const ext = path.extname(cleanName).toLowerCase();
  return {
    fullPath,
    fileName: cleanName,
    mimeType: ASSET_MIME_TYPES[ext] || "application/octet-stream",
  };
}

export async function listWorkspaceFiles(): Promise<WorkspaceFileItem[]> {
  const root = getWorkspaceRoot();
  const items: WorkspaceFileItem[] = [];

  for (const category of CATEGORIES) {
    const dirPath = path.join(root, "workspace", category);
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) {
          continue;
        }
        const fullPath = path.join(dirPath, entry.name);
        const stat = await fs.stat(fullPath);
        items.push({
          category,
          fileName: entry.name,
          relativePath: `workspace/${category}/${entry.name}`,
          sizeBytes: stat.size,
          updatedAt: stat.mtime.toISOString(),
        });
      }
    } catch {
      // Skip missing subfolder
    }
  }

  items.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  return items;
}

export function resolveSafeWorkspaceFile(relativePath: string): {
  fullPath: string;
  fileName: string;
  category: WorkspaceCategory;
  relativePath: string;
} {
  const normalized = relativePath.replace(/\\/g, "/").trim();
  const match = SAFE_RELATIVE_PATTERN.exec(normalized);
  if (!match) {
    throw new Error("Path file workspace tidak valid atau bukan file .md.");
  }

  const category = match[1] as WorkspaceCategory;
  const root = getWorkspaceRoot();
  const workspaceBase = path.resolve(root, "workspace");
  const fullPath = path.resolve(root, normalized);

  if (!fullPath.startsWith(workspaceBase + path.sep)) {
    throw new Error("Akses di luar folder workspace ditolak.");
  }

  return {
    fullPath,
    fileName: path.basename(fullPath),
    category,
    relativePath: normalized,
  };
}
