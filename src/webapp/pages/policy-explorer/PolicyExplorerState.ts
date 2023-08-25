import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
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
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState;
    category: PolicyExplorerCategoriesFilterState;
    year: OptionsMultiFilterState;
};
