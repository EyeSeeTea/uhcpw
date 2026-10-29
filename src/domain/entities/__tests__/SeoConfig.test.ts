import { getSeoConfigForRoute } from "../SeoConfig";

describe("getSeoConfigForRoute", () => {
    it("keeps root-deployment route lookups unchanged", () => {
        expect(getSeoConfigForRoute("/about")).toMatchObject({
            title: "About the WHO Barcelona Office work & the UHC Watch network",
        });
    });

    it("removes Astro's configured deployment base before route lookup", () => {
        expect(getSeoConfigForRoute("/dhis2/uhcwatch/about", "/dhis2/uhcwatch/")).toMatchObject({
            title: "About the WHO Barcelona Office work & the UHC Watch network",
            description:
                "Find out more about the team analysing the evidence that feeds UHC Watch: the UHC Watch network and the WHO Barcelona Office for Health Systems Financing team",
        });
    });

    it("maps the deployment root to the SEO home route", () => {
        expect(getSeoConfigForRoute("/dhis2/uhcwatch", "/dhis2/uhcwatch")).toMatchObject({
            title: "UHC Watch: tracking affordable access to health care",
        });
    });
});
