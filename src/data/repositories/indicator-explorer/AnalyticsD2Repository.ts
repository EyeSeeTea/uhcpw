import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics, AnalyticsMetadataItem } from "../../../domain/entities/indicator-explorer/Analytics";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { Id, Ref } from "../../../domain/entities/Ref";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { isValidUid } from "../../../utils/uid";
import { exportToCSV, exportToCSVIncludingChart, Tab } from "../../export/exportToCSV";
import { fetchData } from "./analytics/fetchData";
import { D2Visualization } from "./VisualizationD2Repository";
import { getCustomCellName } from "./utils/getCustomCellName";
import { mapToWhoCountryCode, mapToWhoCountryName } from "../countries/mapToWhoCountryData";
import {
    getBreakInSeriesCountryDescription,
    VisualizationBreakInSeries,
} from "../../../domain/entities/indicator-explorer/BreakInSeries";
import { Maybe } from "../../../types/utils";
import {
    filterRowsByYearInCountry,
    filterRowsByYearIndicatorAndCountry,
    getCommonLastAvailableYearInTwoDataIds,
    getLastAvailableYearByCountry,
    getLatestAvailableYearByCountryIdFromTwoCharts,
} from "./utils/lastAvailableYearHelpers";
import { DataStoreClient } from "../../DataStoreClient";
import { ChartFileTemplateIdsByVisualization } from "../../../domain/entities/ChartFileTemplateIdsByVisualization";
import { visualizationsExportedDataChartBuilder } from "../../export/data-chart-builder/visualizationsExportedDataChartBuilder";
import { getVisualizationTemplate } from "./visualization-template/getVisualizationTemplate";
import { ORG_UNIT_GROUP_IDS, ORG_UNIT_IDS, Region } from "../../../domain/entities/region/Region";
import { getYearByIndicatorAndCountry } from "../../../webapp/components/visualization/manual/chart_kIpnMBaBvZ9_Options";
import { filterZeroValuesAnalytics } from "../../../domain/entities/indicator-explorer/utils/filterZeroValuesAnalytics";
import { ceilAnalyticsRows } from "./utils/ceilAnalyticsRows";
import { PolicyExplorerChartData } from "../../../domain/entities/indicator-explorer/PolicyExplorerChartData";
import {
    POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT,
    POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE,
} from "./PolicyExplorerChartDataD2Repository";
import { getRegionCodeById } from "../regions/utils";
import { COUNTRY_AREA_COLUMN, INDICATOR_COLUMN, PARAMETER_COLUMN, YEAR_COLUMN } from "./utils/sortColumnsAndDataRows";

const SERVICE_PRIMARY_NAME_COLUMN = "GgAVGT9wRCM";
export const DATA_TAB_NAME = "Data";
export const NOTES_TAB_NAME = "Notes";

