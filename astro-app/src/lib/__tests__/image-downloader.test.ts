import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { D2Api } from "@shared/types/d2-api";

const warnMock = vi.fn();

vi.mock("@/lib/logger", () => ({
    createLogger: () => ({
        warn: warnMock,
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    }),
    logger: { warn: warnMock, info: vi.fn(), error: vi.fn(), debug: vi.fn() },
    startTimer: () => () => {},
}));

const { downloadAndOptimizeImage } = await import("../image-downloader");

const api = {} as D2Api;
const options = { width: 100, outputSubdir: "__test__" };

describe("image-downloader warn logging", () => {
    beforeEach(() => {
        warnMock.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("warns once with url + status when the remote returns non-2xx", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("nope", { status: 500 })),
        );

        const result = await downloadAndOptimizeImage(api, "http://example.test/fail.png", options);

        expect(result).toBeNull();
        expect(warnMock).toHaveBeenCalledTimes(1);
        const [payload] = warnMock.mock.calls[0] ?? [];
        expect(payload).toMatchObject({ url: "http://example.test/fail.png", status: 500 });
    });

    it("warns with the error message when fetch throws", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => {
                throw new Error("DNS boom");
            }),
        );

        const result = await downloadAndOptimizeImage(api, "http://example.test/throw.png", options);

        expect(result).toBeNull();
        expect(warnMock).toHaveBeenCalledTimes(1);
        const [payload] = warnMock.mock.calls[0] ?? [];
        expect(payload).toMatchObject({ url: "http://example.test/throw.png", error: "DNS boom" });
    });
});
