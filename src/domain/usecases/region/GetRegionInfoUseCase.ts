import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { RegionInfo } from "../../entities/region/RegionInfo";
import { RegionInfoRepository } from "../../repositories/region/RegionInfoRepository";

export class GetRegionInfoUseCase {
    constructor(private regionInfoRepository: RegionInfoRepository) {}

    public execute(regionOrgUnitId: Id): FutureData<RegionInfo> {
        return this.regionInfoRepository.get(regionOrgUnitId);
    }
}
