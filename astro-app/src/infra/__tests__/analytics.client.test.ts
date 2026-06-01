import { describe, it, expect, beforeEach, vi } from "vitest";

const sendSpy = vi.fn();
const constructorSpy = vi.fn();

vi.mock("@shared/data/repositories/GoogleAnalyticsRepository", () => ({
    GoogleAnalyticsRepository: class {
        constructor(options?: { skipInitialConfig?: boolean }) {
            constructorSpy(options);
        }
        send = sendSpy;
    },
}));

import { getAnalytics, __resetAnalyticsForTests } from "../analytics.client";
import { ANALYTICS_DEV_TAG_ID, ANALYTICS_PROD_TAG_ID, getAnalyticsTagId } from "../analytics.config";

describe("analytics.client", () => {
    beforeEach(() => {
        sendSpy.mockClear();
        constructorSpy.mockClear();
        __resetAnalyticsForTests();
    });

    it("returns the same singleton across calls", () => {
        const a = getAnalytics();
        const b = getAnalytics();
        expect(a).toBe(b);
        expect(constructorSpy).toHaveBeenCalledTimes(1);
    });

    it("constructs the repository with skipInitialConfig: true", () => {
        getAnalytics();
        expect(constructorSpy).toHaveBeenCalledWith({ skipInitialConfig: true });
    });

    it("forwards sendEvent calls to the repository", () => {
        const analytics = getAnalytics();
        analytics.sendEvent({ name: "external_link", href: "https://example.com", text: "Example" });
        expect(sendSpy).toHaveBeenCalledTimes(1);
        expect(sendSpy).toHaveBeenCalledWith({
            name: "external_link",
            href: "https://example.com",
            text: "Example",
        });
    });
});

describe("analytics.config", () => {
    it("exposes the two known GA4 tag IDs", () => {
        expect(ANALYTICS_PROD_TAG_ID).toBe("G-NMLFDE4DY7");
        expect(ANALYTICS_DEV_TAG_ID).toBe("G-5DKB563RGC");
    });

    it("selects a tag ID based on the build mode", () => {
        const tagId = getAnalyticsTagId();
        expect([ANALYTICS_PROD_TAG_ID, ANALYTICS_DEV_TAG_ID]).toContain(tagId);
    });
});
