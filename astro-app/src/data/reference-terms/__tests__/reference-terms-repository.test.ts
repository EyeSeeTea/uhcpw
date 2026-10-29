import { describe, expect, it, vi } from "vitest";
import { ReferenceTermsD2Repository } from "@shared/data/repositories/reference-terms/ReferenceTermsD2Repository";
import type { D2Api } from "@shared/types/d2-api";

const options = [
    { code: "NEW", displayName: "New category", sortOrder: 2 },
    { code: "GENERAL", displayName: "General", sortOrder: 0 },
];

function repository(events: unknown[], objects: unknown[] = [{ options }]) {
    const get = vi.fn(() => ({ getData: () => Promise.resolve({ events }), cancel: () => {} }));
    const getOptions = vi.fn(() => ({ getData: () => Promise.resolve({ objects }), cancel: () => {} }));
    return { repository: new ReferenceTermsD2Repository({ events: { get }, models: { optionSets: { get: getOptions } } } as unknown as D2Api), get, getOptions };
}

function event(values: Record<string, string>) {
    return {
        event: "event1",
        dataValues: Object.entries(values).map(([dataElement, value]) => ({ dataElement, value })),
    };
}

describe("reference terms repository", () => {
    it("fetches and validates glossary entries without paging", async () => {
        const { repository: repo, get } = repository([event({ dD9mP2sW6yA: " Term ", dE3qT5vX8zB: "Definition" })]);
        await expect(repo.getGlossary().toPromise()).resolves.toEqual([{ term: "Term", definition: "Definition" }]);
        expect(get).toHaveBeenCalledWith(expect.objectContaining({ program: "pC7kN2qV5yG", skipPaging: true }));
    });

    it("accepts abbreviation category codes and rejects invalid entries", async () => {
        const valid = repository([
            event({ dB4fH8kN1pS: "WHO", dC7jL3nR5tV: "World Health Organization", dA6cE2gJ9mQ: "NEW" }),
        ]);
        await expect(valid.repository.getAbbreviations().toPromise()).resolves.toEqual({
            categories: [{ code: "GENERAL", name: "General" }, { code: "NEW", name: "New category" }],
            entries: [{ abbreviation: "WHO", meaning: "World Health Organization", category: "NEW" }],
        });
        expect(valid.getOptions).toHaveBeenCalledWith(expect.objectContaining({ filter: { id: { eq: "pB7mQ3xL8dR" } } }));
        expect(valid.get).toHaveBeenCalledWith(expect.objectContaining({ program: "pA5gJ8mR3vD", skipPaging: true }));
        const invalid = repository([event({ dB4fH8kN1pS: "WHO", dC7jL3nR5tV: "Meaning", dA6cE2gJ9mQ: "OTHER" })]);
        await expect(invalid.repository.getAbbreviations().toPromise()).rejects.toBe(
            "Invalid abbreviation event event1"
        );
        const missing = repository([event({ dD9mP2sW6yA: "Term", dE3qT5vX8zB: "  " })]);
        await expect(missing.repository.getGlossary().toPromise()).rejects.toBe("Invalid glossary event event1");
    });

    it("rejects missing and malformed category metadata", async () => {
        await expect(repository([], []).repository.getAbbreviations().toPromise()).rejects.toBe("Abbreviation category option set not found or invalid");
        await expect(repository([], [{ options: [{ code: "NEW", displayName: "New" }] }]).repository.getAbbreviations().toPromise()).rejects.toBe("Invalid abbreviation category option");
    });

    it("allows an empty program", async () => {
        await expect(repository([]).repository.getGlossary().toPromise()).resolves.toEqual([]);
    });
});
