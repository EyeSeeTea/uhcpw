import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { CountryFilterState } from "../../common/state/state";
import { TreeOption } from "../../components/tree-selector/TreeSelector";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    onGet: () => void;
    showVisualization: boolean;
    globalMessage?: GlobalMessage;
    pageContent: IndicatorExplorerContent | undefined;
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
    disabledYears: string[];
    isSingleSelection: boolean;
};

type ExtraCountryFilterState = CountryFilterState & {
    disabledCountries: string[];
    maxCountrySelection: number | undefined;
    showSubRegions: boolean;
    selectedItemsToShowWhenAllSelected: string[];
    isOnlyEu27Comparison: boolean;
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
