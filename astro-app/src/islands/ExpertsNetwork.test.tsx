import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ExpertsNetwork } from "./ExpertsNetwork";
import type { PersonState } from "../lib/about-data";
import type { TreeOption } from "../lib/about-data";

vi.mock("@material-ui/core/styles", () => ({
    MuiThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("material-ui/styles/MuiThemeProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@shared/webapp/pages/app/themes/dhis2.theme", () => ({
    muiTheme: {},
}));

vi.mock("@shared/webapp/pages/app/themes/dhis2-legacy.theme", () => ({
    default: {},
}));

vi.mock("@shared/webapp/components/tree-selector/TreeSelector", () => ({
    TreeSelector: (props: Record<string, unknown>) => (
        <div data-testid="tree-selector" data-placeholder={props.placeholder} />
    ),
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

    it("renders the tree selector with correct placeholder", () => {
        render(
            <ExpertsNetwork
                experts={experts}
                countryOptions={countryOptions}
                parentSortOrder={parentSortOrder}
                title="Expert Network"
                subtitle="Working together"
            />
        );

        const selector = screen.getByTestId("tree-selector");
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
