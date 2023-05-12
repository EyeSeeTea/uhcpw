import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { CountryFilterState, YearFilterState } from "../../common/state/state";
import { Option } from "../../components/dropdown/Option";

export type DataOrientation = "inverted" | "normal";

export type PolicyExplorerState = {
    filters: PolicyExplorerFiltersState;
    data?: PolicyExplorer;

    dataOrientation: DataOrientation;
    onSwitchRowColumn: () => void;
    onDownload: () => void;
};

export type PolicyExplorerFiltersState = {
    country: CountryFilterState;
    category: {
        options: Option<string>[];
        selected: string | undefined;
        onSelectedChange: (value: string | undefined) => void;
    };
    year: YearFilterState;
};
