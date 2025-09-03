import { FutureData } from "../../entities/Future";
import { Region } from "../../entities/region/Region";
import { RegionRepository } from "../../repositories/region/RegionRepository";

export class GetRegionsUseCase {
    constructor(private regionRepository: RegionRepository) {}

    public execute(): FutureData<Region[]> {
        return this.regionRepository.get();
    }
}
