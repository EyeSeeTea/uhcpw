import { FutureData } from "../../entities/Future";
import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { Visualization } from "../../entities/indicator-explorer/Visualization";

export interface AnalyticsRepository {
    get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics>;
    saveToFile(
        visualizations: Visualization[],
        periods: string[],
        orgUnits: string[],
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[],
        latestAvailableYear: boolean
    ): FutureData<void>;
}
