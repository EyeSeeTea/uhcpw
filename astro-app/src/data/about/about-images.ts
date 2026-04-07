import path from "node:path";
import sharp from "sharp";
import type { D2Api } from "@shared/types/d2-api";
import type { PersonState } from "./about-data";
import type { OfficeInfo } from "@shared/domain/entities/about/OfficeInfo";
import { downloadImages, ImageDownloadOptions, type ImageMap } from "@/lib/image-downloader";
import { AVATAR_FALLBACK } from "./about-data";

export interface OfficeImageResult {
    src: string;
    width: number;
    height: number;
}

const OFFICE_IMAGE_FALLBACK_HEIGHT = Math.round(770 * (2 / 3));

const PERSON_IMAGE_OPTIONS = {
    width: 400, // 2x of 200px display size for retina
    height: 400,
    fit: "cover" as const,
    position: "top",
    outputSubdir: "about/people",
} satisfies ImageDownloadOptions;

const OFFICE_IMAGE_OPTIONS = {
    width: 770,
    fit: "inside" as const,
    outputSubdir: "about/content",
} satisfies ImageDownloadOptions;

function isRemoteImageUrl(url: string): boolean {
    return typeof url === "string" && url.startsWith("http");
}

/**
 * Downloads and optimizes all person images (team + experts) at build time.
 * Returns persons with image URLs remapped to local optimized paths.
 * Missing/failed images fall back to the SVG avatar placeholder.
 */
export async function downloadAboutPersonImages(
    api: D2Api,
    persons: ReadonlyArray<PersonState>
): Promise<{ persons: ReadonlyArray<PersonState>; imageMap: ImageMap }> {
    const remoteUrls = persons.map(p => p.image).filter(isRemoteImageUrl);
    const imageMap = await downloadImages(api, remoteUrls, PERSON_IMAGE_OPTIONS);

    const remappedPersons = persons.map(person => ({
        ...person,
        image: imageMap.get(person.image) ?? AVATAR_FALLBACK,
    }));

    return { persons: remappedPersons, imageMap };
}

/**
 * Downloads and optimizes the office header image at build time.
 * Returns the local path plus its intrinsic dimensions so the about page can
 * declare width/height on the <img> and avoid CLS. Falls back to the original
 * URL with a default aspect ratio if the download fails.
 */
export async function downloadOfficeImage(
    api: D2Api,
    officeInfo: OfficeInfo
): Promise<OfficeImageResult> {
    const fallback = (src: string): OfficeImageResult => ({
        src,
        width: OFFICE_IMAGE_OPTIONS.width,
        height: OFFICE_IMAGE_FALLBACK_HEIGHT,
    });

    if (!isRemoteImageUrl(officeInfo.officeImage)) return fallback(officeInfo.officeImage);

    const imageMap = await downloadImages(api, [officeInfo.officeImage], OFFICE_IMAGE_OPTIONS);
    const localSrc = imageMap.get(officeInfo.officeImage);
    if (!localSrc) return fallback(officeInfo.officeImage);

    try {
        const filePath = path.join("public", localSrc);
        const metadata = await sharp(filePath).metadata();
        if (metadata.width && metadata.height) {
            return { src: localSrc, width: metadata.width, height: metadata.height };
        }
    } catch {
        // fall through to fallback
    }
    return fallback(localSrc);
}
