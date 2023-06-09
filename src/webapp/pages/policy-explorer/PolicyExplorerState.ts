import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CountryFilterState, OptionsFilterState, OptionsMultiFilterState } from "../../common/state/state";

export type DataOrientation = "inverted" | "normal";

export type PolicyExplorerState = {
    filters: PolicyExplorerFiltersState;
    data?: PolicyExplorer;

    dataOrientation: DataOrientation;
    onGetTable: () => void;
    onSwitchRowColumn: () => void;
    onDownload: () => void;
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState;
    category: OptionsFilterState;
    year: OptionsMultiFilterState;
};
