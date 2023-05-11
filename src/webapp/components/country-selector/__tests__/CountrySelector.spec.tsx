import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../../../utils/tests";
import { CountryOption, CountrySelector } from "../CountrySelector";

const countries: CountryOption[] = [
    {
        id: "BVnpk4xiXGJ",
        name: "China",
        parents: [
            { id: "1", name: "All countries" },
            { id: "2", name: "Asia" },
        ],
    },
    {
        id: "AVnpk4xiXGJ",
        name: "France",
        parents: [
            { id: "1", name: "All countries" },
            { id: "3", name: "Europe" },
        ],
    },
    {
        id: "DVnpk4xiXGJ",
        name: "Spain",
        parents: [
            { id: "1", name: "All countries" },
            { id: "3", name: "Europe" },
        ],
    },
];

/**
 *  Expected tree
 *
 *  All Countries
 *      China
 *      France
 *      Spain
 *  Asia
 *      China
 *  Europe
 *      France
 *      Spain
 *
 *
 */

describe("CountrySelector", () => {
    describe("to load", () => {
        it("should not show the options", async () => {
            renderComponent();

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });
    });
    describe("to focus", () => {
        it("should show the options", async () => {
            renderComponent();

            focusComponent();

            await screen.findByRole("listbox");
            await screen.findByText(/select country/i);

            countries[0]?.parents?.forEach(async parent => {
                await screen.findByText(parent.name);
            });
        });

        it("should check the selected option", async () => {
            renderComponent();

            focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));

            await verifyCountryIsChecked(getChild(0));
        });

        it("should check the selected option for all parents", async () => {
            renderComponent();

            focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));

            await verifyCountryIsChecked(getChild(0));

            await collapseGroup(getParentFromChild({ child: 0, parent: 0 }));

            await expandGroup(getParentFromChild({ child: 0, parent: 1 }));

            await verifyCountryIsChecked(getChild(0));
        });

        it("should filter country after search", async () => {
            renderComponent();

            focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));
            await expandGroup(getParentFromChild({ child: 0, parent: 1 }));

            await search(getChild(0));

            await waitFor(() => expect(screen.queryAllByText(getChild(0)).length).toBe(2));
            await waitFor(() => expect(screen.queryAllByText(getChild(1)).length).toBe(0));
        });

        it("should add chip for every selected country", async () => {
            renderComponent();

            focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));
            await selectCountry(getChild(1));

            userEvent.keyboard("{Escape}");

            await verifyChip(getChild(0));
            await verifyChip(getChild(1));
        });
    });
});

function renderComponent() {
    customRender(<CountrySelector countries={countries} groupedByIncome={false} />);
}

function focusComponent() {
    const autocompleteInput = screen.getByRole("textbox", {
        name: /countries/i,
    });

    userEvent.click(autocompleteInput);
}

function getChild(child: number) {
    return countries[child]?.name || "";
}

function getParentFromChild(filter: { child: number; parent: number }) {
    return countries[filter.child]?.parents[filter.parent]?.name || "";
}

async function expandGroup(name: string) {
    return userEvent.click(await screen.findByText(name));
}

async function collapseGroup(name: string) {
    return userEvent.click(await screen.findByText(name));
}

async function selectCountry(name: string) {
    const checkbox = await screen.findByRole("checkbox", { name });

    userEvent.click(checkbox);
}

async function verifyCountryIsChecked(name: string) {
    const checkbox = await screen.findByRole("checkbox", { name });

    await waitFor(() => expect(checkbox).toBeChecked());
}

async function search(name: string) {
    const searchBox = await screen.findByRole("searchbox");
    userEvent.type(searchBox, name);
}

async function verifyChip(name: string) {
    const chip = await screen.findByRole("button", {
        name: name,
    });

    expect(chip).toBeInTheDocument();
}
