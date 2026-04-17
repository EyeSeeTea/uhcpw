import { describe, it, expect, vi, beforeEach } from "vitest";
import type { D2Api } from "@shared/types/d2-api";
import type { HomeResourceState } from "../home-resource";

const downloadImagesMock = vi.fn();

vi.mock("@/lib/image-downloader", async () => {
    const actual = await vi.importActual<typeof import("@/lib/image-downloader")>(
        "@/lib/image-downloader",
    );
    return {
        ...actual,
        downloadImages: (...args: unknown[]) => downloadImagesMock(...args),
    };
});

const { downloadHomeResourceImages } = await import("../home-images");

function makeResource(overrides: Partial<HomeResourceState> = {}): HomeResourceState {
    return {
        id: "r1",
        title: "Sample",
        imageOriginal: "http://example.com/a.png",
        date: new Date("2025-01-01"),
        kind: "news",
        url: "http://example.com/a",
        favouriteHomeOrder: 0,
        tagLabel: "News",
        ...overrides,
    };
}

describe("downloadHomeResourceImages", () => {
    const api = {} as D2Api;

    beforeEach(() => {
        downloadImagesMock.mockReset();
    });

    it("remaps remote image URLs to optimized local paths", async () => {
        const resources = [makeResource({ imageOriginal: "http://example.com/a.png" })];
        downloadImagesMock.mockResolvedValueOnce(
            new Map([["http://example.com/a.png", "/images/home/resources/a.avif"]]),
        );

        const { resources: result } = await downloadHomeResourceImages(api, resources);

        expect(result[0]?.imageOriginal).toBe("/images/home/resources/a.avif");
    });

    it("clears the image URL when the optimizer returns no mapping so the UI renders a placeholder", async () => {
        const resources = [makeResource({ imageOriginal: "http://example.com/b.png" })];
        downloadImagesMock.mockResolvedValueOnce(new Map());

        const { resources: result } = await downloadHomeResourceImages(api, resources);

        expect(result[0]?.imageOriginal).toBe("");
    });

    it("only sends remote URLs to downloadImages (skips empty/local paths)", async () => {
        const resources = [
            makeResource({ id: "r1", imageOriginal: "http://example.com/a.png" }),
            makeResource({ id: "r2", imageOriginal: "" }),
            makeResource({ id: "r3", imageOriginal: "/local/path.png" }),
        ];
        downloadImagesMock.mockResolvedValueOnce(new Map());

        await downloadHomeResourceImages(api, resources);

        expect(downloadImagesMock).toHaveBeenCalledTimes(1);
        const [, urls] = downloadImagesMock.mock.calls[0] ?? [];
        expect(urls).toEqual(["http://example.com/a.png"]);
    });
});
