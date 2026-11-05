import { describe, expect, it } from "vitest";
import { D2Api } from "@shared/types/d2-api";
import { ReferenceTermsD2Repository } from "@shared/data/repositories/reference-terms/ReferenceTermsD2Repository";

const options = [
    { code: "NEW", displayName: "New category", sortOrder: 2 },
    { code: "GENERAL", displayName: "General", sortOrder: 0 },
];

function repository(events: ReturnType<typeof event>[], objects: Array<{ options: Array<{ code: string; displayName: string; sortOrder?: number }> }> = [{ options }]) {
    const api = new D2Api({ backend: "xhr" });
    const mock = api.getMockAdapter();
    mock.onGet(/\/events/).reply(200, { events });
    mock.onGet(/\/optionSets/).reply(200, { optionSets: objects });
    return { repository: new ReferenceTermsD2Repository(api), mock };
}

function event(values: Record<string, string>) {
    return {
        event: "event1",
        dataValues: Object.entries(values).map(([dataElement, value]) => ({ dataElement, value })),
    };
}

describe("reference terms repository", () => {
    it("fetches and validates glossary entries without paging", async () => {
        const { repository: repo, mock } = repository([event({ dD9mP2sW6yA: " Term ", dE3qT5vX8zB: "Definition" })]);
        await expect(repo.getGlossary().toPromise()).resolves.toEqual([{ term: "Term", definition: "Definition" }]);
        expect(mock.history.get[0].params).toEqual(expect.objectContaining({ program: "pC7kN2qV5yG", skipPaging: true }));
    });

    it("accepts abbreviation category codes and rejects invalid entries", async () => {
        const valid = repository([
            event({ dB4fH8kN1pS: "WHO", dC7jL3nR5tV: "World Health Organization", dA6cE2gJ9mQ: "NEW" }),
        ]);
        await expect(valid.repository.getAbbreviations().toPromise()).resolves.toEqual({
            categories: [{ code: "GENERAL", name: "General" }, { code: "NEW", name: "New category" }],
            entries: [{ abbreviation: "WHO", meaning: "World Health Organization", category: "NEW" }],
        });
        expect(valid.mock.history.get.find(request => request.url?.includes("optionSets"))?.params).toEqual(expect.objectContaining({ filter: ["id:eq:pB7mQ3xL8dR"] }));
        expect(valid.mock.history.get.find(request => request.url?.includes("events"))?.params).toEqual(expect.objectContaining({ program: "pA5gJ8mR3vD", skipPaging: true }));
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
