import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useCallback } from "react";
import { customRender } from "../../../../utils/tests-ui";
import { TreeSelector } from "../TreeSelector";
import { countries } from "./TreeSelector.fixture";
import {
    clickOnClearAll,
    collapseGroup,
    expandGroup,
    focusComponent,
    getAllParents,
    getChild,
    getParentFromChild,
    search,
    selectAllCountries,
    selectCountry,
    verifyChip,
    verifyCountryIsChecked,
    verifyNotFoundChip,
    verifyTotalExpandedGroups,
} from "./TreeSelector.helpers";

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

            await focusComponent();

            await waitFor(() => {
                (countries[0]?.parents || []).forEach(parent => screen.getByText(parent.name));
            });
        });

        it("should check the selected option", async () => {
            renderComponent();

            await focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));

            await verifyCountryIsChecked(getChild(0));
        });

        it("should check the selected option for all parents", async () => {
            renderComponent();

            await focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));

            await verifyCountryIsChecked(getChild(0));

            await collapseGroup(getParentFromChild({ child: 0, parent: 0 }));

            await expandGroup(getParentFromChild({ child: 0, parent: 1 }));

            await verifyCountryIsChecked(getChild(0));
        });

        it("should filter country after search", async () => {
            renderComponent();

            await focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));
            await expandGroup(getParentFromChild({ child: 0, parent: 1 }));

            await search(getChild(0));

            await waitFor(() => expect(screen.queryAllByText(getChild(0)).length).toBe(2));
            await waitFor(() => expect(screen.queryAllByText(getChild(1)).length).toBe(0));
        });

        it("should add chip for every selected country", async () => {
            renderComponent();

            await focusComponent();

            await expandGroup(getParentFromChild({ child: 0, parent: 0 }));

            await selectCountry(getChild(0));
            await selectCountry(getChild(1));

            userEvent.keyboard("{Escape}");

            await verifyChip(getChild(0));
            await verifyChip(getChild(1));
        });

        it("should expand parents with countries after search", async () => {
            renderComponent();

            await focusComponent();

            await search(getChild(1));

            await verifyTotalExpandedGroups(2);
        });
    });
    describe("When has select all and clear all options", () => {
        beforeEach(async () => {
            renderComponent({ hasSelectAll: true, hasClearAll: true });
            await focusComponent();
        });
        it("Then should show a checkbox in all parent nodes", async () => {
            const allCountriesCheckbox = screen.getByRole("checkbox", {
                name: /select all all countries and areas/i,
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

            const clearButtons = screen.getAllByText(/clear/i);
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
            await focusComponent();
        });
        it("Then the option should be disabled", async () => {
            const disabledText = await screen.findByText(/eu27/i);

            expect(disabledText.getAttribute("aria-disabled")).toBe("true");
        });
    });
    describe("When has show parent if check", () => {
        beforeEach(async () => {
            renderComponent({ hasSelectAll: true, hasClearAll: true, showParentIfChecked: true });
            await focusComponent();
        });
        it("Should show parent as chip instead of children", async () => {
            selectAllCountries();

            getAllParents().forEach(async parent => {
                await verifyChip(parent);
            });
        });
    });
});

function renderComponent(params?: {
    hasSelectAll?: boolean;
    hasClearAll?: boolean;
    disabledCountries?: string[];
    showParentIfChecked?: boolean;
}) {
    customRender(
        <CountrySelectorContainer
            hasSelectAll={params?.hasSelectAll}
            hasClearAll={params?.hasClearAll}
            disabledCountries={params?.disabledCountries}
            showParentIfChecked={params?.showParentIfChecked}
        />
    );
}
interface CountrySelectorContainerProps {
    hasSelectAll?: boolean;
    hasClearAll?: boolean;
    disabledCountries?: string[];
    showParentIfChecked?: boolean;
}

const CountrySelectorContainer: React.FC<CountrySelectorContainerProps> = ({
    hasSelectAll = false,
    hasClearAll = false,
    disabledCountries = [],
    showParentIfChecked,
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
            placeholder="Select country or area"
            label="Countries and areas"
            showParentIfChecked={showParentIfChecked}
            allSelectedLabel="All countries/areas"
        />
    );
};