const HEADER_NAMES_BY_VISUALIZATION: Record<string, Record<string, string>> = {
    z6nPPMMbOw5: {
        dx: "Financing scheme",
        [SERVICE_PRIMARY_NAME_COLUMN]: "Type of care",
    },
    EtHaEt6bnm5_nlYSkEMZxgN: {
        yooLFrJORoj: INDICATOR_COLUMN,
    },
    AophAEpx5e0_BOcLONPSyYS: {
        yooLFrJORoj: INDICATOR_COLUMN,
    },
    default: {
        ou: COUNTRY_AREA_COLUMN,
        pe: YEAR_COLUMN,
        dx: INDICATOR_COLUMN,
    },
};

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api, private d2DataEngine: unknown, private dataStoreClient: DataStoreClient) {}

    public get(
        visualization: Visualization,
        periods: string[],
        countryIds: Id[],
        regions: Region[]
    ): FutureData<Analytics> {
        const periodChunks = _.chunk(periods, 10);

        if (periodChunks.length === 0) {
            return Future.error("No periods provided");
        }

        if (periodChunks.length === 1) {
            return this.fetchAnalytics(countryIds, visualization, periods, regions);
        }

        return this.fetchAnalyticsByPeriodChunks(countryIds, visualization, periodChunks, regions);
    }

    private fetchAnalyticsByPeriodChunks(
        countryIds: Id[],
        visualization: Visualization,
        periodChunks: string[][],
        regions: Region[]
    ): FutureData<Analytics> {
        if (periodChunks.length === 0) {
            return Future.error("No periods provided");
        }

        const $analytics = periodChunks.map(periodChunk =>
            this.fetchAnalytics(countryIds, visualization, periodChunk, regions)
        );

        return Future.parallel($analytics, { maxConcurrency: 3 }).map(results =>
            results.reduce((acc, analytics) => this.mergeAnalytics(acc, analytics))
        );
    }

    private fetchAnalytics(
        baseOrgUnitIds: Id[],
        visualization: Visualization,
        periods: string[],
        regions: Region[]
    ): FutureData<Analytics> {
        // If the visualization uses org unit regions, we need to return the org unit ids instead of group ids
        const orgUnitIds = visualization.isOrgUnitRegions
            ? regions.reduce<Id[]>((acc, region) => {
                  return region.linkedOrgUnitId ? [...acc, region.linkedOrgUnitId] : acc;
              }, baseOrgUnitIds)
            : baseOrgUnitIds;

        const orgUnitGroupIds = visualization.isOrgUnitGroupRegions ? regions.map(region => region.id) : [];

        const overwrittenVisualization = {
            ...visualization,
            columns: this.getDimensions(visualization, "columns", orgUnitIds, orgUnitGroupIds, periods),
            rows: this.getDimensions(visualization, "rows", orgUnitIds, orgUnitGroupIds, periods),
            filters: this.getDimensions(visualization, "filters", orgUnitIds, orgUnitGroupIds, periods),
        } as unknown as D2Visualization;
        //const overwrittenVisualization = visualization as unknown as D2Visualization;

        return Future.fromPromise(fetchData(this.d2DataEngine, overwrittenVisualization, {}))
            .flatMap(response => {
                const analyticsResponse = response.responses[0] as Analytics;

                if (!analyticsResponse) {
                    return Future.error<string, Analytics>("No data found");
                }

                const analytics = visualization.needsRounding
                    ? {
                          ...analyticsResponse,
                          rows: ceilAnalyticsRows(analyticsResponse),
                      }
                    : analyticsResponse;

                return Future.success(analytics);
            })
            .flatMapError(error => {
                console.error(error);
                return Future.error("An error has ocurred feching data from analytics");
            });
    }

    private mergeAnalytics(analyticsA: Analytics, analyticsB: Analytics): Analytics {
        const headers = analyticsA.headers;

        const items: Record<string, AnalyticsMetadataItem> = {
            ...analyticsA.metaData.items,
            ...analyticsB.metaData.items,
        };

        const dimensionKeys = Array.from(
            new Set([...Object.keys(analyticsA.metaData.dimensions), ...Object.keys(analyticsB.metaData.dimensions)])
        );

        const dimensions = dimensionKeys.reduce<Record<string, string[]>>((acc, key) => {
            const valuesFromA = analyticsA.metaData.dimensions[key] ?? [];
            const valuesFromB = analyticsB.metaData.dimensions[key] ?? [];

            return {
                ...acc,
                [key]: [...new Set([...valuesFromA, ...valuesFromB])],
            };
        }, {});

        const rows = [...(analyticsA.rows ?? []), ...(analyticsB.rows ?? [])];

        return {
            headers,
            metaData: {
                items,
                dimensions,
            },
            rows,
        };
    }

    saveToFile(params: {
        visualizations: Visualization[];
        allPolicyExplorerChartData: PolicyExplorerChartData[][] | undefined;
        periods: string[];
        countryIds: Id[];
        selectedRegions: Region[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        isLatestAvailableYear: boolean;
        isUpTo2019: boolean;
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
        maxYearToFilterBy?: string;
    }): FutureData<void> {
        const {
            visualizations,
            allPolicyExplorerChartData,
            periods,
            countryIds,
            selectedRegions,
            seriesIdAndName,
            isLatestAvailableYear,
            isUpTo2019,
            isScatter,
            xAxis,
            yAxis,
            maxYearToFilterBy,
        } = params;

        return Future.parallel(
            visualizations.map(visualization => this.get(visualization, periods, countryIds, selectedRegions))
        ).flatMap(analyticsResponses => {
            const visualization = visualizations[0];
            const needsToFilterZeroValues = visualization?.needsToFilterZeroValues;

            const filteredAnalytics = needsToFilterZeroValues
                ? filterZeroValuesAnalytics(analyticsResponses)
                : analyticsResponses;

            const analyticsResponseRows = filteredAnalytics.reduce((acc: string[][], analyticsResponse) => {
                return [...acc, ...analyticsResponse.rows];
            }, []);
            const metadataIds = this.extractMetadataIds(analyticsResponseRows);
            const orgUnitGroupRegionIds: Id[] = selectedRegions.map(r => r.id);
            const orgUnitRegionIds: Id[] = selectedRegions.map(r => r.linkedOrgUnitId).filter((id): id is Id => !!id);

            return Future.joinObj({
                analyticsResponses: Future.success(filteredAnalytics),
                metadata: apiToFuture(
                    this.api.get<Metadata>("/metadata", {
                        fields: "id,shortName,name",
                        filter: "id:in:[" + metadataIds.join(",") + "]",
                    })
                ),
                orgUnitsResponse: apiToFuture(
                    this.api.models.organisationUnits.get({
                        fields: organisationUnitsFields,
                        paging: false,
                        filter: { id: { in: [...countryIds, ...orgUnitRegionIds] } },
                    })
                ),
                orgUnitGroupsResponse: apiToFuture(
                    this.api.models.organisationUnitGroups.get({
                        fields: organisationUnitGroupsFields,
                        paging: false,
                        filter: { id: { in: orgUnitGroupRegionIds } },
                    })
                ),
            }).flatMap(({ analyticsResponses, metadata, orgUnitsResponse, orgUnitGroupsResponse }) => {
                const orgUnits: D2OrgUnit[] = this.addRegionCodesToOrgUnit(orgUnitsResponse.objects);
                const orgUnitGroups: D2OrgUnitGroup[] = this.addRegionCodesToOrgUnitGroup(
                    orgUnitGroupsResponse.objects
                );

                const mergedVisualization = this.mergeVisualizations(visualizations);

                const isMultipleVisualizations = mergedVisualization.id.includes("_");

                const policyExplorerChartData = visualization?.needPolicyExplorerChartData
                    ? isMultipleVisualizations
                        ? allPolicyExplorerChartData?.flat()
                        : allPolicyExplorerChartData?.[0]
                    : undefined;

                // NOTICE: This works for two visualizations merged
                const [firstChartAnalyticsResponse, secondChartAnalyticsResponse] = analyticsResponses;

                // Some charts don't have years in rows but we still want latest available years filter
                const isRowsContainsYears =
                    firstChartAnalyticsResponse?.rows[0] &&
                    firstChartAnalyticsResponse?.rows[0][2]?.match(/^(20)\d{2}$/);

                const latestAvailableYearByCountryId =
                    (isLatestAvailableYear || isUpTo2019) && isRowsContainsYears
                        ? this.getLatestAvailableYearByCountryId({
                              visualizationIds: isMultipleVisualizations
                                  ? mergedVisualization.id.split("_")
                                  : [mergedVisualization.id],
                              isUpTo2019,
                              isMultipleVisualizations,
                              isScatter,
                              xAxis,
                              yAxis,
                              firstChartAnalyticsRows: firstChartAnalyticsResponse?.rows || [],
                              secondChartAnalyticsRows: secondChartAnalyticsResponse?.rows || [],
                              policyExplorerChartData: policyExplorerChartData,
                              maxYearToFilterBy: maxYearToFilterBy,
                          })
                        : undefined;

                const yearByIndicatorAndCountry =
                    mergedVisualization.id === "kIpnMBaBvZ9" && xAxis && yAxis
                        ? getYearByIndicatorAndCountry(
                              firstChartAnalyticsResponse?.rows || [],
                              xAxis,
                              yAxis,
                              isUpTo2019
                          )
                        : undefined;

                const yearsWithData = mergedVisualization.getYearsWithData
                    ? analyticsResponses.reduce((acc: string[], response): string[] => {
                          const filteredYears = mergedVisualization.getYearsWithData?.(response.rows) || [];
                          return [...acc, ...filteredYears];
                      }, [])
                    : undefined;

                const dataRowsAndBreakInSeriesDescriptions = analyticsResponses.map(analyticsResponse => {
                    return this.getDataRowsAndBreakInSeriesDescriptions({
                        visualization: mergedVisualization,
                        analyticsResponse,
                        metadata,
                        orgUnits,
                        orgUnitGroups: orgUnitGroups,
                        seriesIdAndName,
                        latestAvailableYearByCountryId,
                        yearByIndicatorAndCountry,
                        policyExplorerChartData: policyExplorerChartData,
                        yearsWithData: yearsWithData,
                    });
                });

                const dataRowsMerged = dataRowsAndBreakInSeriesDescriptions.reduce(
                    (acc: string[][], { dataRows }, index) => {
                        // Get header row from first one only
                        return index === 0 ? [...acc, ...dataRows] : [...acc, ...dataRows.slice(1)];
                    },
                    []
                );

                const allRows = [dataRowsMerged[0] || [], ...dataRowsMerged.slice(1)];
                const allRowsSorted = this.sortColumnsAndDataRows(allRows, mergedVisualization);

                // TODO: review if this works for multiple visualizations merged
                const allBreakInSeriesDescriptions = dataRowsAndBreakInSeriesDescriptions.reduce(
                    (acc: string[][], { breakInSeriesDescriptions }) => {
                        return [...acc, ...breakInSeriesDescriptions];
                    },
                    []
                );

                const hasCustomExportBuilder =
                    visualizationsExportedDataChartBuilder[mergedVisualization.id] !== undefined;

                // only add code prefix to year for default sheets, excluding custom exports
                const allRowsWithYearColumn =
                    mergedVisualization.showYearInDownloadFile && periods.length === 1 && periods[0]
                        ? this.addYearColumnIfMissing(
                              allRowsSorted,
                              periods[0],
                              orgUnits,
                              orgUnitGroups,
                              !hasCustomExportBuilder
                          )
                        : allRowsSorted;

                // only force indicator column for default sheets, excluding custom exports
                const allRowsSortedToDownload = hasCustomExportBuilder
                    ? allRowsWithYearColumn
                    : this.addIndicatorColumnIfMissing({
                          visualization: mergedVisualization,
                          rows: allRowsWithYearColumn,
                      });

                const chartName = `${mergedVisualization.categoryName}: ${mergedVisualization.friendlyName}`;

                const tabs = [
                    {
                        name: NOTES_TAB_NAME,
                        data: [[mergedVisualization.notes || ""], ...allBreakInSeriesDescriptions],
                    },
                    {
                        name: DATA_TAB_NAME,
                        data: [[chartName || mergedVisualization.name], ...allRowsSortedToDownload],
                    },
                ];

                if (tabs.length > 0) {
                    return this.exportChart({
                        mergedVisualization: mergedVisualization,
                        tabs: tabs,
                        chartName: chartName,
                        orgUnits: orgUnits,
                        orgUnitGroups: orgUnitGroups,
                    });
                }
                return Future.success(undefined);
            });
        });
    }

    private addRegionCodesToOrgUnit(orgUnits: D2OrgUnit[]): D2OrgUnit[] {
        const regionOrgUnitIds: Set<Id> = new Set(Object.values(ORG_UNIT_IDS));
        const regionCodeById = getRegionCodeById(ORG_UNIT_IDS);

        return orgUnits.map(orgUnit => {
            if (regionOrgUnitIds.has(orgUnit.id)) {
                const code = regionCodeById.get(orgUnit.id);
                return code ? { ...orgUnit, code } : orgUnit;
            } else {
                return orgUnit;
            }
        });
    }

    private addRegionCodesToOrgUnitGroup(orgUnitGroups: D2OrgUnitGroup[]): D2OrgUnitGroup[] {
        const regionOrgUnitGroupIds: Set<Id> = new Set(Object.values(ORG_UNIT_GROUP_IDS));
        const regionCodeById = getRegionCodeById(ORG_UNIT_GROUP_IDS);

        return orgUnitGroups.map(orgUnitGroup => {
            if (regionOrgUnitGroupIds.has(orgUnitGroup.id)) {
                const code = regionCodeById.get(orgUnitGroup.id);
                return code ? { ...orgUnitGroup, code } : orgUnitGroup;
            } else {
                return orgUnitGroup;
            }
        });
    }

    private exportChart(params: {
        mergedVisualization: Visualization;
        tabs: Tab[];
        chartName: Maybe<string>;
        orgUnits: D2OrgUnit[];
        orgUnitGroups: D2OrgUnitGroup[];
    }): FutureData<void> {
        const { mergedVisualization, tabs, chartName, orgUnits, orgUnitGroups } = params;
        const exportedDataChartBuilder = visualizationsExportedDataChartBuilder[mergedVisualization.id];

        if (exportedDataChartBuilder) {
            // custom exporter still expects "Parameter"
            // Rename at this boundary to preserve their contract.
            const tabsForCustomBuilder = renameIndicatorHeaderToParameter(tabs);

            return getVisualizationTemplate(this.api, mergedVisualization.id)
                .flatMap(templateArrayBuffer => {
                    try {
                        const tabsWithChart = exportedDataChartBuilder(
                            tabsForCustomBuilder,
                            chartName || mergedVisualization.name,
                            orgUnits,
                            orgUnitGroups
                        );

                        exportToCSVIncludingChart({
                            chartId: mergedVisualization.id,
                            tabs: tabsWithChart,
                            templateArrayBuffer: templateArrayBuffer,
                            fileName: mergedVisualization.downloadedFileName
                                ? `${mergedVisualization.categoryName}: ${mergedVisualization.downloadedFileName}`
                                : chartName || mergedVisualization.name,
                        });
                    } catch (error) {
                        console.error("Error creating exported data for chart: ", error);

                        exportToCSV(tabsForCustomBuilder, chartName || mergedVisualization.name);
                    }
                    return Future.success(undefined);
                })
                .flatMapError(error => {
                    console.error("Error while downloading chart template: ", error);
                    const tabsWithChart = exportedDataChartBuilder(
                        tabsForCustomBuilder,
                        chartName || mergedVisualization.name,
                        orgUnits,
                        orgUnitGroups
                    );
                    exportToCSV(tabsWithChart, chartName || mergedVisualization.name);
                    return Future.success(undefined);
                });
        } else {
            console.error("Exported data chart builder not found for visualization: ", mergedVisualization.id);

            exportToCSV(tabs, chartName || mergedVisualization.name);
            return Future.success(undefined);
        }
    }

    private addYearColumnIfMissing(
        dataRows: string[][],
        period: string,
        orgUnits: D2OrgUnit[],
        orgUnitGroups: D2OrgUnitGroup[],
        includeCountryCodePrefix: boolean
    ): string[][] {
        const [header = [], ...restRows] = dataRows;
        if (header.includes(YEAR_COLUMN)) return dataRows;

        const countryAreaIndex = header.indexOf(COUNTRY_AREA_COLUMN);
        const insertAt = countryAreaIndex + 1;
        const codeByCountryName = includeCountryCodePrefix
            ? buildCodeByCountryName(orgUnits, orgUnitGroups)
            : undefined;

        const buildYearCell = (row: string[]): string => {
            const prefix = codeByCountryName?.get(row[countryAreaIndex] ?? "");
            return prefix ? `${prefix} ${period}` : period;
        };

        return [
            insertArrayAt(header, insertAt, YEAR_COLUMN),
            ...restRows.map(row => insertArrayAt(row, insertAt, buildYearCell(row))),
        ];
    }

    private sortColumnsAndDataRows(allRows: string[][], visualization: Visualization): string[][] {
        const columnsRow = allRows[0] || [];
        const dataRows = allRows.slice(1);

        const sortedColumnsRow = visualization.sortColumns ? visualization.sortColumns(columnsRow) : columnsRow;

        const newColumnsIndexOrder = sortedColumnsRow.map(header => columnsRow.indexOf(header));

        const sortedDataRowsAccordingColumns: Array<string[]> = dataRows.map(row =>
            _.compact(newColumnsIndexOrder.map(index => row[index]))
        );

        const sortedDataRows = visualization.sortDataRows
            ? visualization.sortDataRows(sortedColumnsRow, sortedDataRowsAccordingColumns)
            : sortedDataRowsAccordingColumns;

        return [sortedColumnsRow, ...sortedDataRows];
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

    private getDataRowsAndBreakInSeriesDescriptions(params: {
        visualization: Visualization;
        analyticsResponse: Analytics;
        metadata: Metadata;
        orgUnits: D2OrgUnit[];
        orgUnitGroups: D2OrgUnitGroup[];
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        latestAvailableYearByCountryId?: Record<string, string>;
        yearByIndicatorAndCountry:
            | Record<
                  string,
                  {
                      xYears: string;
                      yYears: string;
                  }
              >
            | undefined;
        policyExplorerChartData?: PolicyExplorerChartData[];
        yearsWithData?: string[];
    }): { breakInSeriesDescriptions: string[][]; dataRows: string[][] } {
        const {
            visualization,
            analyticsResponse,
            metadata,
            orgUnits,
            orgUnitGroups,
            seriesIdAndName,
            latestAvailableYearByCountryId,
            yearByIndicatorAndCountry,
            policyExplorerChartData,
            yearsWithData,
        } = params;

        const filteredAnalyticsResponse = this.filterAnalyticsResponse(
            analyticsResponse,
            visualization,
            latestAvailableYearByCountryId,
            yearByIndicatorAndCountry
        );

        const dataRows = this.createDataRows({
            visualization,
            analyticsResponse: filteredAnalyticsResponse,
            orgUnits,
            orgUnitGroups: orgUnitGroups,
            metadata,
            seriesIdAndName,
            policyExplorerChartData: policyExplorerChartData,
            yearsWithData: yearsWithData,
        });

        const orgUnitsInChart = this.getOrgUnitsInChart({
            metadataOrganisationUnits: metadata.organisationUnits,
            orgUnits: orgUnits,
            metaDataDimensions: filteredAnalyticsResponse.metaData.dimensions,
        });

        const breakInSeriesDescriptions = this.getBreakInSeriesDescription(
            filteredAnalyticsResponse,
            orgUnitsInChart,
            visualization.breakInSeries
        );

        return { breakInSeriesDescriptions, dataRows };
    }

    private filterAnalyticsResponse(
        analyticsResponse: Analytics,
        visualization: Visualization,
        latestAvailableYearByCountryId?: Record<string, string>,
        yearByIndicatorAndCountry?: Record<
            string,
            {
                xYears: string;
                yYears: string;
            }
        >
    ): Analytics {
        const { xAxis, yAxis, hasCustomFilterXAxisAndYAxisByLastAvailableYear } = visualization;

        if (latestAvailableYearByCountryId && !hasCustomFilterXAxisAndYAxisByLastAvailableYear) {
            return {
                ...analyticsResponse,
                rows: filterRowsByYearInCountry(analyticsResponse.rows, latestAvailableYearByCountryId),
            };
        } else if (yearByIndicatorAndCountry && xAxis && yAxis && hasCustomFilterXAxisAndYAxisByLastAvailableYear) {
            const rows = filterRowsByYearIndicatorAndCountry(
                analyticsResponse.rows,
                xAxis,
                yAxis,
                yearByIndicatorAndCountry
            );

            return {
                ...analyticsResponse,
                rows: rows,
            };
        } else {
            return analyticsResponse;
        }
    }

    private getOrgUnitsInChart(params: {
        metadataOrganisationUnits: Maybe<{ id: string; name: string; shortName: string }[]>;
        orgUnits: D2OrgUnit[];
        metaDataDimensions: Analytics["metaData"]["dimensions"];
    }): { id: string; shortName: string }[] {
        const { metadataOrganisationUnits, orgUnits, metaDataDimensions } = params;
        if (metadataOrganisationUnits) {
            return metadataOrganisationUnits;
        }

        const orgUnitIds: Maybe<Id[]> = metaDataDimensions.ou;
        return orgUnits.filter(orgUnit => orgUnitIds?.includes(orgUnit.id));
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

    private createDataRows(params: {
        visualization: Visualization;
        analyticsResponse: Analytics;
        orgUnits: D2OrgUnit[];
        orgUnitGroups: D2OrgUnitGroup[];
        metadata: Metadata;
        seriesIdAndName: { id: string | undefined; name: string | undefined }[];
        policyExplorerChartData?: PolicyExplorerChartData[];
        yearsWithData?: string[];
    }): string[][] {
        const {
            visualization,
            analyticsResponse,
            orgUnits,
            orgUnitGroups,
            metadata,
            seriesIdAndName,
            policyExplorerChartData,
            yearsWithData,
        } = params;

        const columns = analyticsResponse.headers.map(header => {
            const headerNamesInVisualization = HEADER_NAMES_BY_VISUALIZATION[visualization.id];
            const headerName = headerNamesInVisualization?.[header.name];

            if (headerName) {
                return headerName;
            }

            if (SERVICE_PRIMARY_NAME_COLUMN === header.name) {
                return PARAMETER_COLUMN;
            }

            const defaultHeaderNames = HEADER_NAMES_BY_VISUALIZATION.default;
            const defaultName = defaultHeaderNames ? defaultHeaderNames[header.name] : undefined;

            return defaultName ?? header.column.charAt(0).toUpperCase() + header.column.slice(1).toLowerCase();
        });

        const existsCountryColumn = columns.includes(COUNTRY_AREA_COLUMN);
        const addCountryOrAreaColumn = !existsCountryColumn && (orgUnits.length === 1 || orgUnitGroups.length === 1);

        const finalColumns = addCountryOrAreaColumn ? [COUNTRY_AREA_COLUMN, ...columns] : columns;

        const hasCustomExportBuilder = visualizationsExportedDataChartBuilder[visualization.id] !== undefined;
        // only add code prefix to year for default sheets, excluding custom exports
        const rowsForMapping = hasCustomExportBuilder
            ? analyticsResponse.rows
            : this.addCountryCodeToYearInRows({
                  rows: analyticsResponse.rows,
                  headers: analyticsResponse.headers,
                  orgUnits,
                  orgUnitGroups,
                  addCountryOrAreaColumn,
              });

        const mappedRows = _(
            this.mapAnalyticsResponseRows({
                rows: rowsForMapping,
                metadata,
                visualizationId: visualization.id,
                seriesIdAndName,
                getRowWithDataName: visualization.getRowWithDataName,
                policyExplorerChartData: policyExplorerChartData,
                yearsWithData: yearsWithData,
            })
        )
            .sortBy(row => row[1])
            .value();

        const dataRowsWithCountryIfRequired = mappedRows.map(row => {
            if (addCountryOrAreaColumn) {
                const countryOrArea = orgUnits.length === 1 ? orgUnits[0] : orgUnitGroups[0];
                const countryName = countryOrArea
                    ? mapToWhoCountryName(countryOrArea.id, countryOrArea.shortName || "")
                    : "Country or area not found";
                return [countryName, ...row];
            }
            return row;
        });

        return [finalColumns, ...dataRowsWithCountryIfRequired];
    }

    private addCountryCodeToYearInRows(params: {
        rows: string[][];
        headers: Analytics["headers"];
        orgUnits: D2OrgUnit[];
        orgUnitGroups: D2OrgUnitGroup[];
        addCountryOrAreaColumn: boolean;
    }): string[][] {
        const { rows, headers, orgUnits, orgUnitGroups, addCountryOrAreaColumn } = params;

        const peIndex = headers.findIndex(h => h.name === "pe");
        if (peIndex < 0) return rows;

        const ouIndex = headers.findIndex(h => h.name === "ou");
        const codeById = buildCodeById(orgUnits, orgUnitGroups);
        const fallbackCode = addCountryOrAreaColumn ? this.getSingleEntityCode(orgUnits, orgUnitGroups) : undefined;

        return rows.map(row => {
            const prefix = ouIndex >= 0 ? codeById.get(row[ouIndex] ?? "") : fallbackCode;
            if (!prefix || !row[peIndex]) return row;
            return row.map((cell, i) => (i === peIndex ? `${prefix} ${cell}` : cell));
        });
    }

    private getSingleEntityCode(orgUnits: D2OrgUnit[], orgUnitGroups: D2OrgUnitGroup[]): string | undefined {
        const entity = orgUnits[0] ?? orgUnitGroups[0];
        return entity?.code ? mapToWhoCountryCode(entity.code) : undefined;
    }

    private addIndicatorColumnIfMissing(params: { visualization: Visualization; rows: string[][] }): string[][] {
        const { visualization, rows } = params;
        const [headerRow, ...dataRows] = rows;
        if (!headerRow || headerRow.includes(INDICATOR_COLUMN)) return rows;

        const indicatorName = resolveFilterDxName(visualization);
        if (!indicatorName) return rows;

        return [[INDICATOR_COLUMN, ...headerRow], ...dataRows.map(row => [indicatorName, ...row])];
    }

    mapAnalyticsResponseRows(params: {
        rows: Array<string[]>;
        metadata: Metadata;
        visualizationId: Id;
        seriesIdAndName: {
            id: string | undefined;
            name: string | undefined;
        }[];
        getRowWithDataName?: (
            row: string[],
            metadata: Metadata,
            policyExplorerChartData?: PolicyExplorerChartData[]
        ) => string[];
        policyExplorerChartData?: PolicyExplorerChartData[];
        yearsWithData?: string[];
    }): string[][] {
        const {
            rows,
            metadata,
            visualizationId,
            seriesIdAndName,
            getRowWithDataName,
            policyExplorerChartData,
            yearsWithData,
        } = params;
        const filteredRows: string[][] = yearsWithData
            ? rows.filter(row => row[1] && yearsWithData.includes(row[1]))
            : rows;

        return filteredRows.map(row => {
            return getRowWithDataName
                ? getRowWithDataName(row, metadata, policyExplorerChartData)
                : row.map((cell): string => {
                      if (isValidUid(cell)) {
                          return (
                              getCustomCellName(visualizationId, seriesIdAndName, cell) ||
                              this.getNameFromMetadata(cell, metadata)
                          );
                      } else {
                          return seriesIdAndName.find(({ id }) => id === cell)?.name ?? cell;
                      }
                  });
        });
    }

    private getNameFromMetadata(id: string, metadata: Metadata): string {
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

    private extractMetadataIds(analyticsResponseRows: string[][]) {
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
        orgUnitIds: Id[],
        orgUnitGroupIds: Id[],
        periods?: string[]
    ): ItemRef[] | undefined => {
        const dimensionsOuInVisualization = visualization[prop].filter(vd => vd.id === "ou");
        const dimensionsPeInVisualization = visualization[prop].filter(vd => vd.id === "pe");
        const dimensionsDxInVisualization = visualization[prop].filter(vd => vd.id === "dx");
        const others = visualization[prop].filter(vd => vd.id !== "dx" && vd.id !== "pe" && vd.id !== "ou");
        const orgUnitItems = [
            ...orgUnitIds?.map(orgUnitId => ({ id: orgUnitId })),
            ...orgUnitGroupIds.map(orgUnitGroupId => ({ id: orgUnitGroupId })),
        ];

        const orgUnitGroupRegionItems = orgUnitGroupIds.map(id => ({ id: `OU_GROUP-${id}` }));

        const dimensionsOu =
            dimensionsOuInVisualization &&
            dimensionsOuInVisualization.length > 0 &&
            (orgUnitItems?.length > 0 || orgUnitGroupRegionItems?.length > 0)
                ? [{ dimension: "ou" as const, items: [...orgUnitItems, ...orgUnitGroupRegionItems] }]
                : dimensionsOuInVisualization;

        const dimensionsPe =
            dimensionsPeInVisualization && dimensionsPeInVisualization.length > 0 && periods && periods.length > 0
                ? [{ dimension: "pe" as const, items: periods?.map(period => ({ id: period })) }]
                : dimensionsPeInVisualization;

        const dimensions = _.compact([...others, ...dimensionsOu, ...dimensionsPe, ...dimensionsDxInVisualization]);

        return dimensions.length > 0 ? dimensions : undefined;
    };

    private getChartFileTemplateIdFromDataStore(visualizationId: string): FutureData<Id> {
        return this.dataStoreClient
            .getObject<ChartFileTemplateIdsByVisualization>("chart-file-templates")
            .flatMap(chartFileTemplates => {
                if (!chartFileTemplates) {
                    return Future.error("Chart file templates not found in Datastore");
                }

                const chartFileTemplateId = chartFileTemplates[visualizationId];

                if (!chartFileTemplateId) {
                    return Future.error("Chart file template not found in Datastore");
                }

                return Future.success(chartFileTemplateId);
            });
    }

    private getLatestAvailableYearByCountryId(params: {
        visualizationIds: Id[];
        isUpTo2019: boolean;
        isMultipleVisualizations: boolean;
        isScatter?: boolean;
        xAxis?: string;
        yAxis?: string;
        firstChartAnalyticsRows: Array<string[]>;
        secondChartAnalyticsRows: Array<string[]>;
        policyExplorerChartData?: PolicyExplorerChartData[];
        maxYearToFilterBy?: string;
    }) {
        const {
            visualizationIds,
            isUpTo2019,
            isMultipleVisualizations,
            isScatter,
            xAxis,
            yAxis,
            firstChartAnalyticsRows,
            secondChartAnalyticsRows,
            policyExplorerChartData,
            maxYearToFilterBy,
        } = params;

        if (visualizationIds.includes("IXF2wBMnwpa")) {
            const lastAvailableYearByCountry = getCommonLastAvailableYearInTwoDataIds({
                rows: firstChartAnalyticsRows,
                dataId1: "CGk1OOt70Dz",
                dataId2: "WmOGqGcov4f",
                isUpTo2019,
                maxYearToFilterBy,
            });

            return Object.entries(lastAvailableYearByCountry).reduce(
                (acc: Record<string, string>, [countryId, year]) => {
                    const shouldKeep = policyExplorerChartData?.some(
                        item =>
                            item.country === countryId &&
                            item.period === year &&
                            item.value === true &&
                            (item.dataElement === POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT ||
                                item.dataElement === POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE)
                    );

                    if (shouldKeep) {
                        acc[countryId] = year;
                    }

                    return acc;
                },
                {}
            );
        } else {
            return isMultipleVisualizations
                ? getLatestAvailableYearByCountryIdFromTwoCharts(
                      firstChartAnalyticsRows,
                      secondChartAnalyticsRows,
                      isUpTo2019,
                      maxYearToFilterBy
                  )
                : isScatter && xAxis && yAxis
                ? getCommonLastAvailableYearInTwoDataIds({
                      rows: firstChartAnalyticsRows,
                      dataId1: xAxis,
                      dataId2: yAxis,
                      isUpTo2019,
                      maxYearToFilterBy,
                  })
                : getLastAvailableYearByCountry(firstChartAnalyticsRows, isUpTo2019, maxYearToFilterBy);
        }
    }
}
export type VisualizationProp = "filters" | "rows" | "columns";

interface ItemRef {
    dimension: Dimension;
    items: Ref[];
}

export type Metadata = Record<string | "organisationUnits", { id: string; name: string; shortName: string }[]>;

const organisationUnitsFields = {
    id: true,
    shortName: true,
    code: true,
} as const;

export type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];

const organisationUnitGroupsFields = {
    id: true,
    shortName: true,
    code: true,
    organisationUnits: {
        id: true,
    },
} as const;

export type D2OrgUnitGroup = MetadataPick<{
    organisationUnitGroups: { fields: typeof organisationUnitGroupsFields };
}>["organisationUnitGroups"][number];

function insertArrayAt<T>(arr: T[], index: number, value: T): T[] {
    return [...arr.slice(0, index), value, ...arr.slice(index)];
}

function resolveFilterDxName(visualization: Visualization): Maybe<string> {
    const allDims = [...visualization.filters, ...visualization.columns, ...visualization.rows];
    const dxDim = allDims.find(dim => dim.id === "dx");
    return dxDim?.items[0]?.name?.replace("UHCW_", "");
}

function renameIndicatorHeaderToParameter(tabs: Tab[]): Tab[] {
    return tabs.map(tab => {
        if (tab.name !== DATA_TAB_NAME) return tab;
        const [chartNameRow, headerRow, ...dataRows] = tab.data;
        if (!headerRow) return tab;
        const renamedHeader = headerRow.map(col => (col === INDICATOR_COLUMN ? PARAMETER_COLUMN : col));
        return { ...tab, data: [chartNameRow || [], renamedHeader, ...dataRows] };
    });
}

type CodedEntity = { id: Id; shortName?: string; code?: string };

function buildCodeMap<K>(entities: CodedEntity[], getKey: (entity: CodedEntity) => K | undefined): Map<K, string> {
    const entries = entities.flatMap((entity): Array<[K, string]> => {
        if (!entity.code) return [];
        const key = getKey(entity);
        return key === undefined ? [] : [[key, mapToWhoCountryCode(entity.code)]];
    });
    return new Map(entries);
}

function buildCodeById(orgUnits: D2OrgUnit[], orgUnitGroups: D2OrgUnitGroup[]): Map<Id, string> {
    return buildCodeMap([...orgUnits, ...orgUnitGroups], entity => entity.id);
}

function buildCodeByCountryName(orgUnits: D2OrgUnit[], orgUnitGroups: D2OrgUnitGroup[]): Map<string, string> {
    return buildCodeMap([...orgUnits, ...orgUnitGroups], entity =>
        mapToWhoCountryName(entity.id, entity.shortName || "")
    );
}
