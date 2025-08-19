import { FutureData } from "../entities/Future";
import { Region } from "../entities/Region";

export interface RegionRepository {
    get(): FutureData<Region[]>;
}
