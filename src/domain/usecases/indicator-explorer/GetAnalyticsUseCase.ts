import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";

export class GetAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], countries: string[]): FutureData<Analytics> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            const sortedPeriods = periods.sort();

            const noOverwritePeriods = sortedPeriods[0] === LatestCOVID19.id || sortedPeriods[0] === LatestAvailable.id;

            const finalPeriods = noOverwritePeriods ? [] : periods;

            return this.analyticsRepository.get(visualization, finalPeriods, countries);
        });
    }
}
