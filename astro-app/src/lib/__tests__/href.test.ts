import { afterEach, describe, expect, it, vi } from "vitest";
import { href } from "../href";

describe("internal reference links", () => {
    afterEach(() => vi.unstubAllEnvs());

    it.each(["/", "/preview/pr-123/"])("uses the configured base %s", base => {
        vi.stubEnv("BASE_URL", base);
        expect(href("/abbreviations")).toBe(`${base}abbreviations`);
        expect(href("/glossary")).toBe(`${base}glossary`);
    });
});
