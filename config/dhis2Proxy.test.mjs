import { afterEach, describe, expect, it, vi } from "vitest";
import { getDhis2Proxy } from "./dhis2Proxy.mjs";

afterEach(() => vi.unstubAllGlobals());

describe("DHIS2 development proxy", () => {
    const target = "https://dhis2.example.test/instance";

    it("rejects an absent target or an unsupported protocol", async () => {
        await expect(getDhis2Proxy({})).rejects.toThrow("REACT_APP_DHIS2_BASE_URL");
        await expect(getDhis2Proxy({ REACT_APP_DHIS2_BASE_URL: "file:///tmp/instance" })).rejects.toThrow("protocol");
    });

    it("preserves unauthenticated proxying and query strings", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const proxy = (await getDhis2Proxy({ REACT_APP_DHIS2_BASE_URL: target }))["/dhis2"];
        expect(proxy.target).toBe(target);
        expect(proxy.rewrite("/dhis2/api/me.json?fields=id")).toBe("/api/me.json?fields=id");
        expect(proxy.auth).toBeUndefined();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("forwards session cookies without Set-Cookie attributes", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            headers: { getSetCookie: () => ["session=example; Path=/; HttpOnly", "route=node1; Secure"] },
        });
        vi.stubGlobal("fetch", fetchMock);
        const auth = "test-user:test-password";
        const proxy = (await getDhis2Proxy({ REACT_APP_DHIS2_BASE_URL: target, REACT_APP_DHIS2_AUTH: auth }))["/dhis2"];
        expect(fetchMock).toHaveBeenCalledWith(`${target}/api/me.json`, {
            headers: { Authorization: `Basic ${Buffer.from(auth).toString("base64")}` },
        });
        const setHeader = vi.fn();
        proxy.configure({
            on: (_event, handler) =>
                handler({
                    setHeader,
                }),
        });
        expect(setHeader).toHaveBeenCalledWith("cookie", "session=example; route=node1");
        expect(proxy.auth).toBe(auth);
    });
});
