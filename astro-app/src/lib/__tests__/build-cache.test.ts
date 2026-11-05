import { describe, expect, it, vi } from "vitest";
import { buildCache } from "../build-cache";

describe("buildCache", () => {
    it("shares in-flight work and its result", async () => {
        const load = vi.fn(async () => 42);
        const get = buildCache(load, true);
        const first = get();
        expect(get()).toBe(first);
        expect(await first).toBe(42);
        expect(await get()).toBe(42);
        expect(load).toHaveBeenCalledTimes(1);
    });

    it("retries rejected work", async () => {
        const load = vi.fn().mockRejectedValueOnce(new Error("unavailable")).mockResolvedValueOnce(42);
        const get = buildCache(load, true);
        await expect(get()).rejects.toThrow("unavailable");
        await expect(get()).resolves.toBe(42);
        expect(load).toHaveBeenCalledTimes(2);
    });

    it("fetches each time when caching is disabled", async () => {
        const load = vi.fn(async () => 42);
        const get = buildCache(load, false);
        await get();
        await get();
        expect(load).toHaveBeenCalledTimes(2);
    });
});
