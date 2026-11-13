import { PolicyExplorer, DataOrientationByTable } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerContent } from "../../../domain/entities/policy-explorer/PolicyExplorerContent";
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
    pageContent: PolicyExplorerContent | undefined;
    errorMessage: string;
    isLoading: boolean;
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
