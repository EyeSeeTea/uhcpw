import { FutureData } from "../../../domain/entities/Future";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Id } from "../../../domain/entities/Ref";
import { LegendSetRepository } from "../../../domain/repositories/indicator-explorer/LegendSetRepository";
import { D2Api, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { InmemoryCache } from "../../cache/InmemoryCache";

export class LegendSetD2Repository implements LegendSetRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public get(ids: Id[]): FutureData<LegendSet[]> {
        return apiToFuture(
            this.api.models.legendSets.get({
                fields: legendSetsFields,
                filter: { id: { in: ids } },
            })
        ).map(response => response.objects.map(object => this.buildLegendSet(object)));
    }

    private buildLegendSet(d2LegendSet: D2LegendSets): LegendSet {
        return {
            id: d2LegendSet.id,
            name: d2LegendSet.displayName,
            legends: d2LegendSet.legends.map(legend => {
                return {
                    id: legend.id,
                    name: legend.displayName,
                    color: legend.color,
                    startValue: legend.startValue,
                    endValue: legend.endValue,
                };
            }),
        };
    }
}

const legendSetsFields = {
    id: true,
    displayName: true,
    legends: { id: true, displayName: true, color: true, startValue: true, endValue: true },
} as const;

export type D2LegendSets = MetadataPick<{
    legendSets: { fields: typeof legendSetsFields };
}>["legendSets"][number];
