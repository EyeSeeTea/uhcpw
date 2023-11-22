import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class DownloadAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], orgUnits: string[]): FutureData<void> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            return this.analyticsRepository.saveToFile(visualization, periods, orgUnits);
        });
    }
}
