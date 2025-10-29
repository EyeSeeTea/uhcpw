import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { RegionInfo } from "../../entities/region/RegionInfo";

export interface RegionInfoRepository {
    get(regionOrgUnitId: Id): FutureData<RegionInfo>;
}
