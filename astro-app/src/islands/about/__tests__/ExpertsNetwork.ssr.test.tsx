/**
 * Real-module SSR guard: this file does NOT mock `../ExpertsNetworkSelector`.
 *
 * Its sole purpose is to ensure that importing `ExpertsNetwork` and rendering
 * it on the server does not pull the legacy MUI v0 providers into the SSR
 * module graph. If a future refactor re-adds a top-level
 * `import "./ExpertsNetworkSelector"` (or any direct MUI import) to
 * `ExpertsNetwork.tsx`, this test will fail with `ERR_UNSUPPORTED_DIR_IMPORT`
 * — the same error that breaks `astro build`.
 *
 * Keep this test in its own file so the global mock in
 * `ExpertsNetwork.test.tsx` does not apply.
 */
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { ExpertsNetwork } from "../ExpertsNetwork";
import type { PersonState, TreeOption } from "@/data/about/about-data";

const experts: PersonState[] = [
    {
        image: "https://example.com/a.jpg",
        firstName: "Alice",
        lastName: "Smith",
        position: "Researcher",
        countryId: "c1",
        countryName: "France",
    },
];

const countryOptions: TreeOption[] = [
    { id: "c1", name: "France", parents: [{ id: "all", name: "All" }] },
];

describe("ExpertsNetwork SSR module-graph guard", () => {
    it("renders to static markup without importing MUI providers", () => {
        const html = renderToStaticMarkup(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={["all"]}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        expect(html).toContain("Expert Network");
        expect(html).toContain("Alice");
        expect(html).toContain("experts-selector-placeholder");
    });
});
