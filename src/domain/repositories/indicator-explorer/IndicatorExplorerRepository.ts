import { FutureData } from "../../entities/Future";
import { IndicatorExplorerSelectCategoryInfo } from "../../entities/indicator-explorer/IndicatorExplorer";

export interface IndicatorExplorerRepository {
    getSelectCategoryInfo(): FutureData<IndicatorExplorerSelectCategoryInfo>;
}
