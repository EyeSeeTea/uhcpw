import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";
import { CountryFilterState, OptionsMultiFilterState } from "../../common/state/state";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    onGet: () => void;
    showVisualization: boolean;
    globalMessage?: GlobalMessage;
    selectCategoryInfo: IndicatorExplorerSelectCategoryInfo | undefined;
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

export type YeasrFilterState = OptionsMultiFilterState & { realYearSelected: string[] | undefined };

export type IndicatorExplorerFiltersState = {
    country: CountryFilterState;
    indicators: IndicatorFilterState;
    year: YeasrFilterState;
};

export interface GlobalMessage {
    text: string;
    type: "info" | "success" | "error";
}
