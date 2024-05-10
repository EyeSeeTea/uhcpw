import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { CountryFilterState, OptionsMultiFilterState } from "../../common/state/state";
import { TreeOption } from "../../components/tree-selector/TreeSelector";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    onGet: () => void;
    showVisualization: boolean;
    globalMessage?: GlobalMessage;
    pageContent: IndicatorExplorerContent | undefined;
    errorMessage: string;
};

export type IndicatorOption = {
    value: string;
    text: string;
    category: string;
};

export type IndicatorFilterState = {
    options: IndicatorOption[];
    selected: string | undefined;
    onSelectedChange: (value: string | undefined) => void;
};

export type YeasrFilterState = {
    options: TreeOption[];
    selected: string[] | undefined;
    onSelectedChange: (value: string[] | undefined) => void;
    realYearSelected: string[] | undefined;
};

type ExtraCountryFilterState = CountryFilterState & {
    disabledCountries: string[];
    maxCountrySelection: number | undefined;
};

export type IndicatorExplorerFiltersState = {
    country: ExtraCountryFilterState;
    indicators: IndicatorFilterState;
    year: YeasrFilterState;
};

export interface GlobalMessage {
    text: string;
    type: "info" | "success" | "error";
}
