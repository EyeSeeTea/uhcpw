import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useCallback } from "react";
import { customRender } from "../../../../utils/tests-ui";
import { TreeOption, TreeSelector } from "../TreeSelector";

const countries: TreeOption[] = [
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
    {
        id: "IZy3ESdFnp5",
        name: "EU27",
        parents: [],
    },
];

/**
 *  Expected tree
 *
 *  - All Countries
 *      China
 *      France
 *      Spain
 *  - Asia
 *      China
 *  - Europe
 *      France
 *      Spain
 *    EU27
 *
 *
 */

describe("Given TreeSelector", () => {
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
            screen.getByText(/select country/i);

            await waitFor(() => {
                (countries[0]?.parents || []).forEach(parent => screen.getByText(parent.name));
            });
        });

        it("should check the selected option", async () => {
            renderComponent();

            focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));

            await verifyCountryIsChecked(getChild(0));
        });

        // TODO: Fix test that fails radomly
        it.skip("should check the selected option for all parents", async () => {
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

        // TODO: Fix test, sometimes fails randomly
        it.skip("should expand parents with countries after search", async () => {
            renderComponent();

            focusComponent();

            await search(getChild(1));

            await verifyTotalExpandedGroups(2);
        });
    });
    describe("When has select all and clear all options", () => {
        beforeEach(async () => {
            renderComponent({ hasSelectAll: true, hasClearAll: true });
            focusComponent();
            await screen.findByRole("listbox");
            screen.getByText(/select country/i);
        });
        it("Then should show a checkbox in all parent nodes", async () => {
            const allCountriesCheckbox = screen.getByRole("checkbox", {
                name: /select all all countries/i,
            });
            const europeCheckbox = screen.getByRole("checkbox", {
                name: /select all europe/i,
            });
            const asiaCheckbox = screen.getByRole("checkbox", {
                name: /select all asia/i,
            });
            expect(allCountriesCheckbox).toBeInTheDocument();
            expect(europeCheckbox).toBeInTheDocument();
            expect(asiaCheckbox).toBeInTheDocument();
        });
        it("Then should select all countries from a parent when its checkbox it's clicked", async () => {
            await selectAllCountries();
            userEvent.keyboard("{Escape}");

            await verifyChip(getChild(0));
            await verifyChip(getChild(1));
            await verifyChip(getChild(2));
        });
        it("Then should show clear all button when there are something selected", async () => {
            await selectAllCountries();
            userEvent.keyboard("{Escape}");

            const clearButtons = screen.getAllByText(/clear all/i);
            expect(clearButtons[0]).toBeInTheDocument();
        });
        it("Then should clear all when click on clear all button", async () => {
            await selectAllCountries();
            userEvent.keyboard("{Escape}");
            await clickOnClearAll();

            await verifyNotFoundChip(getChild(0));
            await verifyNotFoundChip(getChild(1));
            await verifyNotFoundChip(getChild(2));
        });
    });
    describe("When an option is disabled", () => {
        beforeEach(async () => {
            renderComponent({ disabledCountries: ["IZy3ESdFnp5"] });
            focusComponent();
        });
        it("Then the option should be disabled", async () => {
            const disabledText = await screen.findByText(/eu27/i);

            expect(disabledText.getAttribute("aria-disabled")).toBe("true");
        });
    });
});

async function selectAllCountries() {
    const allCountriesCheckbox = screen.getByRole("checkbox", {
        name: /select all all countries/i,
    });

    return userEvent.click(allCountriesCheckbox);
}

async function clickOnClearAll() {
    const clearButtons = screen.getAllByText(/clear all/i);
    if (clearButtons[0]) return userEvent.click(clearButtons[0]);
}

function expandCountriesParentNode(index: 0 | 1 | 2) {
    const arrowIcons = screen.getAllByLabelText("expand-icon");
    if (!arrowIcons.length) {
        collapseCountriesParentNode(index);
    }
    if (arrowIcons[index]) {
        userEvent.click(arrowIcons[index] as HTMLElement);
    }
}

function collapseCountriesParentNode(index: 0 | 1 | 2) {
    const arrowIcons = screen.getAllByLabelText("collapse-icon");
    if (!arrowIcons.length) {
        expandCountriesParentNode(index);
    }
    if (arrowIcons[index]) {
        userEvent.click(arrowIcons[index] as HTMLElement);
    }
}

function renderComponent(params?: { hasSelectAll?: boolean; hasClearAll?: boolean; disabledCountries?: string[] }) {
    customRender(
        <CountrySelectorContainer
            hasSelectAll={params?.hasSelectAll}
            hasClearAll={params?.hasClearAll}
            disabledCountries={params?.disabledCountries}
        />
    );
}

interface CountrySelectorContainerProps {
    hasSelectAll?: boolean;
    hasClearAll?: boolean;
    disabledCountries?: string[];
}

const CountrySelectorContainer: React.FC<CountrySelectorContainerProps> = ({
    hasSelectAll = false,
    hasClearAll = false,
    disabledCountries = [],
}) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const handleSelectedChange = useCallback((ids: string[]) => {
        setSelectedIds(ids);
    }, []);

    return (
        <TreeSelector
            items={countries}
            selectedIds={selectedIds}
            onSelectedIdsChange={handleSelectedChange}
            hasSelectAll={hasSelectAll}
            hasClearAll={hasClearAll}
            disabledItems={disabledCountries}
            placeholder="Select country"
        />
    );
};

function focusComponent() {
    const autocompleteInput = screen.getByRole("textbox", {
        name: "Select country",
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

async function verifyNotFoundChip(name: string) {
    const chip = await screen.queryByRole("button", {
        name: name,
    });

    expect(chip).toBeNull();
}

async function verifyTotalExpandedGroups(total: number) {
    const groups = await screen.findAllByRole("treeitem", { expanded: true });
    expect(groups).toHaveLength(total);
}
