import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/Resource";
import { ResourceRepository } from "../../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(category: string): FutureData<Resource[]> {
        return this.resourceRepository.get(category);
    }
}
