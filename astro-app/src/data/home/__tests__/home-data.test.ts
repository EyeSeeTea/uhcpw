import { describe, it, expect } from "vitest";
import { buildHomeNews, buildHomeResources, buildMapMarkers } from "../home-data";
import type { Resource } from "@shared/domain/entities/resources/Resource";
import type { Country } from "@shared/domain/entities/Country";

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

function makeResource(overrides: Partial<Resource> & { kind: Resource["kind"] }): Resource {
    const base = {
        id: "r1",
        title: "Test Resource",
        imageOriginal: "http://example.com/img.png",
        date: new Date("2025-01-01"),
        favouriteHome: true,
        favouriteHomeOrder: 1,
        favouriteSection: false,
        favouriteSectionOrder: 0,
    };

    switch (overrides.kind) {
        case "news":
            return { ...base, url: "http://example.com/news", ...overrides, kind: "news" } as Resource;
        case "multimedia":
            return {
                ...base,
                url: "http://example.com/video",
                theme: "t1",
                ...overrides,
                kind: "multimedia",
            } as Resource;
        case "comparative-analysis":
            return {
                ...base,
                links: [{ language: "en", url: "http://example.com/ca" }],
                theme: "t1",
                relatedCountries: [],
                ...overrides,
                kind: "comparative-analysis",
            } as Resource;
        case "country-analysis":
            return {
                ...base,
                links: [{ language: "en", url: "http://example.com/coa" }],
                theme: "t1",
                countryId: "c1",
                ...overrides,
                kind: "country-analysis",
            } as Resource;
    }
}

describe("buildHomeResources", () => {
    it("filters only favouriteHome resources", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "r1", favouriteHome: true }),
            makeResource({ kind: "news", id: "r2", favouriteHome: false }),
        ];

        const result = buildHomeResources(resources);

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe("r1");
    });

    it("deduplicates by id, keeping highest-priority kind", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "r1", favouriteHome: true }),
            makeResource({ kind: "comparative-analysis", id: "r1", favouriteHome: true }),
        ];

        const result = buildHomeResources(resources);

        expect(result).toHaveLength(1);
        expect(result[0]?.kind).toBe("comparative-analysis");
    });

    it("sorts by favouriteHomeOrder", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "r3", favouriteHome: true, favouriteHomeOrder: 3 }),
            makeResource({ kind: "news", id: "r1", favouriteHome: true, favouriteHomeOrder: 1 }),
            makeResource({ kind: "news", id: "r2", favouriteHome: true, favouriteHomeOrder: 2 }),
        ];

        const result = buildHomeResources(resources);

        expect(result.map(r => r.id)).toEqual(["r1", "r2", "r3"]);
    });

    it("limits to 6 resources", () => {
        const resources: Resource[] = Array.from({ length: 10 }, (_, i) =>
            makeResource({ kind: "news", id: `r${i}`, favouriteHome: true, favouriteHomeOrder: i }),
        );

        const result = buildHomeResources(resources);

        expect(result).toHaveLength(6);
    });

    it("assigns correct tag labels", () => {
        const resources: Resource[] = [
            makeResource({ kind: "comparative-analysis", id: "r1", favouriteHome: true }),
            makeResource({ kind: "country-analysis", id: "r2", favouriteHome: true, favouriteHomeOrder: 2 }),
            makeResource({ kind: "news", id: "r3", favouriteHome: true, favouriteHomeOrder: 3 }),
            makeResource({ kind: "multimedia", id: "r4", favouriteHome: true, favouriteHomeOrder: 4 }),
        ];

        const result = buildHomeResources(resources);

        expect(result.find(r => r.kind === "comparative-analysis")?.tagLabel).toBe("Comparative analysis");
        expect(result.find(r => r.kind === "country-analysis")?.tagLabel).toBe("Country or area analysis");
        expect(result.find(r => r.kind === "news")?.tagLabel).toBe("News");
        expect(result.find(r => r.kind === "multimedia")?.tagLabel).toBe("Multimedia");
    });

    it("extracts url from links for analysis resources", () => {
        const resources: Resource[] = [
            makeResource({
                kind: "comparative-analysis",
                id: "r1",
                favouriteHome: true,
                links: [{ language: "en", url: "http://example.com/report.pdf" }],
            }),
        ];

        const result = buildHomeResources(resources);

        expect(result[0]?.url).toBe("http://example.com/report.pdf");
    });

    it("excludes news when excludeNews option is true", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "n1", favouriteHome: true, favouriteHomeOrder: 1 }),
            makeResource({ kind: "comparative-analysis", id: "ca1", favouriteHome: true, favouriteHomeOrder: 2 }),
            makeResource({ kind: "country-analysis", id: "co1", favouriteHome: true, favouriteHomeOrder: 3 }),
        ];

        const result = buildHomeResources(resources, { excludeNews: true });

        expect(result.map(r => r.id)).toEqual(["ca1", "co1"]);
    });

    it("returns empty array when no favourites", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "r1", favouriteHome: false }),
        ];

        const result = buildHomeResources(resources);

        expect(result).toHaveLength(0);
    });

    it("skips analysis resources with no links (would produce empty url)", () => {
        const resources: Resource[] = [
            makeResource({
                kind: "comparative-analysis",
                id: "r1",
                favouriteHome: true,
                links: [],
            }),
            makeResource({ kind: "news", id: "r2", favouriteHome: true }),
        ];

        const result = buildHomeResources(resources);

        expect(result.map(r => r.id)).toEqual(["r2"]);
    });
});

