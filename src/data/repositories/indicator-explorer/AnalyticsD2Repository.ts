import { Future, FutureData } from "../../../domain/entities/Future";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { AnalyticsRepository } from "../../../domain/repositories/indicator-explorer/AnalyticsRepository";
import { D2Api } from "../../../types/d2-api";
import { InmemoryCache } from "../../cache/InmemoryCache";
import data from "./visualizationData.json";

export class AnalyticsD2Repository implements AnalyticsRepository {
    cache = new InmemoryCache();

    constructor(private api: D2Api) {}

    public get(): FutureData<Analytics> {
        return Future.success(data as unknown as Analytics);
    }
}
