import { describe, expect, it, vi } from "vitest";
import { Future } from "@shared/domain/entities/Future";

const { getGlossary, getAbbreviations } = vi.hoisted(() => ({ getGlossary: vi.fn(), getAbbreviations: vi.fn() }));
vi.mock("@/infra/composition-root.server", () => ({
    getServerCompositionRoot: () => ({ referenceTerms: { getGlossary: { execute: getGlossary }, getAbbreviations: { execute: getAbbreviations } } }),
}));

import { getAbbreviationsPageData, getGlossaryPageData } from "../reference-terms-data";

describe("reference terms page data", () => {
    it("fetches data through the use cases", async () => {
        const glossary = [{ term: "Term", definition: "Definition" }];
        const abbreviations = { categories: [{ code: "GENERAL", name: "General" }], entries: [{ abbreviation: "WHO", meaning: "World Health Organization", category: "GENERAL" }] };
        getGlossary.mockReturnValue(Future.success(glossary));
        getAbbreviations.mockReturnValue(Future.success(abbreviations));
        await expect(getGlossaryPageData()).resolves.toEqual(glossary);
        await expect(getAbbreviationsPageData()).resolves.toEqual(abbreviations);
        expect(getGlossary).toHaveBeenCalledOnce();
        expect(getAbbreviations).toHaveBeenCalledOnce();
    });

    it("propagates fetch failures", async () => {
        getGlossary.mockReturnValue(Future.error("DHIS2 unavailable"));
        await expect(getGlossaryPageData()).rejects.toBe("DHIS2 unavailable");
    });
});
