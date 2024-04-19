import { FutureData } from "../../entities/Future";
import { IndicatorExplorerContent } from "../../entities/indicator-explorer/IndicatorExplorerContent";

export interface IndicatorExplorerContentRepository {
    get(): FutureData<IndicatorExplorerContent>;
}
