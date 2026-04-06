import type { D2Api } from "@shared/types/d2-api";
import type { PersonState } from "./about-data";
import type { OfficeInfo } from "@shared/domain/entities/about/OfficeInfo";
import { downloadImages, ImageDownloadOptions, type ImageMap } from "@/lib/image-downloader";
import { AVATAR_FALLBACK } from "./about-data";

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
 * Returns the local path, or the original URL if download fails.
 */
export async function downloadOfficeImage(api: D2Api, officeInfo: OfficeInfo): Promise<string> {
    if (!isRemoteImageUrl(officeInfo.officeImage)) return officeInfo.officeImage;

    const imageMap = await downloadImages(api, [officeInfo.officeImage], OFFICE_IMAGE_OPTIONS);
    return imageMap.get(officeInfo.officeImage) ?? officeInfo.officeImage;
}
