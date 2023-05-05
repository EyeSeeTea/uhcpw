import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";
import { Visualization } from "../../entities/indicator-explorer/Visualization";

export class GetAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository
    ) {}

    public execute(visualizationId: string, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
            const { dimension, filter } = this.getDimensionsAndFilter(visualization, periods, orgUnits);

            return this.analyticsRepository.get(dimension, filter);
        });
    }

    getDimensionsAndFilter(
        visualization: Visualization,
        periods: string[],
        orgUnits: string[]
    ): { dimension: string[]; filter?: string[] } {
        debugger;
        return {
            dimension: [
                `yooLFrJORoj:GuypYXqveWn;ii0MC8x9D7i;O0MXmTdpf4m;GeiKSyJLeKt;yiucIy5NIAw`,
                `pe:${periods.join(";")}`,
            ],
            filter: [`dx:eEmQgI32ETw,ou:${orgUnits.join(";")}`],
        };
    }
}
