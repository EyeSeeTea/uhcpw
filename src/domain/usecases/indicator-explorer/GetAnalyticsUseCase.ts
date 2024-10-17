import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";
import { generateYears } from "../utils/generateYears";

export class GetAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], countries: string[]): FutureData<Analytics> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            const sortedPeriods = periods.sort();

            const finalPeriods =
                sortedPeriods[0] === LatestCOVID19.id
                    ? generateYears(2019).map(year => year.id)
                    : sortedPeriods[0] === LatestAvailable.id
                    ? generateYears().map(year => year.id)
                    : periods;

            return this.analyticsRepository.get(visualization, finalPeriods.sort(), countries);
        });
    }
}
