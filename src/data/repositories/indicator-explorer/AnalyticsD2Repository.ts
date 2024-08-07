import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Id, Ref } from "../../../domain/entities/Ref";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api, NonPaginatedObjects } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { isValidUid } from "../../../utils/uid";
import { exportToCSV } from "../../export/exportToCSV";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";
import { getCustomCellName } from "./utils/getCustomCellName";
import { mapToWhoCountryName } from "../countries/mapToWhoCountryData";
import {
    getBreakInSeriesCountryDescription,
    VisualizationBreakInSeries,
} from "../../../domain/entities/indicator-explorer/BreakInSeries";
import { Maybe } from "../../../types/utils";
import {
    filterRowsByYearInCountry,
    getLastAvailableYearByCountry,
    getLatestAvailableYearByCountryIdFromTwoCharts,
} from "./utils/lastAvailableYearHelpers";

const SERVICE_PRIMARY_NAME_COLUMN = "GgAVGT9wRCM";

const HEADER_NAMES_BY_VISUALIZATION: Record<string, Record<string, string>> = {
    z6nPPMMbOw5: {
        ou: "Country",
        pe: "Year",
        dx: "Financing scheme",
        [SERVICE_PRIMARY_NAME_COLUMN]: "Type of care",
    },
    default: {
        ou: "Country",
        pe: "Year",
        dx: "Parameter",
    },
};

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
        visualizations: Visualization[],
        periods: string[],
        orgUnitUids: string[],
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[],
        latestAvailableYear: boolean
    ): FutureData<void> {
        return Future.parallel(
            visualizations.map(visualization => this.get(visualization, periods, orgUnitUids))
        ).flatMap(analyticsResponses => {
            const analyticsResponseRows = analyticsResponses.reduce((acc: string[][], analyticsResponse) => {
                return [...acc, ...analyticsResponse.rows];
            }, []);
            const metadataIds = this.extractMetadataIds(analyticsResponseRows);

            return Future.joinObj({
                analyticsResponses: Future.success(analyticsResponses),
                metadata: apiToFuture(
                    this.api.get<Metadata>("/metadata", {
                        fields: "id,shortName,name",
                        filter: "id:in:[" + metadataIds.join(",") + "]",
                    })
                ),
                orgUnits: apiToFuture(
                    this.api.models.organisationUnits.get({
                        fields: {
                            id: true,
                            shortName: true,
                        },
                        paging: false,
                        filter: { id: { in: orgUnitUids } },
                    })
                ),
            }).flatMap(({ analyticsResponses, metadata, orgUnits }) => {
                const mergedVisualization = this.mergeVisualizations(visualizations);

                const isMultipleVisualizations = mergedVisualization.id.includes("_");

                // NOTICE: This works for two visualizations merged
                const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = analyticsResponses;
                const latestAvailableYearByCountryId = latestAvailableYear
                    ? isMultipleVisualizations
                        ? getLatestAvailableYearByCountryIdFromTwoCharts(
                              firstChartAnalyticsResponse?.rows || [],
                              secondChartAnalyticsResponse?.rows || []
                          )
                        : getLastAvailableYearByCountry(firstChartAnalyticsResponse?.rows || [])
                    : undefined;

                const dataRowsAndBreakInSeriesDescriptions = analyticsResponses.map(analyticsResponse => {
                    return this.getDataRowsAndBreakInSeriesDescriptions(
                        mergedVisualization,
                        analyticsResponse,
                        metadata,
                        orgUnits,
                        seriesIdAndName,
                        latestAvailableYearByCountryId
                    );
                });

                const dataRowsMerged = dataRowsAndBreakInSeriesDescriptions.reduce(
                    (acc: string[][], { dataRows }, index) => {
                        // Get header row from first one only
                        return index === 0 ? [...acc, ...dataRows] : [...acc, ...dataRows.slice(1)];
                    },
                    []
                );

                const headerRow = dataRowsMerged[0] || [];
                const dataRowsWithoutHeader = dataRowsMerged.slice(1);

                const sortedDataRowsWithoutHeader = isMultipleVisualizations
                    ? this.sortDataRows(headerRow, dataRowsWithoutHeader)
                    : dataRowsWithoutHeader;

                // TODO: review if this works for multiple visualizations merged
                const allBreakInSeriesDescriptions = dataRowsAndBreakInSeriesDescriptions.reduce(
                    (acc: string[][], { breakInSeriesDescriptions }) => {
                        return [...acc, ...breakInSeriesDescriptions];
                    },
                    []
                );

                const chartName = `${mergedVisualization.categoryName}: ${mergedVisualization.friendlyName}`;

                const tabs = [
                    { name: "Notes", data: [[mergedVisualization.notes || ""], ...allBreakInSeriesDescriptions] },
                    {
                        name: "Data",
                        data: [[chartName || mergedVisualization.name], headerRow, ...sortedDataRowsWithoutHeader],
                    },
                ];

                if (tabs.length > 0) {
                    exportToCSV(
                        tabs,
                        mergedVisualization.downloadedFileName
                            ? `${mergedVisualization.categoryName}: ${mergedVisualization.downloadedFileName}`
                            : chartName
                    );
                }
                return Future.success(undefined);
            });
        });
    }

    private sortDataRows(headerRow: string[], dataRowsWithoutHeader: string[][]): string[][] {
        const countryIndexInHeader = headerRow.findIndex(header => header === "Country");
        const yearIndexInHeader = headerRow.findIndex(header => header === "Year");

        const sortDataRowsWithoutHeaderByYear = yearIndexInHeader
            ? dataRowsWithoutHeader.sort((rowA, rowB) => {
                  const yearA = rowA[yearIndexInHeader] ? rowA[yearIndexInHeader]?.toLowerCase() : "";
                  const yearB = rowB[yearIndexInHeader] ? rowB[yearIndexInHeader]?.toLowerCase() : "";

                  if (yearA && yearB) {
                      return yearA < yearB ? -1 : 1;
                  } else {
                      return 0;
                  }
              })
            : dataRowsWithoutHeader;

        return countryIndexInHeader
            ? sortDataRowsWithoutHeaderByYear.sort((rowA, rowB) => {
                  const countryA = rowA[countryIndexInHeader] ? rowA[countryIndexInHeader]?.toLowerCase() : "";
                  const countryB = rowB[countryIndexInHeader] ? rowB[countryIndexInHeader]?.toLowerCase() : "";

                  if (countryA && countryB) {
                      return countryA < countryB ? -1 : 1;
                  } else {
                      return 0;
                  }
              })
            : sortDataRowsWithoutHeaderByYear;
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

    private getDataRowsAndBreakInSeriesDescriptions(
        visualization: Visualization,
        analyticsResponse: Analytics,
        metadata: Metadata,
        orgUnits: NonPaginatedObjects<{ id: string } & { shortName: string }>,
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[],
        lastAvailableYearByCountry?: Record<string, string>
    ): { breakInSeriesDescriptions: string[][]; dataRows: string[][] } {
        const filteredAnalyticsResponse = lastAvailableYearByCountry
            ? {
                  ...analyticsResponse,
                  rows: filterRowsByYearInCountry(analyticsResponse.rows, lastAvailableYearByCountry),
              }
            : analyticsResponse;

        const dataRows = this.createDataRows(
            visualization,
            filteredAnalyticsResponse,
            orgUnits,
            metadata,
            seriesIdAndName
        );

        const orgUnitsInChart = this.getOrgUnitsInChart(
            metadata.organisationUnits,
            orgUnits,
            filteredAnalyticsResponse.metaData.dimensions
        );

        const breakInSeriesDescriptions = this.getBreakInSeriesDescription(
            filteredAnalyticsResponse,
            orgUnitsInChart,
            visualization.breakInSeries
        );

        return { breakInSeriesDescriptions, dataRows };
    }

    private getOrgUnitsInChart(
        metadataOrganisationUnits: Maybe<{ id: string; name: string; shortName: string }[]>,
        orgUnits: NonPaginatedObjects<{ id: string } & { shortName: string }>,
        metaDataDimensions: Analytics["metaData"]["dimensions"]
    ): { id: string; shortName: string }[] {
        if (metadataOrganisationUnits) {
            return metadataOrganisationUnits;
        }

        const orgUnitIds: Maybe<Id[]> = metaDataDimensions.ou;
        return orgUnits.objects.filter(orgUnit => orgUnitIds?.includes(orgUnit.id));
    }

    private getBreakInSeriesDescription(
        analytics: Analytics,
        organisationUnits: Maybe<
            {
                id: string;
                shortName: string;
            }[]
        >,
        visualizationBreakInSeries: Maybe<VisualizationBreakInSeries>
    ): string[][] {
        const yearIndexColumn = analytics.headers.findIndex(header => header.name === "pe");

        const allYearsInDataRows = analytics.rows.reduce((years, row) => {
            if (yearIndexColumn) {
                const year = row[yearIndexColumn];
                return year && !years.includes(year) ? [...years, year] : years;
            }

            return years;
        }, []);

        return (organisationUnits || [])
            .map(orgUnit => {
                const description = getBreakInSeriesCountryDescription(
                    visualizationBreakInSeries,
                    allYearsInDataRows,
                    orgUnit.id
                );

                if (description) {
                    return [`${mapToWhoCountryName(orgUnit.id, orgUnit.shortName || "")}: ${description}`];
                }

                return [""];
            })
            .filter(description => description[0] !== "");
    }

    private createDataRows(
        visualization: Visualization,
        analyticsResponse: Analytics,
        orgUnits: NonPaginatedObjects<{ id: string } & { shortName: string }>,
        metadata: Metadata,
        seriesIdAndName: { id: string | undefined; name: string | undefined }[]
    ) {
        const columns = analyticsResponse.headers.map(header => {
            const headerNamesInVisualization = HEADER_NAMES_BY_VISUALIZATION[visualization.id];
            const headerName = headerNamesInVisualization?.[header.name];

            if (headerName) {
                return headerName;
            }

            if (SERVICE_PRIMARY_NAME_COLUMN === header.name) {
                return "Parameter";
            }

            const defaultHeaderNames = HEADER_NAMES_BY_VISUALIZATION.default;
            const defaultName = defaultHeaderNames ? defaultHeaderNames[header.name] : undefined;

            return defaultName ?? header.column.charAt(0).toUpperCase() + header.column.slice(1).toLowerCase();
        });

        const existsCountryColumn = columns.includes("Country");
        const addCountryColumn = !existsCountryColumn && orgUnits.objects.length === 1;

        const finalColumns = addCountryColumn ? ["Country", ...columns] : columns;

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

        const dataRowsWithCountryIfRequired = mappedRows.map(row => {
            if (addCountryColumn) {
                const country = orgUnits.objects[0];
                const countryName = country ? mapToWhoCountryName(country.id, country.shortName || "") : "";
                return [countryName, ...row];
            }
            return row;
        });

        const sortedDataRows = visualization.sortDataRowsInExcel
            ? visualization.sortDataRowsInExcel(finalColumns, dataRowsWithCountryIfRequired)
            : dataRowsWithCountryIfRequired;

        return [finalColumns, ...sortedDataRows];
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
            return mapToWhoCountryName(id, orgUnit?.shortName || "");
        } else {
            const objects = Object.values(restMetadata).flat();

            const metadataObject = objects.find(object => object.id === id);

            return metadataObject?.name.replace("UHCW_", "") || "";
        }
    }

    extractMetadataIds(analyticsResponseRows: string[][]) {
        return _.uniq(
            analyticsResponseRows
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
