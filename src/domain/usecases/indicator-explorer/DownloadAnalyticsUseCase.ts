import { FutureData } from "../../entities/Future";
import { LatestCOVID19 } from "../../entities/Year";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class DownloadAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(params: {
        visualizationId: string;
        periods: string[];
        orgUnits: string[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
    }): FutureData<void> {
        const { visualizationId, periods, orgUnits, seriesIdAndName } = params;
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            const sortedPeriods = periods.sort();

            const noOverwritePeriods = sortedPeriods[0] === LatestCOVID19.id;

            const finalPeriods = noOverwritePeriods ? [] : periods;

            return this.analyticsRepository.saveToFile(visualization, finalPeriods, orgUnits, seriesIdAndName);
        });
    }
}
