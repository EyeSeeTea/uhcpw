import { FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";

export class AnalyticsD2Repository implements AnalyticsRepository {
    constructor(private api: D2Api) {}

    public get(dimension: string[], filter?: string[]): FutureData<Analytics> {
        return apiToFuture(
            this.api.analytics
                .get({
                    dimension,
                    filter,
                })
                .map(response => {
                    //TODO: Response from analytics endpoint hasn't metadataItems
                    return response.data as unknown as Analytics;
                })
        );
    }
}
