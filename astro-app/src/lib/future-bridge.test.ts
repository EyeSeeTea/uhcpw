import { describe, it, expect } from "vitest";
import { Future } from "@shared/domain/entities/Future";
import { runFuture } from "./future-bridge";

describe("runFuture", () => {
    it("resolves with data on success", async () => {
        const future = Future.success<string, string>("hello");
        const result = await runFuture(future);
        expect(result).toBe("hello");
    });

    it("rejects with error on failure", async () => {
        const future = Future.error<string, string>("something went wrong");
        await expect(runFuture(future)).rejects.toBe("something went wrong");
    });
});
