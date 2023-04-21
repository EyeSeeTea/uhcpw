import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";
import { ResourceFilters, ResourceRepository } from "../../repositories/resources/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(filters: ResourceFilters): FutureData<Resource[]> {
        return this.resourceRepository.get(filters);
    }
}
