import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import type { D2Api } from "@shared/types/d2-api";
import { createLogger } from "@/lib/logger";

const FETCH_TIMEOUT_MS = 10000;
const BASE_OUTPUT_DIR = "public/images";

const log = createLogger("image-downloader");

export function isRemoteImageUrl(url: string): boolean {
    return typeof url === "string" && url.startsWith("http");
}

export interface ImageDownloadOptions {
    /** Width to resize to. Height is inferred if not provided. */
    width: number;
    /** Height to resize to. If omitted, aspect ratio is preserved from width. */
    height?: number;
    /** sharp resize fit mode. Default: "cover" */
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    /** sharp resize position (for "cover" fit). Default: "top" */
    position?: string;
    /** WebP quality (0-100). Default: 80 */
    quality?: number;
    /** Subdirectory under public/images/. e.g. "about/people" */
    outputSubdir: string;
}

function urlHash(url: string): string {
    return createHash("md5").update(url).digest("hex").substring(0, 12);
}

function normalizeUrl(url: string): string {
    // Fix double slashes in path (baseUrl trailing slash + /api/)
    return url.replace(/(https?:\/\/)|(\/)+/g, (_match, proto) => proto || "/");
}

function getAuthHeaders(): Record<string, string> {
    const raw = import.meta.env.DHIS2_AUTH;
    if (!raw) return {};
    const auth = raw.replace(/^['"]|['"]$/g, "");
    return { Authorization: `Basic ${Buffer.from(auth).toString("base64")}` };
}

async function fetchImageBuffer(_api: D2Api, remoteUrl: string): Promise<Buffer | null> {
    const normalizedUrl = normalizeUrl(remoteUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(normalizedUrl, {
            signal: controller.signal,
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            log.warn({ url: remoteUrl, status: response.status }, "Remote image prefetch failed");
            return null;
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length === 0) {
            log.warn({ url: remoteUrl, reason: "empty body" }, "Remote image prefetch failed");
            return null;
        }
        return buffer;
    } catch (err) {
        const isTimeout =
            controller.signal.aborted ||
            (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError"));
        if (isTimeout) {
            log.warn({ url: remoteUrl, reason: "timeout" }, "Remote image prefetch failed");
        } else {
            const message = err instanceof Error ? err.message : String(err);
            log.warn({ url: remoteUrl, error: message }, "Remote image prefetch failed");
        }
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * Downloads a single image, optimizes it with sharp, and writes to disk.
 * Returns the public path on success, null on failure.
 */
export async function downloadAndOptimizeImage(
    api: D2Api,
    remoteUrl: string,
    options: ImageDownloadOptions
): Promise<string | null> {
    if (!remoteUrl || typeof remoteUrl !== "string") return null;

    const normalized = normalizeUrl(remoteUrl);
    const outputDir = path.join(BASE_OUTPUT_DIR, options.outputSubdir);
    const hash = urlHash(normalized);
    const outputFile = path.join(outputDir, `${hash}.webp`);
    const publicPath = `/images/${options.outputSubdir}/${hash}.webp`;

    // Cache: skip if already downloaded
    if (fs.existsSync(outputFile)) return publicPath;

    try {
        const buffer = await fetchImageBuffer(api, remoteUrl);
        if (!buffer || buffer.length === 0) return null;

        fs.mkdirSync(outputDir, { recursive: true });

        const resizeOptions: sharp.ResizeOptions = {
            width: options.width,
            fit: options.fit ?? "cover",
            position: options.position ?? "top",
        };
        if (options.height) resizeOptions.height = options.height;

        await sharp(buffer)
            .resize(resizeOptions)
            .webp({ quality: options.quality ?? 80 })
            .toFile(outputFile);

        return publicPath;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log.warn({ url: remoteUrl, error: message }, "Remote image optimization failed");
        return null;
    }
}

export type ImageMap = Map<string, string>;

/**
 * Downloads and optimizes multiple images in parallel.
 * Returns a map from original remote URL → local optimized path.
 * Failed downloads are omitted — callers should fall back to a placeholder.
 */
export async function downloadImages(
    api: D2Api,
    urls: ReadonlyArray<string>,
    options: ImageDownloadOptions
): Promise<ImageMap> {
    const uniqueUrls = [...new Set(urls.filter((u): u is string => typeof u === "string" && u.length > 0))];

    const results = await Promise.allSettled(
        uniqueUrls.map(async url => ({
            remote: url,
            local: await downloadAndOptimizeImage(api, url, options),
        }))
    );

    return new Map(
        results
            .filter(
                (r): r is PromiseFulfilledResult<{ remote: string; local: string | null }> =>
                    r.status === "fulfilled" && r.value.local !== null
            )
            .map(r => [r.value.remote, r.value.local!])
    );
}
