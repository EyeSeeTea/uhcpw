import { FutureData } from "../entities/Future";
import { Resource, ResourceCategory } from "../entities/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(category: ResourceCategory): FutureData<Resource[]> {
        return this.resourceRepository.get(category);
    }
}
