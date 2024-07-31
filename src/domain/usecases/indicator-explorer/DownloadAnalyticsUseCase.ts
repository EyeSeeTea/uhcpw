import { Future, FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/indicator-explorer/Visualization";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

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
    }): FutureData<void> {
        const { visualizationIds, periods, orgUnits, seriesIdAndName } = params;

        return Future.parallel(visualizationIds.map(id => this.visualizationRepository.getById(id))).flatMap(
            visualizations => {
                const mergedVisualization = this.mergeVisualizations(visualizations);

                const sortedPeriods = periods.sort();

                const noOverwritePeriods =
                    sortedPeriods[0] === LatestCOVID19.id || sortedPeriods[0] === LatestAvailable.id;

                const finalPeriods = noOverwritePeriods ? [] : periods;

                return this.analyticsRepository.saveToFile(
                    mergedVisualization,
                    finalPeriods,
                    orgUnits,
                    seriesIdAndName,
                    sortedPeriods[0] === LatestAvailable.id
                );
            }
        );
    }

    private mergeVisualizations(visualizations: Visualization[]): Visualization {
        return visualizations.reduce((merged, current) => ({
            ...merged,
            rows: [...merged.rows, ...current.rows],
            columns: [...merged.columns, ...current.columns],
            filters: [...merged.filters, ...current.filters],
            dataDimensionItems: [...merged.dataDimensionItems, ...current.dataDimensionItems],
            categoryDimensions: [...merged.categoryDimensions, ...current.categoryDimensions],
        }));
    }
}
