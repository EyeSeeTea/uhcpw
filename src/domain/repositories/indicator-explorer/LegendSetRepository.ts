import { FutureData } from "../../entities/Future";
import { LegendSet } from "../../entities/indicator-explorer/LegendSet";
import { Id } from "../../entities/Ref";

export interface LegendSetRepository {
    get(ids: Id[]): FutureData<LegendSet[]>;
}
