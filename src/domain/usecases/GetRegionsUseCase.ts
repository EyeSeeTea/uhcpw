import { FutureData } from "../entities/Future";
import { Region } from "../entities/Region";
import { RegionRepository } from "../repositories/RegionRepository";

export class GetRegionsUseCase {
    constructor(private regionRepository: RegionRepository) {}

    public execute(): FutureData<Region[]> {
        return this.regionRepository.get();
    }
}
