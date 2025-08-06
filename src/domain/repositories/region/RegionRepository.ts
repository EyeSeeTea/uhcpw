import { FutureData } from "../../entities/Future";
import { Region } from "../../entities/region/Region";

export interface RegionRepository {
    get(): FutureData<Region[]>;
}
