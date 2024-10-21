import { FutureData } from "../../entities/Future";
import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { Visualization } from "../../entities/indicator-explorer/Visualization";

export interface AnalyticsRepository {
    get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics>;
    saveToFile(params: {
        visualizations: Visualization[];
        periods: string[];
        orgUnitUids: string[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        isLatestAvailableYear: boolean;
        isUpTo2019: boolean;
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
    }): FutureData<void>;
}
