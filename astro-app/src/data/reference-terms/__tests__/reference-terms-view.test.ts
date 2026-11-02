import { describe, expect, it } from "vitest";
import { buildAbbreviationGroups, glossaryInitial, uniqueReferenceIds } from "../reference-terms-view";

describe("reference entry identifiers", () => {
    it("normalizes composed and decomposed accented glossary initials", () => {
        expect(glossaryInitial("Équité")).toBe("E");
        expect(glossaryInitial("e\u0301quité")).toBe("E");
        expect(glossaryInitial("access")).toBe("A");
    });
    it("creates unique anchor ids even for equivalent terms", () => {
        expect(uniqueReferenceIds(["General abbreviations", "Language abbreviations"], "category")).toEqual([
            "category-general-abbreviations",
            "category-language-abbreviations",
        ]);
        expect(uniqueReferenceIds(["Café", "Cafe", "cafe-2", "!!!"])).toEqual([
            "entry-cafe",
            "entry-cafe-2",
            "entry-cafe-2-2",
            "entry-entry",
        ]);
    });
    it("allocates unique IDs across repeated and pre-suffixed terms", () => {
        const values = ["term-2", ...Array.from({ length: 1000 }, () => "term")];
        const ids = uniqueReferenceIds(values);
        expect(ids.slice(0, 4)).toEqual(["entry-term-2", "entry-term", "entry-term-3", "entry-term-4"]);
        expect(ids[1000]).toBe("entry-term-1001");
        expect(new Set(ids).size).toBe(values.length);
    });
    it("prepares ordered groups with unique entry links across categories", () => {
        const groups = buildAbbreviationGroups({
            categories: [
                { code: "FIRST", name: "General" },
                { code: "SECOND", name: "Languages" },
                { code: "EMPTY", name: "Empty" },
            ],
            entries: [
                { abbreviation: "IT", meaning: "Italian", category: "SECOND" },
                { abbreviation: "WHO", meaning: "World Health Organization", category: "FIRST" },
                { abbreviation: "IT", meaning: "Information technology", category: "FIRST" },
            ],
        });
        expect(groups.map(group => [group.id, group.entries.map(entry => [entry.abbreviation, entry.id])])).toEqual([
            [
                "category-general",
                [
                    ["IT", "entry-it"],
                    ["WHO", "entry-who"],
                ],
            ],
            ["category-languages", [["IT", "entry-it-2"]]],
        ]);
    });
});
