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
        expect(params).not.toHaveProperty("page_title");
        expect(params).not.toHaveProperty("page_location");
        expect(params).toMatchObject({
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
    it("uses a full URL for country page views", () => {
        const repo = new GoogleAnalyticsRepository();
        repo.send({ name: "country_page_view", pageTitle: "Spain", country: "Spain" });
        expect(gtagSpy).toHaveBeenCalledWith("event", "page_view", {
            page_title: "Spain",
            page_location: window.location.origin + window.location.pathname + window.location.search,
            selected_country: "Spain",
        });
    });
    it("preserves the event URL when navigation occurs before GA loads", async () => {
        delete (window as any).gtag;
        window.history.replaceState({}, "", "/api/apps/uhcpw/Spain");
        const appendSpy = jest.spyOn(document.body, "appendChild");
        let script: HTMLScriptElement | undefined;
        try {
            const repo = new GoogleAnalyticsRepository();
            repo.send({ name: "country_page_view", pageTitle: "Spain", country: "Spain" });
            window.history.replaceState({}, "", "/methods");
            script = appendSpy.mock.calls[0]?.[0] as HTMLScriptElement | undefined;
            if (!script) throw new Error("Analytics script was not appended");
            script.dispatchEvent(new Event("load"));
            await Promise.resolve();
            await Promise.resolve();
            expect(window.dataLayer.map(args => Array.from(args))).toContainEqual([
                "event",
                "page_view",
                {
                    page_title: "Spain",
                    page_location: `${window.location.origin}/api/apps/uhcpw/Spain`,
                    selected_country: "Spain",
                },
            ]);
        } finally {
            appendSpy.mockRestore();
            script?.remove();
            window.history.replaceState({}, "", "/");
        }
    });
});
