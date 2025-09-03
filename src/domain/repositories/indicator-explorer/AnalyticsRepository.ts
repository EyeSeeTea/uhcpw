import { FutureData } from "../../entities/Future";
import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { Visualization } from "../../entities/indicator-explorer/Visualization";
import { Id } from "../../entities/Ref";
import { Region } from "../../entities/region/Region";

export interface AnalyticsRepository {
    get(visualization: Visualization, periods: string[], countryIds: Id[], regions: Region[]): FutureData<Analytics>;
    saveToFile(params: {
        visualizations: Visualization[];
        periods: string[];
        countryIds: Id[];
        selectedRegions: Region[];
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
