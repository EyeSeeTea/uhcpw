import ResizeObserver from "resize-observer-polyfill";
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import fetch, { Headers, Request, Response } from "node-fetch";

global.ResizeObserver = ResizeObserver;

// Keep the fetch/Request implementation compatible with MSW 1 and d2-api's
// abort-controller polyfill. Node's native Request rejects that AbortSignal.
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

afterEach(cleanup);

// Mock matchMedia, which jsdom does not implement.
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
