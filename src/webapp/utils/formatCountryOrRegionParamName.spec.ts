import { formatCountryOrRegionParamName } from "./formatCountryOrRegionParamName";

describe("formatCountryOrRegionParamName", () => {
    it("removes diacritics so Türkiye becomes Turkiye", () => {
        expect(formatCountryOrRegionParamName("Türkiye")).toBe("Turkiye");
    });
});
