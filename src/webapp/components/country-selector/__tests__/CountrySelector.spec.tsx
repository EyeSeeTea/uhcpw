import "@testing-library/jest-dom";
import { prettyDOM, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../../../utils/tests";
import { CountryOption, CountrySelector } from "../CountrySelector";

describe("CountrySelector", () => {
    describe("to load", () => {
        it("should not show the options", async () => {
            const countries = givenACountries();

            renderComponent(countries);

            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });
    });
    describe("to focus", () => {
        it("should show the options", async () => {
            const countries = givenACountries();

            renderComponent(countries);

            focusComponent();

            await screen.findByRole("listbox");
            await screen.findByText(/select country/i);

            countries[0]?.parents?.forEach(async parent => {
                await screen.findByText(parent.name);
            });
        });

        it("should check the selected option", async () => {
            const countries = givenACountries();

            renderComponent(countries);

            focusComponent();

            const child1Parent1 = getParentFromChild(countries, 0, 0);
            userEvent.click(await screen.findByText(child1Parent1));

            const child1 = getChild(countries, 0);
            const check = await screen.findByRole("checkbox", { name: child1 });

            userEvent.click(check);

            waitFor(() => expect(check).toHaveAttribute("checked", true));
        });

        it("should check the selected option for all parents", async () => {
            const countries = givenACountries();

            renderComponent(countries);

            focusComponent();

            const child1Parent1Name = getParentFromChild(countries, 0, 0);
            const node1 = await screen.findByText(child1Parent1Name);
            userEvent.click(node1);

            const child1 = getChild(countries, 0);
            const leafParent1 = await screen.findByRole("checkbox", { name: child1 });

            userEvent.click(leafParent1);

            waitFor(() => expect(leafParent1).toHaveAttribute("checked", true));

            userEvent.click(node1);

            const child1Parent2Name = getParentFromChild(countries, 0, 0);
            userEvent.click(await screen.findByText(child1Parent2Name));

            const leafParent2 = await screen.findByRole("checkbox", { name: child1 });

            userEvent.click(leafParent1);

            waitFor(() => expect(leafParent2).toHaveAttribute("checked", true));
        });
        it("should filter country after search", async () => {
            const countries = givenACountries();

            renderComponent(countries);

            focusComponent();

            const child1Name = getChild(countries, 0);
            userEvent.type(await screen.findByRole("searchbox"), child1Name);

            const child1Parent1Name = getParentFromChild(countries, 0, 0);
            userEvent.click(await screen.findByText(child1Parent1Name));

            const child1Parent2Name = getParentFromChild(countries, 0, 1);
            userEvent.click(await screen.findByText(child1Parent2Name));

            const child2Name = getChild(countries, 1);

            waitFor(() => expect(screen.queryAllByText(child1Name).length).toBe(2));
            waitFor(() => expect(screen.queryAllByText(child2Name).length).toBe(0));
        });
    });
});

function getChild(countries: CountryOption[], child: number) {
    return countries[child]?.name || "";
}

function getParentFromChild(countries: CountryOption[], child: number, parent: number) {
    return countries[child]?.parents[parent]?.name || "";
}

function focusComponent() {
    const autocompleteInput = screen.getByRole("textbox", {
        name: /countries/i,
    });

    userEvent.click(autocompleteInput);
}

function renderComponent(countries: CountryOption[]) {
    customRender(<CountrySelector countries={countries} />);
}

function givenACountries() {
    const countries: CountryOption[] = [
        {
            id: "DVnpk4xiXGJ",
            name: "Spain",
            parents: [
                { id: "1", name: "All countries" },
                { id: "2", name: "Europe" },
            ],
        },
        {
            id: "AVnpk4xiXGJ",
            name: "France",
            parents: [
                { id: "1", name: "All countries" },
                { id: "2", name: "Europe" },
            ],
        },
        {
            id: "BVnpk4xiXGJ",
            name: "China",
            parents: [
                { id: "1", name: "All countries" },
                { id: "3", name: "Asia" },
            ],
        },
    ];

    return countries;
}
