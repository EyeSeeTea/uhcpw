import { IndicatorExplorerContent } from "../../../domain/entities/indicator-explorer/IndicatorExplorerContent";
import { Id } from "../../../domain/entities/Ref";
import { CountryFilterState } from "../../common/state/state";
import { TreeOption } from "../../components/tree-selector/TreeSelector";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    onGet: () => void;
    showVisualization: boolean;
    closeVisualization: () => void;
    globalMessage?: GlobalMessage;
    pageContent: IndicatorExplorerContent | undefined;
};

export type IndicatorOption = {
    value: string;
    text: string;
    category: string;
    subcategory?: string;
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
    disabledCountriesAndRegions: Id[];
    maxCountrySelection: number | undefined;
    showSubRegions: boolean;
    selectedItemsToShowWhenAllSelected: string[];
    isOnlyEu27Comparison: boolean;
    selectedCountriesAndSubregions: Id[];
    selectedRegions: Id[];
};

export type IndicatorExplorerFiltersState = {
    countryAndRegions: ExtraCountryFilterState;
    indicators: IndicatorFilterState;
    year: YeasrFilterState;
};

export interface GlobalMessage {
    text: string;
    type: "info" | "success" | "error";
}
