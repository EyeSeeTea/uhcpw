import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerSelectCategoryInfo } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import {
    CountryFilterState,
    OptionsMultiFilterState,
    PolicyExplorerCategoriesFilterState,
} from "../../common/state/state";

export type DataOrientation = "inverted" | "normal";

export type PolicyExplorerState = {
    filters: PolicyExplorerFiltersState;
    data?: PolicyExplorer;
    dataOrientationByTable?: Record<string, DataOrientation>;
    onGetTable: () => void;
    onSwitchRowColumn: (categoryId: string) => void;
    onDownload: (categoryId: string) => void;
    selectCategoryInfo: PolicyExplorerSelectCategoryInfo | undefined;
    errorMessage: string;
};

type CountryFilterStateDisabled = {
    disabledCountries: string[];
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState & CountryFilterStateDisabled;
    category: PolicyExplorerCategoriesFilterState;
    year: OptionsMultiFilterState;
};
