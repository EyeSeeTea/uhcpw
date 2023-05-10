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
        const dataDimension = `dx:${visualization.dataDimensionItems.map(item => item.dataElement.id).join(";")}`;
        const orgUnitDimension = `ou:${orgUnits.join(";")}`;
        const categoryDimensions = visualization.categoryDimensions.map(
            catDim => `${catDim.category.id}:${catDim.categoryOptions.map(catOp => catOp.id).join(";")}`
        );
        const periodDimension = `pe:${periods.join(";")}`;

        return {
            dimension: [...categoryDimensions, periodDimension],
            filter: [dataDimension, orgUnitDimension],
        };
    }
}
