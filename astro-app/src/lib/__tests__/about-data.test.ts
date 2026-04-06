import { describe, it, expect } from "vitest";
import {
    mapPersonsWithCountry,
    sortTeam,
    sortExperts,
    buildCountryTreeOptions,
    ALL_NODE_ID,
} from "../about-data";
import type { Person } from "@shared/domain/entities/Person";
import type { Country } from "@shared/domain/entities/Country";

const KOSOVO_ID = "NEPywTBN52g";

function makePerson(overrides: Partial<Person> = {}): Person {
    return {
        image: "",
        firstName: "Test",
        lastName: "Person",
        position: "Analyst",
        ...overrides,
    };
}

function makeCountry(overrides: Partial<Country>): Country {
    return {
        id: "c1",
        name: "Albania",
        longName: "Albania",
        code: "AL",
        iso3Code: "ALB",
        status: "Gaps",
        parents: [],
        flag: "",
        showCountryFlag: false,
        summary: "",
        sliderInfo: {
            gapsSection: { sectionName: "", sourceText: "", content: [] },
            finProtecSection: { sectionName: "", sourceText: "", content: [] },
        },
        isInCountryPage: true,
        currencyCode: "ALL",
        ...overrides,
    };
}

describe("mapPersonsWithCountry", () => {
    it("resolves countryId to countryName", () => {
        const persons: Person[] = [
            makePerson({ firstName: "Alice", countryId: "c1" }),
            makePerson({ firstName: "Bob", countryId: "c2" }),
        ];
        const countries: Country[] = [
            makeCountry({ id: "c1", name: "Albania" }),
            makeCountry({ id: "c2", name: "Belgium" }),
        ];

        const result = mapPersonsWithCountry(persons, countries);

        expect(result[0]?.countryName).toBe("Albania");
        expect(result[1]?.countryName).toBe("Belgium");
    });

    it("defaults to empty string for unknown countryId", () => {
        const persons: Person[] = [makePerson({ firstName: "Alice", countryId: "unknown" })];
        const countries: Country[] = [makeCountry({ id: "c1", name: "Albania" })];

        const result = mapPersonsWithCountry(persons, countries);

        expect(result[0]?.countryName).toBe("");
    });

    it("defaults to empty string when countryId is undefined", () => {
        const persons: Person[] = [makePerson({ firstName: "Alice" })];
        const countries: Country[] = [makeCountry({ id: "c1", name: "Albania" })];

        const result = mapPersonsWithCountry(persons, countries);

        expect(result[0]?.countryName).toBe("");
    });
});

describe("sortTeam", () => {
    it("sorts alphabetically by firstName", () => {
        const team = [
            { ...makePerson({ firstName: "Charlie" }), countryName: "" },
            { ...makePerson({ firstName: "Alice" }), countryName: "" },
            { ...makePerson({ firstName: "Bob" }), countryName: "" },
        ];

        const result = sortTeam(team);

        expect(result.map(p => p.firstName)).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("does not mutate the original array", () => {
        const team = [
            { ...makePerson({ firstName: "Bob" }), countryName: "" },
            { ...makePerson({ firstName: "Alice" }), countryName: "" },
        ];
        const original = [...team];

        sortTeam(team);

        expect(team[0]?.firstName).toBe(original[0]?.firstName);
    });
});

describe("sortExperts", () => {
    it("places Kosovo last", () => {
        const experts = [
            { ...makePerson({ firstName: "Zara", countryId: KOSOVO_ID }), countryName: "Kosovo" },
            { ...makePerson({ firstName: "Alice", countryId: "c1" }), countryName: "Albania" },
        ];

        const result = sortExperts(experts);

        expect(result[0]?.firstName).toBe("Alice");
        expect(result[1]?.firstName).toBe("Zara");
    });

    it("sorts by countryName then firstName within non-Kosovo experts", () => {
        const experts = [
            { ...makePerson({ firstName: "Charlie", countryId: "c2" }), countryName: "Belgium" },
            { ...makePerson({ firstName: "Alice", countryId: "c1" }), countryName: "Albania" },
            { ...makePerson({ firstName: "Bob", countryId: "c1" }), countryName: "Albania" },
        ];

        const result = sortExperts(experts);

        expect(result.map(p => p.firstName)).toEqual(["Alice", "Bob", "Charlie"]);
    });

    it("sorts by firstName when countryName is the same", () => {
        const experts = [
            { ...makePerson({ firstName: "Zoe", countryId: "c1" }), countryName: "Albania" },
            { ...makePerson({ firstName: "Anna", countryId: "c1" }), countryName: "Albania" },
        ];

        const result = sortExperts(experts);

        expect(result.map(p => p.firstName)).toEqual(["Anna", "Zoe"]);
    });
});

describe("buildCountryTreeOptions", () => {
    it("builds correct parent structure", () => {
        const countries: Country[] = [
            makeCountry({
                id: "c1",
                name: "Albania",
                code: "AL",
                parents: [
                    { id: "g1", name: "Western Balkans" },
                    { id: "g2", name: "EU candidate countries" },
                ],
            }),
        ];

        const result = buildCountryTreeOptions(countries);

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe("c1");
        expect(result[0]?.name).toBe("Albania");
        expect(result[0]?.parents).toEqual([
            { id: ALL_NODE_ID, name: "All countries and areas" },
            { id: "parent-g1", name: "Western Balkans" },
            { id: "parent-g2", name: "EU candidate countries" },
        ]);
    });

    it("filters out income-related parents", () => {
        const countries: Country[] = [
            makeCountry({
                id: "c1",
                name: "Albania",
                parents: [
                    { id: "g1", name: "Western Balkans" },
                    { id: "g3", name: "Upper-middle-income countries" },
                ],
            }),
        ];

        const result = buildCountryTreeOptions(countries);

        expect(result[0]?.parents).toEqual([
            { id: ALL_NODE_ID, name: "All countries and areas" },
            { id: "parent-g1", name: "Western Balkans" },
        ]);
    });

    it("always includes ALL_NODE_ID as first parent", () => {
        const countries: Country[] = [makeCountry({ id: "c1", name: "Albania", parents: [] })];

        const result = buildCountryTreeOptions(countries);

        expect(result[0]?.parents).toEqual([
            { id: ALL_NODE_ID, name: "All countries and areas" },
        ]);
    });
});
