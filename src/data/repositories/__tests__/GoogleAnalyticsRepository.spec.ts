import { GoogleAnalyticsRepository } from "../GoogleAnalyticsRepository";

describe("GoogleAnalyticsRepository internal-traffic flag", () => {
    let gtagSpy: jest.Mock;

    beforeEach(() => {
        gtagSpy = jest.fn();
        (window as any).gtag = gtagSpy;
        (window as any).dataLayer = [];
        localStorage.clear();
    });

    afterEach(() => {
        delete (window as any).gtag;
        delete (window as any).dataLayer;
        localStorage.clear();
    });

    it("tags the config with traffic_type=internal when the flag is set", () => {
        localStorage.setItem("uhcpw_internal", "1");

        const repo = new GoogleAnalyticsRepository();
        repo.send({ name: "page_view", pageLocation: "/", pageTitle: "Home" });

        const configCall = gtagSpy.mock.calls.find(([verb]) => verb === "config");
        expect(configCall).toBeDefined();
        const [, , params] = configCall!;
        expect(params).toMatchObject({ traffic_type: "internal" });
    });

    it("omits traffic_type when the flag is absent", () => {
        const repo = new GoogleAnalyticsRepository();
        repo.send({ name: "page_view", pageLocation: "/", pageTitle: "Home" });

        const configCall = gtagSpy.mock.calls.find(([verb]) => verb === "config");
        expect(configCall).toBeDefined();
        const [, , params] = configCall!;
        expect(params).not.toHaveProperty("traffic_type");
        expect(params).toMatchObject({
            page_title: "Config",
            send_page_view: false,
        });
    });

    it("skips the initial config when skipInitialConfig is true, flag or not", () => {
        localStorage.setItem("uhcpw_internal", "1");

        const repo = new GoogleAnalyticsRepository({ skipInitialConfig: true });
        repo.send({ name: "page_view", pageLocation: "/", pageTitle: "Home" });

        const configCall = gtagSpy.mock.calls.find(([verb]) => verb === "config");
        expect(configCall).toBeUndefined();
    });
});
