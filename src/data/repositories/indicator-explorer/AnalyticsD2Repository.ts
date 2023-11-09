import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Ref } from "../../../domain/entities/Ref";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { isValidUid } from "../../../utils/uid";
import { exportToCSV } from "../../export/exportToCSV";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private d2DataEngine: unknown) {}

    public get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        const overwrittenVisualization = {
            ...visualization,
            columns: this.getDimensions(visualization, "columns", orgUnits, periods),
            rows: this.getDimensions(visualization, "rows", orgUnits, periods),
            filters: this.getDimensions(visualization, "filters", orgUnits, periods),
        } as unknown as D2Visualization;

        return Future.fromPromise(fetchData(this.d2DataEngine, overwrittenVisualization, {}))
            .flatMap(response => {
                return Future.success(response.responses[0] as Analytics);
            })
            .flatMapError(_error => {
                //console.log(error);
                return Future.error("An error has ocurred feching data from analytics");
            });
    }

    saveToFile(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<void> {
        return this.get(visualization, periods, orgUnits).flatMap(analyticsResponse => {
            const metadataIds = this.extractMetadataIds(analyticsResponse);

            return Future.joinObj({
                analyticsResponse: Future.success(analyticsResponse),
                metadata: apiToFuture(
                    this.api.get<Metadata>("/metadata", {
                        fields: "id,shortName,name",
                        filter: "id:in:[" + metadataIds.join(",") + "]",
                    })
                ),
            }).flatMap(({ analyticsResponse, metadata }) => {
                const columns = analyticsResponse.headers.map(header => header.column);

                const rows = [columns, ...this.mapAnalyticsResponseRows(analyticsResponse, metadata)];

                if (rows) {
                    exportToCSV(
                        [
                            {
                                data: rows,
                                name: "Data",
                            },
                        ],
                        "Data"
                    );
                }
                return Future.success(undefined);
            });
        });
    }

    mapAnalyticsResponseRows(analyticsResponse: Analytics, metadata: Metadata): string[][] {
        return analyticsResponse.rows.map(row =>
            row.map(cell => {
                if (isValidUid(cell)) {
                    return this.getNameFromMetadata(cell, metadata);
                } else {
                    return cell;
                }
            })
        );
    }

    getNameFromMetadata(id: string, metadata: Metadata): string {
        const { organisationUnits, ...restMetadata } = metadata;

        const orgUnit = organisationUnits?.find(orgUnit => orgUnit.id === id);

        if (orgUnit) {
            return orgUnit?.shortName || "";
        } else {
            const objects = Object.values(restMetadata).flat();

            const metadataObject = objects.find(object => object.id === id);

            return metadataObject?.name.replace("UHCW_", "") || "";
        }
    }

    extractMetadataIds(analyticsResponse: Analytics) {
        return _.uniq(
            analyticsResponse.rows
                .map(row => {
                    return row.reduce((acc: string[], cell: string) => {
                        if (isValidUid(cell)) {
                            return [...acc, cell];
                        } else {
                            return acc;
                        }
                    }, []);
                })
                .flat()
        );
    }

    private getDimensions = (
        visualization: Visualization,
        prop: VisualizationProp,
        countryIds?: string[],
        periods?: string[]
    ): ItemRef[] | undefined => {
        const existsOu = visualization[prop].some(vd => vd.id === "ou");
        const existsPe = visualization[prop].some(vd => vd.id === "pe");
        const existsDx = visualization[prop].some(vd => vd.id === "dx");
        const others = visualization[prop].filter(vd => vd.id !== "dx" && vd.id !== "pe" && vd.id !== "ou");

        if (existsOu || existsPe || existsDx || others.length > 0) {
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

            const dimensions = _.compact([...others, ...dimensionsOu, ...dimensionsPe, ...dimensionsDx]);

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

type Metadata = Record<string | "organisationUnits", { id: string; name: string; shortName: string }[]>;
