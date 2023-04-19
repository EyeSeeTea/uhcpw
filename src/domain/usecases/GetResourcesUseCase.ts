import { ResourceType } from "../../webapp/pages/resources/by-type/useResourcesByType";
import { Country } from "../entities/Country";
import { FutureData } from "../entities/Future";
import { Resource } from "../entities/Resource";
import { ResourceRepository } from "../repositories/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(type: ResourceType): FutureData<Resource[]> {
        return this.resourceRepository.get(type);
    }
}
