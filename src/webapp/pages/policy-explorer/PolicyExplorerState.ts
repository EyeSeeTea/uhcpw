import { RefObject } from "react";
import { PolicyExplorer, DataOrientationByTable } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerSelectCategoryInfo } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import {
    CountryFilterState,
    OptionsMultiFilterState,
    PolicyExplorerCategoriesFilterState,
} from "../../common/state/state";

export type PolicyExplorerState = {
    filters: PolicyExplorerFiltersState;
    data?: PolicyExplorer;
    dataOrientationByTable?: DataOrientationByTable;
    onGetTable: () => void;
    onSwitchRowColumn: (categoryId: string) => void;
    onDownload: () => void;
    selectCategoryInfo: PolicyExplorerSelectCategoryInfo | undefined;
    errorMessage: string;
    isLoading: boolean;
    exportRef: RefObject<HTMLDivElement>;
    exportToPDF: boolean;
};

type ExtraCountryFilterState = CountryFilterState & {
    disabledCountries: string[];
    showSubRegions: boolean;
    defaultExpandedCountries: string[];
};

export type PolicyExplorerFiltersState = {
    country: ExtraCountryFilterState;
    category: PolicyExplorerCategoriesFilterState;
    year: OptionsMultiFilterState;
};
