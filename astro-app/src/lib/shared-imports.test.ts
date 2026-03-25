import { describe, it, expect } from "vitest";
import type { Method } from "@shared/domain/entities/Method";

describe("Shared code imports", () => {
    it("can use the Method type from shared domain", () => {
        const method: Method = {
            sectionName: "Test",
            shortText: "Short",
            text: "Full text",
        };

        expect(method.sectionName).toBe("Test");
        expect(method.shortText).toBe("Short");
        expect(method.text).toBe("Full text");
    });
});
