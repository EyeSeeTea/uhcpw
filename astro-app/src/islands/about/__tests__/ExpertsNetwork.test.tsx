import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import React from "react";
import { ExpertsNetwork } from "../ExpertsNetwork";
import type { PersonState, TreeOption } from "@/data/about/about-data";

const treeSelectorState = vi.hoisted(() => ({
    onSelectedIdsChange: undefined as ((ids: string[]) => void) | undefined,
}));

vi.mock("../ExpertsNetworkSelector", () => ({
    ExpertsNetworkSelector: (props: {
        onSelectedCountriesChange: (ids: string[]) => void;
    }) => {
        treeSelectorState.onSelectedIdsChange = props.onSelectedCountriesChange;
        return <div data-testid="tree-selector" data-placeholder="Select country or area" />;
    },
}));

const experts: PersonState[] = [
    {
        image: "https://example.com/a.jpg",
        firstName: "Alice",
        lastName: "Smith",
        position: "Researcher",
        countryId: "c1",
        countryName: "France",
    },
    {
        image: "https://example.com/b.jpg",
        firstName: "Bob",
        lastName: "Jones",
        position: "Analyst",
        countryId: "c2",
        countryName: "Spain",
    },
];

const countryOptions: TreeOption[] = [
    { id: "c1", name: "France", parents: [{ id: "all", name: "All" }] },
    { id: "c2", name: "Spain", parents: [{ id: "all", name: "All" }] },
];

const parentSortOrder = ["all"];

describe("ExpertsNetwork", () => {
    beforeEach(() => {
        treeSelectorState.onSelectedIdsChange = undefined;
    });

    it("renders title and subtitle", () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        expect(screen.getByText("Expert Network")).toBeInTheDocument();
        expect(screen.getByText("Working together")).toBeInTheDocument();
    });

    it("renders the tree selector with correct placeholder", async () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        const selector = await screen.findByTestId("tree-selector");
        expect(selector).toHaveAttribute("data-placeholder", "Select country or area");
    });

    it("renders all experts when no country is selected", () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("renders the experts grid with list role", () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        expect(screen.getByRole("list", { name: "Experts network" })).toBeInTheDocument();
    });

    it("renders correct number of list items", () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(2);
    });

    it("server-renders title, subtitle, all experts and a placeholder (no TreeSelector)", () => {
        const html = renderToStaticMarkup(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        expect(html).toContain("Expert Network");
        expect(html).toContain("Working together");
        expect(html).toContain("Alice");
        expect(html).toContain("Bob");
        expect(html).toContain("experts-selector-placeholder");
        expect(html).not.toContain("data-testid=\"tree-selector\"");
    });

    it("hydrates SSR markup without mismatch and then mounts the TreeSelector", async () => {
        const props = {
            experts,
            countryOptions,
            parentSortOrder,
            title: "Expert Network",
            subtitle: "Working together",
        };

        const ssrHtml = renderToStaticMarkup(<ExpertsNetwork {...props} />);
        const container = document.createElement("div");
        container.innerHTML = ssrHtml;
        document.body.appendChild(container);

        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
            let root: ReturnType<typeof hydrateRoot> | undefined;
            act(() => {
                root = hydrateRoot(container, <ExpertsNetwork {...props} />);
            });

            // The dynamic import resolves on the next microtask; await it.
            await act(async () => {
                await Promise.resolve();
            });

            expect(container.querySelector("[data-testid=\"tree-selector\"]")).not.toBeNull();
            expect(container.querySelector(".experts-selector-placeholder")).toBeNull();

            // Hydration mismatches surface as console.error calls from React.
            const mismatchCalls = consoleError.mock.calls.filter(call =>
                String(call[0]).includes("hydrat")
            );
            expect(mismatchCalls).toEqual([]);

            root?.unmount();
        } finally {
            consoleError.mockRestore();
            container.remove();
        }
    });

    it("mounts the TreeSelector and removes the placeholder after hydration", async () => {
        const { container } = render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        await screen.findByTestId("tree-selector");
        expect(container.querySelector(".experts-selector-placeholder")).toBeNull();
    });

    it("filters experts when the TreeSelector reports a new selection", async () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        await screen.findByTestId("tree-selector");

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();

        act(() => {
            treeSelectorState.onSelectedIdsChange?.(["c1"]);
        });

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.queryByText("Bob")).toBeNull();
    });

    it("renders an empty grid when experts array is empty", () => {
        render(
            <ExpertsNetwork
                experts={[]}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        const items = screen.queryAllByRole("listitem");
        expect(items).toHaveLength(0);
    });
});
