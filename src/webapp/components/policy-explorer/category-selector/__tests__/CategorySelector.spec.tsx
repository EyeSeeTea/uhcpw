import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useCallback } from "react";
import { customRender } from "../../../../../utils/tests-ui";
import { CategoryOption, CategorySelector } from "../CategorySelector";

const categoryOptions: CategoryOption[] = [
    {
        value: "mCMVwmnGWJF",
        text: "User Charges (co-payments)",
        subcategories: [
            {
                value: "eAa8alKgk7f",
                text: "Role and nature of user charges",
            },
            {
                value: "ySKqnU1oG8a",
                text: "Mechanisms to protect people from user charges",
            },
            {
                value: "ekIncD2R5o7",
                text: "VHI role in covering user charges",
            },
        ],
        description:
            "This section focuses on user charges (co-payments) for covered services. It provides an overview of the types of user charges and protection mechanisms in place. More detailed information on the level and design of user charges is in the section on user charges by type of health care.",
    },
    {
        value: "uImM4yTeeV3",
        text: "Voluntary Health Insurance",
        subcategories: [
            {
                value: "OKGIXiFYHNQ",
                text: "VHI role",
            },
            {
                value: "OWMvZQgo9dV",
                text: "Institutions responsible for oversight or regulation of VHI",
            },
            {
                value: "agSA2qB7hfy",
                text: "Policies to make VHI affordable",
            },
        ],
        description:
            "This section focuses on the role voluntary health insurance (VHI) plays in relation to publicly financed health care, the share of population covered by VHI and its contribution to spending on health. It provides information on who sells and buys VHI, who regulates VHI and whether there are policies in place to make VHI more accessible or affordable.",
    },
    {
        value: "e6cfI6vWYEF",
        text: "Gaps in coverage",
        subcategories: [
            {
                value: "Oc0RJz88pBV",
                text: "Population entitlement: Main gaps in publicly financed coverage",
            },
            {
                value: "Cqe4z39igTX",
                text: "Service coverage: Main gaps in publicly financed coverage",
            },
            {
                value: "CCIzcBhaqCZ",
                text: "User charges (co-payments): Main gaps in publicly financed coverage",
            },
        ],
        description:
            "This section highlights the main gaps in population and service coverage and gaps caused by user charges.",
    },
];

/**
 *  Expected tree:
 *
 * - User Charges (co-payments)
 *              Role and nature of user charges
 *              Mechanisms to protect people from user charges
 *              VHI role in covering user charges
 * - Voluntary Health Insurance
 *              VHI role
 *              Institutions responsible for oversight or regulation of VHI
 *              Policies to make VHI affordable
 * - Gaps in coverage
 *              Population entitlement: Main gaps in publicly financed coverage
 *              Service coverage: Main gaps in publicly financed coverage
 *              User charges (co-payments): Main gaps in publicly financed coverage
 *
 */

describe("Given CategorySelector component", () => {
    describe("When load", () => {
        it("Then should not show the options", async () => {
            renderComponent();
            expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
        });
    });
    describe("When focus", () => {
        it("Then should show the category options", async () => {
            renderComponent();
            await focusComponent();

            await waitFor(() => {
                categoryOptions.forEach(category => screen.getByText(category.text));
            });
        });

        // TODO: Fix test
        it("Then should check all the category and all subcategories", async () => {
            // const firstCategoryName = (categoryOptions[0] as CategoryOption)?.text;
            // renderComponent();
            // focusComponent();
            // await expandCategoryByName(firstCategoryName);
            // await selectCategoryByName(firstCategoryName);
            // await verifyCategoryIsCheckedByName(firstCategoryName);
            // await verifyAllSubcategoriesAreCheckedByParentCategoryName(firstCategoryName);
        });

        it("Then should filter category after search", async () => {
            const firstCategoryName = categoryOptions[1]?.text as string;

            renderComponent();

            await focusComponent();

            await search(firstCategoryName);

            await waitFor(() => expect(screen.queryAllByText(firstCategoryName).length).toBe(1));
        });

        it("Then should add chip for every selected category", async () => {
            const firstCategoryName = categoryOptions[0]?.text as string;
            const secondCategoryName = categoryOptions[1]?.text as string;

            renderComponent();

            await focusComponent();

            await selectCategoryByName(firstCategoryName);
            await selectCategoryByName(secondCategoryName);

            userEvent.keyboard("{Escape}");

            await verifyChip(firstCategoryName);
            await verifyChip(secondCategoryName);
        });
        describe("When using select all and clear all options", () => {
            it("Then should show select all button and clear all button in dropdown menu", async () => {
                renderComponent();
                await focusComponent();

                const clearButton = screen.getByText(/clear/i);
                expect(clearButton).toBeInTheDocument();

                const selectAllButton = screen.getByText(/select all/i);
                expect(selectAllButton).toBeInTheDocument();
            });
        });
    });
});

async function verifyChip(name: string) {
    const chip = await screen.findByRole("button", { name });

    expect(chip).toBeInTheDocument();
}

// async function verifyAllSubcategoriesAreCheckedByParentCategoryName(name: string) {
//     const subcategories = categoryOptions.find(category => category.text === name)?.subcategories || [];

//     await waitFor(() => {
//         subcategories.forEach(subcategory => {
//             const subcategoryCheckbox = screen.getByRole("checkbox", { name: subcategory.text });
//             expect(subcategoryCheckbox).toBeChecked();
//         });
//     });
// }

// async function verifyCategoryIsCheckedByName(name: string) {
//     const categoryCheckbox = screen.getByRole("checkbox", {
//         name: `Select all ${name}`,
//     });

//     await waitFor(() => expect(categoryCheckbox).toBeChecked());
// }

async function search(name: string) {
    const searchBox = await screen.findByRole("searchbox");
    userEvent.type(searchBox, name);
}

async function selectCategoryByName(name: string) {
    const categoryCheckbox = screen.getByRole("checkbox", {
        name: `Select all ${name}`,
    });

    return userEvent.click(categoryCheckbox);
}

async function focusComponent() {
    const autocompleteInput = screen.getByRole("textbox", {
        name: /categories/i,
    });

    return userEvent.click(autocompleteInput);
}

function renderComponent() {
    customRender(<CategorySelectorContainer />);
}

function CategorySelectorContainer() {
    const [selectedCategoriesWithSubcategories, setSelectedCategoriesWithSubcategories] =
        React.useState<Record<string, string[]>>();

    const handleSelectedChange = useCallback((values: Record<string, string[]> | undefined) => {
        setSelectedCategoriesWithSubcategories(values);
    }, []);

    return (
        <CategorySelector
            categoryOptions={categoryOptions}
            selectedCategoriesWithSubcategories={selectedCategoriesWithSubcategories}
            onSelect={handleSelectedChange}
            label="Category"
            placeholder="Select category"
        />
    );
}
