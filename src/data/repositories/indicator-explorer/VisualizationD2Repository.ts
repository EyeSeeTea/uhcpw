import { FutureData } from "../../../domain/entities/Future";
import {
    DataDimensionItem,
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
                filter: { type: { "!eq": "PIVOT_TABLE" } },
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
} as const;

type D2Visualization = MetadataPick<{
    visualizations: { fields: typeof visualizationFields };
}>["visualizations"][number];
