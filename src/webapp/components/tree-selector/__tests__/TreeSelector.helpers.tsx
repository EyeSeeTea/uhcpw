import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { countries } from "./TreeSelector.fixture";

export async function selectAllCountries() {
    const allCountriesCheckbox = screen.getByRole("checkbox", {
        name: /select all all countries and areas/i,
    });

    return userEvent.click(allCountriesCheckbox);
}

export async function clickOnClearAll() {
    const clearButtons = screen.getAllByText(/clear/i);
    if (clearButtons[0]) return userEvent.click(clearButtons[0]);
}

export function expandCountriesParentNode(index: 0 | 1 | 2) {
    const arrowIcons = screen.getAllByLabelText("expand-icon");
    if (!arrowIcons.length) {
        collapseCountriesParentNode(index);
    }
    if (arrowIcons[index]) {
        userEvent.click(arrowIcons[index] as HTMLElement);
    }
}

export function collapseCountriesParentNode(index: 0 | 1 | 2) {
    const arrowIcons = screen.getAllByLabelText("collapse-icon");
    if (!arrowIcons.length) {
        expandCountriesParentNode(index);
    }
    if (arrowIcons[index]) {
        userEvent.click(arrowIcons[index] as HTMLElement);
    }
}

export function focusComponent() {
    const autocompleteInput = screen.getByRole("textbox", {
        name: "Select country or area",
    });

    userEvent.click(autocompleteInput);
}

export function getChild(child: number) {
    return countries[child]?.name || "";
}

export function getParentFromChild(filter: { child: number; parent: number }) {
    return countries[filter.child]?.parents[filter.parent]?.name || "";
}

export function getAllParents() {
    return countries.map(country => country.parents.map(parent => parent.name)).flat();
}

export async function expandGroup(name: string) {
    return userEvent.click(await screen.findByText(name));
}

export async function collapseGroup(name: string) {
    return userEvent.click(await screen.findByText(name));
}

export async function selectCountry(name: string) {
    const checkbox = await screen.findByRole("checkbox", { name });

    userEvent.click(checkbox);
}

export async function verifyCountryIsChecked(name: string) {
    const checkbox = await screen.findByRole("checkbox", { name });

    await waitFor(() => expect(checkbox).toBeChecked());
}

export async function search(name: string) {
    const searchBox = await screen.findByRole("searchbox");
    userEvent.type(searchBox, name);
}

export async function verifyChip(name: string) {
    const chip = await screen.findByRole("button", {
        name: name,
    });

    expect(chip).toBeInTheDocument();
}

export async function verifyNotFoundChip(name: string) {
    const chip = await screen.queryByRole("button", {
        name: name,
    });

    expect(chip).toBeNull();
}

export async function verifyTotalExpandedGroups(total: number) {
    const groups = await screen.findAllByRole("treeitem", { expanded: true });
    expect(groups).toHaveLength(total);
}
