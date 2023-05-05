import { FutureData } from "../../entities/Future";
import { Analytics } from "../../entities/indicator-explorer/Analytics";

export interface AnalyticsRepository {
    get(): FutureData<Analytics>;
}
