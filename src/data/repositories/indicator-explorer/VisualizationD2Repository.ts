import { FutureData } from "../../../domain/entities/Future";
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
        ).map(response => response.objects.map(object => this.buildUser(object)));
    }

    public getById(id: string): FutureData<Visualization> {
        return this.cache.getOrFuture(
            id,
            apiToFuture(
                this.api.get<D2Visualization>(`/visualizations/${id}`, {
                    fields: Object.keys(visualizationFields).join(","),
                })
            ).map(visualization => {
                return this.buildUser(visualization);
            })
        );
    }

    private buildUser(d2Visualization: D2Visualization): Visualization {
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
