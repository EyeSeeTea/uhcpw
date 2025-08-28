import { FutureData } from "../../entities/Future";
import { Indicator } from "../../entities/indicator-explorer/Indicator";

export interface IndicatorRepository {
    getAll(): FutureData<Indicator[]>;
}
