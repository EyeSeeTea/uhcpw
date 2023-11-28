import { FutureData } from "../../entities/Future";
import { LatestCOVID19 } from "../../entities/Year";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class DownloadAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], orgUnits: string[]): FutureData<void> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            const sortedPeriods = periods.sort();

            const noOverwritePeriods = sortedPeriods[0] === LatestCOVID19.id;

            const finalPeriods = noOverwritePeriods ? [] : periods;

            return this.analyticsRepository.saveToFile(visualization, finalPeriods, orgUnits);
        });
    }
}
