import { Future, FutureData } from "../../entities/Future";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";
import { generateYears } from "../utils/generateYears";

export class DownloadAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(params: {
        visualizationIds: string[];
        periods: string[];
        orgUnits: string[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
    }): FutureData<void> {
        const { visualizationIds, periods, orgUnits, seriesIdAndName, isScatter, xAxis, yAxis } = params;

        return Future.parallel(visualizationIds.map(id => this.visualizationRepository.getById(id))).flatMap(
            visualizations => {
                const sortedPeriods = periods.sort();

                const finalPeriods =
                    sortedPeriods[0] === LatestCOVID19.id
                        ? generateYears(2019).map(year => year.id)
                        : sortedPeriods[0] === LatestAvailable.id
                        ? generateYears().map(year => year.id)
                        : periods;

                return this.analyticsRepository.saveToFile({
                    visualizations: visualizations,
                    periods: finalPeriods,
                    orgUnitUids: orgUnits,
                    seriesIdAndName: seriesIdAndName,
                    isLatestAvailableYear: sortedPeriods[0] === LatestAvailable.id,
                    isUpTo2019: sortedPeriods[0] === LatestCOVID19.id,
                    isScatter: isScatter,
                    xAxis: xAxis,
                    yAxis: yAxis,
                });
            }
        );
    }
}
