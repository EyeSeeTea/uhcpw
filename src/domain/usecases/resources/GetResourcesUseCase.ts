import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";
import { ResourceRepository } from "../../repositories/resources/ResourceRepository";

export class GetResourcesUseCase {
    constructor(private resourceRepository: ResourceRepository) {}

    public execute(category: string, theme?: string, year?: string): FutureData<Resource[]> {
        return this.resourceRepository.get(category, theme, year);
    }
}
