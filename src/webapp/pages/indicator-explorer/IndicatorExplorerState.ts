import { IndicatorExplorerSelectCategoryInfo } from "../../../domain/entities/indicator-explorer/IndicatorExplorer";
import { CountryFilterState, OptionsFilterState, OptionsMultiFilterState } from "../../common/state/state";

export type IndicatorExplorerState = {
    filters: IndicatorExplorerFiltersState;
    onGet: () => void;
    showVisualization: boolean;
    globalMessage?: GlobalMessage;
    selectCategoryInfo: IndicatorExplorerSelectCategoryInfo | undefined;
    errorMessage: string;
};

export type IndicatorExplorerFiltersState = {
    country: CountryFilterState;
    category: OptionsFilterState;
    year: OptionsMultiFilterState;
};

export interface GlobalMessage {
    text: string;
    type: "info" | "success" | "error";
}
