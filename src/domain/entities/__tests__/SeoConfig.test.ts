import { getSeoConfigForRoute } from "../SeoConfig";

describe("getSeoConfigForRoute", () => {
    it("keeps root-deployment route lookups unchanged", () => {
        expect(getSeoConfigForRoute("/about")).toMatchObject({ title: "UHC Watch - About" });
    });

    it("removes Astro's configured deployment base before route lookup", () => {
        expect(getSeoConfigForRoute("/dhis2/uhcwatch/about", "/dhis2/uhcwatch/")).toMatchObject({
            title: "UHC Watch - About",
            description:
                "Find out more about the team behind UHC Watch: the European Financial Protection network and the WHO Barcelona Office for Health Systems Financing",
        });
    });

    it("maps the deployment root to the SEO home route", () => {
        expect(getSeoConfigForRoute("/dhis2/uhcwatch", "/dhis2/uhcwatch")).toMatchObject({
            title: "UHC Watch",
        });
    });
});
