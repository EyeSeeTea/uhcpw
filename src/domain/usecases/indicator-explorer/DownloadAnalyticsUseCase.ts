import { Future, FutureData } from "../../entities/Future";
import { PolicyExplorerChartData } from "../../entities/indicator-explorer/PolicyExplorerChartData";
import { Id } from "../../entities/Ref";
import { Region } from "../../entities/region/Region";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";
import { PolicyExplorerChartDataRepository } from "../../repositories/PolicyExplorerChartDataRepository";
import { generateYears } from "../utils/generateYears";

export class DownloadAnalyticsUseCase {
    constructor(
        private visualizationRepository: VisualizationRepository,
        private analyticsRepository: AnalyticsRepository,
        private policyExplorerChartDataRepository: PolicyExplorerChartDataRepository
    ) {}

    public execute(params: {
        visualizationIds: string[];
        periods: string[];
        countryIds: Id[];
        selectedRegions: Region[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
    }): FutureData<void> {
        const { visualizationIds, periods, countryIds, seriesIdAndName, isScatter, xAxis, yAxis, selectedRegions } =
            params;

        const sortedPeriods = periods.sort();

        const finalPeriods =
            sortedPeriods[0] === LatestCOVID19.id
                ? generateYears(2019).map(year => year.id)
                : sortedPeriods[0] === LatestAvailable.id
                ? generateYears().map(year => year.id)
                : periods;

        // Function to fetch data for a single visualizationId
        const fetchDataForId = (visualizationId: string) => {
            return this.visualizationRepository.getById(visualizationId).flatMap(visualization => {
                return Future.joinObj({
                    visualization: Future.success(visualization),
                    policyExplorerChartData: visualization.needPolicyExplorerChartData
                        ? this.policyExplorerChartDataRepository.get(countryIds, finalPeriods.sort())
                        : Future.success(undefined),
                });
            });
        };

        return Future.parallel(visualizationIds.map(fetchDataForId)).flatMap(results => {
            const visualizations = results.map(result => result.visualization);
            const policyExplorerChartData = results.some(result => result.policyExplorerChartData)
                ? results
                      .map(result => result.policyExplorerChartData)
                      .filter(
                          (data: PolicyExplorerChartData[] | undefined): data is PolicyExplorerChartData[] =>
                              data !== undefined
                      )
                : undefined;

            return this.analyticsRepository.saveToFile({
                visualizations: visualizations,
                allPolicyExplorerChartData: policyExplorerChartData,
                periods: finalPeriods,
                countryIds: countryIds,
                selectedRegions: selectedRegions,
                seriesIdAndName: seriesIdAndName,
                isLatestAvailableYear: sortedPeriods[0] === LatestAvailable.id,
                isUpTo2019: sortedPeriods[0] === LatestCOVID19.id,
                isScatter: isScatter,
                xAxis: xAxis,
                yAxis: yAxis,
            });
        });
    }
}
