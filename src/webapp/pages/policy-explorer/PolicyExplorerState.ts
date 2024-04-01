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
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState;
    category: PolicyExplorerCategoriesFilterState;
    year: OptionsMultiFilterState;
};
