import type { D2Api } from "@shared/types/d2-api";
import type { HomeResourceState } from "./home-data";
import {
    downloadImages,
    isRemoteImageUrl,
    type ImageDownloadOptions,
    type ImageMap,
} from "@/lib/image-downloader";

const RESOURCE_IMAGE_OPTIONS = {
    width: 800,
    fit: "inside" as const,
    outputSubdir: "home/resources",
} satisfies ImageDownloadOptions;

export async function downloadHomeResourceImages(
    api: D2Api,
    resources: ReadonlyArray<HomeResourceState>,
): Promise<{ resources: ReadonlyArray<HomeResourceState>; imageMap: ImageMap }> {
    const remoteUrls = resources.map(r => r.imageOriginal).filter(isRemoteImageUrl);
    const imageMap = await downloadImages(api, remoteUrls, RESOURCE_IMAGE_OPTIONS);

    const remapped = resources.map(resource => ({
        ...resource,
        imageOriginal: imageMap.get(resource.imageOriginal) ?? resource.imageOriginal,
    }));

    return { resources: remapped, imageMap };
}
