import { FutureData } from "../../entities/Future";
import { ResourceCategory } from "../../entities/ResourceCategory";
import { ResourceCategoryRepository } from "../../repositories/resources/ResourceCategoryRepository";

export class GetResourceCategoriesUseCase {
    constructor(private resourceCategoryRepository: ResourceCategoryRepository) {}

    public execute(): FutureData<ResourceCategory[]> {
        return this.resourceCategoryRepository.getAll();
    }
}
