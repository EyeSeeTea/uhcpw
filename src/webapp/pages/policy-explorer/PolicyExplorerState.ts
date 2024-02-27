import { PolicyExplorer, DataOrientationByTable } from "../../../domain/entities/policy-explorer/PolicyExplorer";
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
};

type CountryFilterStateDisabled = {
    disabledCountries: string[];
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState & CountryFilterStateDisabled;
    category: PolicyExplorerCategoriesFilterState;
    year: OptionsMultiFilterState;
};
