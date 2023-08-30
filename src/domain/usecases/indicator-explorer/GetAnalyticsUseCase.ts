import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class GetAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            return this.analyticsRepository.get(visualization, periods, orgUnits);
        });
    }
}
