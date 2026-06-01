import { describe, it, expect } from "vitest";
import { formatCountryOrRegionParamName } from "@shared/webapp/utils/formatCountryOrRegionParamName";

describe("formatCountryOrRegionParamName (used for nav hrefs)", () => {
    it("produces PascalCase for simple country names", () => {
        expect(formatCountryOrRegionParamName("Albania")).toBe("Albania");
    });

    it("removes spaces for multi-word country names", () => {
        expect(formatCountryOrRegionParamName("North Macedonia")).toBe("NorthMacedonia");
    });

    it("strips asterisk from Kosovo*", () => {
        expect(formatCountryOrRegionParamName("Kosovo*")).toBe("Kosovo");
    });

    it("strips parentheses content for Republic of Moldova", () => {
        expect(formatCountryOrRegionParamName("Republic of Moldova")).toBe("RepublicofMoldova");
    });

    it("produces BIH-FederationofBosniaandHerzegovina for BIH sub-region", () => {
        expect(formatCountryOrRegionParamName("BIH (the Federation of Bosnia and Herzegovina)")).toBe(
            "BIH-FederationofBosniaandHerzegovina"
        );
    });

    it("produces BIH-RepublikaSrpska for BIH sub-region", () => {
        expect(formatCountryOrRegionParamName("BIH (the Republika Srpska)")).toBe("BIH-RepublikaSrpska");
    });

    it("strips region code parentheses for European Union (EU)", () => {
        expect(formatCountryOrRegionParamName("European Union (EU)")).toBe("EuropeanUnion");
    });

    it("uses special case for Eastern Europe & Central Asia (EECA)", () => {
        expect(formatCountryOrRegionParamName("Eastern Europe & Central Asia (EECA)")).toBe(
            "EasternEuropeAndCentralAsia"
        );
    });

    it("strips region code for Western Balkans (WB)", () => {
        expect(formatCountryOrRegionParamName("Western Balkans (WB)")).toBe("WesternBalkans");
    });

    it("strips region code for European Region (ER)", () => {
        expect(formatCountryOrRegionParamName("European Region (ER)")).toBe("EuropeanRegion");
    });

    it("removes diacritics", () => {
        expect(formatCountryOrRegionParamName("Türkiye")).toBe("Turkiye");
    });
});
