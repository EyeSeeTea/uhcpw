import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Ref } from "../../../domain/entities/Ref";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private d2DataEngine: unknown) {}

    public get(visualization: Visualization, _periods: string[], _orgUnits: string[]): FutureData<Analytics> {
        const overwrittenVisualization = visualization as unknown as D2Visualization;
        // = {
        //     ...visualization,
        //     columns: this.getDimensions(visualization, "columns", orgUnits, periods),
        //     rows: this.getDimensions(visualization, "rows", orgUnits, periods),
        //     filters: this.getDimensions(visualization, "filters", orgUnits, periods),
        // } as unknown as D2Visualization;

        return Future.fromPromise(fetchData(this.d2DataEngine, overwrittenVisualization, {}))
            .flatMap(response => {
                //return Future.success(hardcodedAnalytics as unknown as Analytics);
                return Future.success(response.responses[0] as Analytics);
            })
            .flatMapError(_error => {
                //console.log(error);
                return Future.error("An error has ocurred feching data from analytics");
            });
    }

    getDimensions = (
        visualization: Visualization,
        prop: VisualizationProp,
        countryIds?: string[],
        periods?: string[]
    ): ItemRef[] | undefined => {
        const existsOu = visualization[prop].some(vd => vd.id === "ou");
        const existsPe = visualization[prop].some(vd => vd.id === "pe");
        const existsDx = visualization[prop].some(vd => vd.id === "dx");

        if (existsOu || existsPe || existsDx) {
            const dimensionsOu =
                existsOu && countryIds && countryIds.length > 0
                    ? [{ dimension: "ou" as const, items: countryIds?.map(countryId => ({ id: countryId })) }]
                    : [];

            const dimensionsPe =
                existsPe && periods && periods.length > 0
                    ? [{ dimension: "pe" as const, items: periods?.map(period => ({ id: period })) }]
                    : [];

            const dimensionsDx =
                (dimensionsOu.length > 0 || dimensionsPe.length > 0) &&
                existsDx &&
                visualization.dataDimensionItems &&
                visualization.dataDimensionItems.length > 0
                    ? [
                          {
                              dimension: "dx" as const,
                              items: visualization.dataDimensionItems?.map(
                                  dataDimensionItem => dataDimensionItem.dataElement
                              ),
                          },
                      ]
                    : [undefined];

            const dimensions = _.compact([...dimensionsOu, ...dimensionsPe, ...dimensionsDx]);

            return dimensions.length > 0 ? dimensions : undefined;
        } else {
            return undefined;
        }
    };
}
export type VisualizationProp = "filters" | "rows" | "columns";

interface ItemRef {
    dimension: Dimension;
    items: Ref[];
}
