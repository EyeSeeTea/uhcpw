import { getFieldsAsString } from "@eyeseetea/d2-api/api/common";
import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    CategoryDimensionItem,
    DataDimensionItem,
    LegendOptions,
    Visualization,
    VisualizationAxes,
    VisualizationDimension,
} from "../../../domain/entities/indicator-explorer/Visualization";
import { VisualizationRepository } from "../../../domain/repositories/indicator-explorer/VisualizationRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { InmemoryCache } from "../../cache/InmemoryCache";
import { getInfoNotes, InfoNotes } from "../../common/getInfoNotes";
import { getBreakInSeries } from "./break-in-series/getBreakInSeries";
import { emptyVisualizationExtra, VisualizationsSeeds } from "./seed/VisualizationsSeeds";
import { BreakInSeries } from "../../../domain/entities/indicator-explorer/BreakInSeries";

export class VisualizationD2Repository implements VisualizationRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public getAll(): FutureData<Visualization[]> {
        const visibleVisualizationsSeedKeys = Object.keys(VisualizationsSeeds).filter(
            key => VisualizationsSeeds[key]?.hide !== true
        );

        return apiToFuture(
            this.api.models.visualizations.get({
                fields: visualizationFields,
                filter: {
                    type: { "!eq": "PIVOT_TABLE" },
                    id: {
                        in: [
                            visibleVisualizationsSeedKeys
                                .map(seed => (seed.includes("_") ? seed.split("_") : seed))
                                .flat()
                                .join(","),
                        ],
                    },
                },
            })
        ).map(response => {
            const ret = _(response.objects)
                .map(object => this.buildVisualization(object))
                .uniqBy("id")
                .orderBy("categoryName", "asc")
                .value();
            return ret;
        });
    }

    public getById(id: string): FutureData<Visualization> {
        return Future.joinObj({
            visualization: this.cache.getOrFuture(
                id,
                apiToFuture(
                    this.api.get<D2Visualization>(`/visualizations/${id}`, {
                        fields: getFieldsAsString(visualizationFields),
                    })
                )
            ),
            infoNotes: this.cache.getOrFuture("infoNotes", getInfoNotes(this.api)),
            breakInSeries: this.cache.getOrFuture("breakInSeries", getBreakInSeries(this.api)),
        }).map(({ visualization, infoNotes, breakInSeries }) => {
            return this.buildVisualization(visualization, breakInSeries, infoNotes);
        });
    }

    private buildVisualization(
        d2Visualization: D2Visualization,
        breakInSeries?: BreakInSeries,
        infoNotes?: InfoNotes
    ): Visualization {
        // Handle seeds with multiple visualizations
        const visualizationsSeedsId =
            Object.keys(VisualizationsSeeds).find(seeds => seeds.includes(d2Visualization.id)) || "";

        const notes = infoNotes ? infoNotes[visualizationsSeedsId] || "" : "";

        const visualizationExtra = {
            ...(VisualizationsSeeds[visualizationsSeedsId] || emptyVisualizationExtra),
            notes,
            breakInSeries: breakInSeries?.getVisualization(visualizationsSeedsId),
        };

        const columns = (d2Visualization.columns as VisualizationDimension[]).reduce(
            (acc: VisualizationDimension[], column: VisualizationDimension) => {
                const renamedItems = column.items.map(item => ({
                    ...item,
                    id: item.dimensionItem,
                }));
                return [
                    ...acc,
                    {
                        ...column,
                        items: renamedItems,
                    },
                ];
            },
            [] as VisualizationDimension[]
        );

        return {
            id: visualizationsSeedsId,
            name: d2Visualization.name,
            rows: d2Visualization.rows as VisualizationDimension[],
            columns: columns,
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
            title: d2Visualization.title,
            subtitle: d2Visualization.subtitle,
            hideEmptyRowItems: d2Visualization.hideEmptyRowItems,
            axes: d2Visualization.axes as VisualizationAxes[],
            // necessary to avoid bug in analytics to create chart
            // TypeError: item.legendItem.getBBox is not a function
            // but is not in d2api schemas
            seriesKey: { hidden: false },
            ...visualizationExtra,
            friendlyName: visualizationExtra.friendlyName || d2Visualization.name.replace("UHCW_", ""),
        };
    }
}

const visualizationFields = {
    id: true,
    name: true,
    rows: { id: true, dimension: true, items: true },
    columns: {
        id: true,
        dimension: true,
        items: { dimensionItem: true },
    },
    filters: { id: true, dimension: true, items: true },
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
        strategy: true,
        set: true,
    },
    yearlySeries: true,
    title: true,
    subtitle: true,
    seriesKey: { hidden: true },
    hideEmptyRowItems: true,
    axes: true,
} as const;

export type D2Visualization = MetadataPick<{
    visualizations: { fields: typeof visualizationFields };
}>["visualizations"][number];
