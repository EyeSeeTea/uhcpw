import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private d2DataEngine: unknown) {}

    public get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        // const { dimension, filter } = this.getDimensionsAndFilter(visualization, periods, orgUnits);

        // return apiToFuture(
        //     this.api.analytics
        //         .get({
        //             dimension,
        //             filter,
        //         })
        //         .map(response => {
        //             //TODO: Response from analytics endpoint hasn't metadataItems
        //             return response.data as unknown as Analytics;
        //         })
        // );

        return Future.fromPromise(fetchData(this.d2DataEngine, visualization as unknown as D2Visualization, {}))
            .flatMap(response => {
                //return Future.success(hardcodedAnalytics as unknown as Analytics);
                return Future.success(response.responses[0] as Analytics);
            })
            .flatMapError(_error => {
                //console.log(error);
                return Future.error("An error has ocurred feching data from analytics");
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
