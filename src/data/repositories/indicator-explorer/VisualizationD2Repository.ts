import { Future, FutureData } from "../../../domain/entities/Future";
import {
    CategoryDimensionItem,
    DataDimensionItem,
    LegendOptions,
    Visualization,
    VisualizationDimension,
} from "../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationRepository } from "../../../domain/repositories/indicator-explorer/VisualizationRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { InmemoryCache } from "../../cache/InmemoryCache";

export class VisualizationD2Repository implements VisualizationRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public getAll(): FutureData<Visualization[]> {
        return apiToFuture(
            this.api.models.visualizations.get({
                fields: visualizationFields,
                filter: { type: { "!eq": "PIVOT_TABLE" }, name: { like: "UHCW_" } },
            })
        ).map(response => response.objects.map(object => this.buildVisualization(object)));
    }

    public getById(id: string): FutureData<Visualization> {
        // return this.cache.getOrFuture(
        //     id,
        //     apiToFuture(
        //         this.api.get<D2Visualization>(`/visualizations/${id}`, {
        //             fields: Object.keys(visualizationFields).join(","),
        //         })
        //     ).map(visualization => {
        //         return this.buildVisualization(visualization);
        //     })
        // );

        return Future.success(hardCodedVisualization as unknown as Visualization);
    }

    private buildVisualization(d2Visualization: D2Visualization): Visualization {
        return {
            id: d2Visualization.id,
            name: d2Visualization.displayName,
            rows: d2Visualization.rows as VisualizationDimension[],
            columns: d2Visualization.columns as VisualizationDimension[],
            filters: d2Visualization.filters as VisualizationDimension[],
            dataDimensionItems: d2Visualization.dataDimensionItems as DataDimensionItem[],
            categoryDimensions: d2Visualization.categoryDimensions as CategoryDimensionItem[],
            showData: d2Visualization.showData,
            regressionType: d2Visualization.regressionType,
            type: d2Visualization.type,
            cumulativeValues: d2Visualization.cumulativeValues,
            sortOrder: d2Visualization.sortOrder,
            fontSize: d2Visualization.fontSize,
            aggregationType: d2Visualization.aggregationType,
            hideSubtitle: d2Visualization.hideSubtitle,
            percentStackedValues: d2Visualization.percentStackedValues,
            noSpaceBetweenColumns: d2Visualization.noSpaceBetweenColumns,
            hideTitle: d2Visualization.hideTitle,
            regression: d2Visualization.regression,
            skipRounding: d2Visualization.skipRounding,
            legend: d2Visualization.legend as LegendOptions,
            yearlySeries: d2Visualization.yearlySeries,
        };
    }
}

const visualizationFields = {
    id: true,
    displayName: true,
    rows: true,
    columns: true,
    filters: true,
    dataDimensionItems: true,
    categoryDimensions: { category: true, categoryOptions: true },
    showData: true,
    regressionType: true,
    type: true,
    cumulativeValues: true,
    sortOrder: true,
    fontSize: true,
    aggregationType: true,
    hideSubtitle: true,
    percentStackedValues: true,
    noSpaceBetweenColumns: true,
    hideTitle: true,
    regression: true,
    skipRounding: true,
    legend: {
        showKey: true,
    },
    yearlySeries: true,
} as const;

type D2Visualization = MetadataPick<{
    visualizations: { fields: typeof visualizationFields };
}>["visualizations"][number];

const hardCodedVisualization = {
    id: "DkPKc1EUmC2",
    name: "ANC: 1-3 trend lines last 12 months",
    showData: false,
    type: "LINE",
    regressionType: "NONE",
    cumulativeValues: false,
    sortOrder: 0,
    fontSize: "NORMAL",
    aggregationType: "DEFAULT",
    displayName: "ANC: 1-3 trend lines last 12 months",
    hideSubtitle: false,
    percentStackedValues: false,
    noSpaceBetweenColumns: false,
    hideTitle: false,
    regression: false,
    skipRounding: false,
    legend: {
        showKey: false,
    },
    seriesKey: {
        hidden: false,
    },
    yearlySeries: [],
    interpretations: [
        {
            created: "2023-04-16T11:07:06.528",
            id: "MC8iaQ5ojv6",
        },
    ],
    columns: [
        {
            dimension: "dx",
            items: [
                {
                    name: "ANC 1 Coverage",
                    id: "Uvn6LCg7dVU",
                    displayName: "ANC 1 Coverage",
                    displayShortName: "ANC 1 Coverage",
                    dimensionItemType: "INDICATOR",
                    access: {
                        read: true,
                        update: true,
                        externalize: false,
                        delete: true,
                        write: true,
                        manage: true,
                    },
                },
                {
                    name: "ANC 2 Coverage",
                    id: "OdiHJayrsKo",
                    displayName: "ANC 2 Coverage",
                    displayShortName: "ANC 2 Coverage",
                    dimensionItemType: "INDICATOR",
                    access: {
                        read: true,
                        update: true,
                        externalize: false,
                        delete: true,
                        write: true,
                        manage: true,
                    },
                },
                {
                    name: "ANC 3 Coverage",
                    id: "sB79w2hiLp8",
                    displayName: "ANC 3 Coverage",
                    displayShortName: "ANC 3 Coverage",
                    dimensionItemType: "INDICATOR",
                    access: {
                        read: true,
                        update: true,
                        externalize: false,
                        delete: true,
                        write: true,
                        manage: true,
                    },
                },
            ],
        },
    ],
    filters: [
        {
            dimension: "ou",
            items: [
                {
                    name: "Sierra Leone",
                    id: "ImspTQPwCqd",
                    displayName: "Sierra Leone",
                    displayShortName: "Sierra Leone",
                    dimensionItemType: "ORGANISATION_UNIT",
                    access: {
                        read: true,
                        update: true,
                        externalize: false,
                        delete: true,
                        write: true,
                        manage: true,
                    },
                },
            ],
        },
    ],
    rows: [
        {
            dimension: "pe",
            items: [
                {
                    name: "LAST_12_MONTHS",
                    id: "LAST_12_MONTHS",
                    displayName: "LAST_12_MONTHS",
                    displayShortName: "LAST_12_MONTHS",
                    dimensionItemType: "PERIOD",
                    access: {
                        read: true,
                        update: true,
                        externalize: false,
                        delete: true,
                        write: true,
                        manage: true,
                    },
                },
            ],
        },
    ],
};
