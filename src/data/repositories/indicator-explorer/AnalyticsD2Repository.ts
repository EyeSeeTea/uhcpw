import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics, AnalyticsMetadataItem } from "../../../domain/entities/indicator-explorer/Analytics";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Id, Ref } from "../../../domain/entities/Ref";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { isValidUid } from "../../../utils/uid";
import { exportToCSV } from "../../export/exportToCSV";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";
import { getCustomCellName } from "./utils/getCustomCellName";
import { EU27 } from "../../../domain/entities/Country";
import { mapToWhoCountryCode } from "../countries/mapToWhoCountryCode";

const SERVICE_PRIMARY_NAME_COLUMN = "GgAVGT9wRCM";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private d2DataEngine: unknown) {}

    public get(visualization: Visualization, periods: string[], orgUnits: string[]): FutureData<Analytics> {
        const overwrittenVisualization = {
            ...visualization,
            columns: this.getDimensions(visualization, "columns", orgUnits, periods),
            rows: this.getDimensions(visualization, "rows", orgUnits, periods),
            filters: this.getDimensions(visualization, "filters", orgUnits, periods),
        } as unknown as D2Visualization;
        //const overwrittenVisualization = visualization as unknown as D2Visualization;

        return Future.fromPromise(fetchData(this.d2DataEngine, overwrittenVisualization, {}))
            .flatMap(response => {
                const analyticsResponse = response.responses[0] as Analytics;

                if (!analyticsResponse) {
                    return Future.error<string, Analytics>("No data found");
                }

                return Future.success(analyticsResponse);
            })
            .flatMapError(_error => {
                //console.log(error);
                return Future.error("An error has ocurred feching data from analytics");
            });
    }

    saveToFile(
        visualization: Visualization,
        periods: string[],
        orgUnits: string[],
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[]
    ): FutureData<void> {
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
                const chartName = `${visualization.categoryName}: ${visualization.friendlyName}`;
                const mapCodeNameToColumnName: Record<string, string> = {
                    ou: "Country",
                    pe: "Year",
                    dx: "Parameter",
                };

                const columns = analyticsResponse.headers.map(header => {
                    if (SERVICE_PRIMARY_NAME_COLUMN === header.name) {
                        return "Parameter";
                    }
                    return (
                        mapCodeNameToColumnName[header.name] ??
                        header.column.charAt(0).toUpperCase() + header.column.slice(1).toLowerCase()
                    );
                });

                const mappedRows = _(
                    this.mapAnalyticsResponseRows({
                        analyticsResponse,
                        metadata,
                        visualizationId: visualization.id,
                        seriesIdAndName,
                    })
                )
                    .sortBy(row => row[1])
                    .value();

                const rows = [[chartName || visualization.name], columns, ...mappedRows];

                if (rows) {
                    exportToCSV(
                        [
                            {
                                data: rows,
                                name: "Data",
                            },
                        ],
                        visualization.downloadedFileName
                            ? `${visualization.categoryName}: ${visualization.downloadedFileName}`
                            : chartName
                    );
                }
                return Future.success(undefined);
            });
        });
    }

    mapAnalyticsResponseRows(params: {
        analyticsResponse: Analytics;
        metadata: Metadata;
        visualizationId: Id;
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
    }): string[][] {
        const { analyticsResponse, metadata, visualizationId, seriesIdAndName } = params;

        return analyticsResponse.rows.map(row =>
            row.map(cell => {
                if (isValidUid(cell)) {
                    return (
                        getCustomCellName(visualizationId, seriesIdAndName, cell) ??
                        this.getNameFromMetadata(cell, metadata)
                    );
                } else {
                    return seriesIdAndName.find(({ id }) => id === cell)?.name ?? cell;
                }
            })
        );
    }

    getNameFromMetadata(id: string, metadata: Metadata): string {
        const { organisationUnits, ...restMetadata } = metadata;

        const orgUnit = organisationUnits?.find(orgUnit => orgUnit.id === id);

        if (orgUnit) {
            return EU27 === id ? "EU27" : orgUnit?.shortName || "";
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
        const dimensionsOuInVisualization = visualization[prop].filter(vd => vd.id === "ou");
        const dimensionsPeInVisualization = visualization[prop].filter(vd => vd.id === "pe");
        const dimensionsDxInVisualization = visualization[prop].filter(vd => vd.id === "dx");
        const others = visualization[prop].filter(vd => vd.id !== "dx" && vd.id !== "pe" && vd.id !== "ou");

        const dimensionsOu =
            dimensionsOuInVisualization && dimensionsOuInVisualization.length > 0 && countryIds && countryIds.length > 0
                ? [{ dimension: "ou" as const, items: countryIds?.map(countryId => ({ id: countryId })) }]
                : dimensionsOuInVisualization;

        const dimensionsPe =
            dimensionsPeInVisualization && dimensionsPeInVisualization.length > 0 && periods && periods.length > 0
                ? [{ dimension: "pe" as const, items: periods?.map(period => ({ id: period })) }]
                : dimensionsPeInVisualization;

        const dimensions = _.compact([...others, ...dimensionsOu, ...dimensionsPe, ...dimensionsDxInVisualization]);

        return dimensions.length > 0 ? dimensions : undefined;
    };
}
export type VisualizationProp = "filters" | "rows" | "columns";

interface ItemRef {
    dimension: Dimension;
    items: Ref[];
}

type Metadata = Record<string | "organisationUnits", { id: string; name: string; shortName: string }[]>;