describe("buildHomeNews", () => {
    it("includes only news items with favouriteSection", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "n1", favouriteSection: true, favouriteSectionOrder: 1 }),
            makeResource({ kind: "news", id: "n2", favouriteSection: false }),
            makeResource({ kind: "comparative-analysis", id: "c1", favouriteSection: true }),
        ];

        const result = buildHomeNews(resources);

        expect(result.map(r => r.id)).toEqual(["n1"]);
    });

    it("sorts by favouriteSectionOrder", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "n3", favouriteSection: true, favouriteSectionOrder: 3 }),
            makeResource({ kind: "news", id: "n1", favouriteSection: true, favouriteSectionOrder: 1 }),
            makeResource({ kind: "news", id: "n2", favouriteSection: true, favouriteSectionOrder: 2 }),
        ];

        const result = buildHomeNews(resources);

        expect(result.map(r => r.id)).toEqual(["n1", "n2", "n3"]);
    });

    it("limits to 6 items", () => {
        const resources: Resource[] = Array.from({ length: 10 }, (_, i) =>
            makeResource({
                kind: "news",
                id: `n${i}`,
                favouriteSection: true,
                favouriteSectionOrder: i,
            }),
        );

        const result = buildHomeNews(resources);

        expect(result).toHaveLength(6);
    });

    it("ignores favouriteHomeOrder when ordering news", () => {
        const resources: Resource[] = [
            makeResource({
                kind: "news",
                id: "n1",
                favouriteSection: true,
                favouriteSectionOrder: 5,
                favouriteHomeOrder: 1,
            }),
            makeResource({
                kind: "news",
                id: "n2",
                favouriteSection: true,
                favouriteSectionOrder: 1,
                favouriteHomeOrder: 5,
            }),
        ];

        const result = buildHomeNews(resources);

        expect(result.map(r => r.id)).toEqual(["n2", "n1"]);
    });

    it("returns empty array when no news has favouriteSection", () => {
        const resources: Resource[] = [
            makeResource({ kind: "news", id: "n1", favouriteSection: false }),
        ];

        expect(buildHomeNews(resources)).toHaveLength(0);
    });
});

describe("buildMapMarkers", () => {
    it("includes only countries with summary data", () => {
        const countries: Country[] = [
            makeCountry({ id: "c1", name: "Albania", summary: "Has summary", coordinates: [20, 41] }),
            makeCountry({ id: "c2", name: "Belgium", summary: "" }),
            makeCountry({ id: "c3", name: "Chile", summary: "Also has summary", coordinates: [-70, -33] }),
        ];

        const result = buildMapMarkers(countries);

        expect(result.type).toBe("FeatureCollection");
        expect(result.features).toHaveLength(2);
        expect(result.features[0]?.properties.name).toBe("Albania");
        expect(result.features[1]?.properties.name).toBe("Chile");
    });

    it("creates valid GeoJSON Point features", () => {
        const countries: Country[] = [
            makeCountry({ id: "c1", name: "Albania", summary: "Has data", coordinates: [20.1, 41.3] }),
        ];

        const result = buildMapMarkers(countries);
        const feature = result.features[0]!;

        expect(feature.type).toBe("Feature");
        expect(feature.geometry.type).toBe("Point");
        expect(feature.geometry.coordinates).toEqual([20.1, 41.3]);
        expect(feature.properties.id).toBe("c1");
    });

    it("returns empty FeatureCollection when no countries have summary", () => {
        const countries: Country[] = [
            makeCountry({ id: "c1", name: "Albania", summary: "" }),
        ];

        const result = buildMapMarkers(countries);

        expect(result.features).toHaveLength(0);
    });
});
