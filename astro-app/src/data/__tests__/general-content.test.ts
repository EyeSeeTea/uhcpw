import { describe, it, expect } from "vitest";
import type { GeneralContent } from "@shared/domain/entities/GeneralContent";
import { resolveGeneralContentUrls } from "@/data/general-content";

type UrlsInput = Pick<GeneralContent, "abbreviations" | "glossary">;

function makeGeneralContent(overrides: Partial<UrlsInput> = {}): UrlsInput {
    return {
        abbreviations: { url: "https://example.org/abbreviations" },
        glossary: { url: "https://example.org/glossary" },
        ...overrides,
    };
}

describe("resolveGeneralContentUrls", () => {
    it("returns the provided URLs when generalContent has both set", () => {
        const urls = resolveGeneralContentUrls(makeGeneralContent());
        expect(urls.abbreviationsUrl).toBe("https://example.org/abbreviations");
        expect(urls.glossaryUrl).toBe("https://example.org/glossary");
    });

    it("falls back to the hardcoded URLs when generalContent is undefined", () => {
        const urls = resolveGeneralContentUrls(undefined);
        expect(urls.abbreviationsUrl).toBe("https://cmyn.short.gy/abbreviations");
        expect(urls.glossaryUrl).toBe("https://cmyn.short.gy/glossary");
    });

    it("falls back when individual URLs are undefined (Maybe<string>)", () => {
        const urls = resolveGeneralContentUrls(
            makeGeneralContent({
                abbreviations: { url: undefined },
                glossary: { url: undefined },
            })
        );
        expect(urls.abbreviationsUrl).toBe("https://cmyn.short.gy/abbreviations");
        expect(urls.glossaryUrl).toBe("https://cmyn.short.gy/glossary");
    });
});
