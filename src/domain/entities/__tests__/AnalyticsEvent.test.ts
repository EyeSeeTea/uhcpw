import { getCurrentPageLocation } from "../AnalyticsEvent";

describe("getCurrentPageLocation", () => {
    it("returns the full URL including the base path and query but excluding the fragment", () => {
        try {
            window.history.replaceState({}, "", "/api/apps/uhcpw/methods?region=eu#section");
            expect(getCurrentPageLocation()).toBe(`${window.location.origin}/api/apps/uhcpw/methods?region=eu`);
        } finally {
            window.history.replaceState({}, "", "/");
        }
    });
});
