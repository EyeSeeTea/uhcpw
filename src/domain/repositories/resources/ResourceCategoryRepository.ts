import { FutureData } from "../../entities/Future";
import { ResourceCategory } from "../../entities/resources/ResourceCategory";

export interface ResourceCategoryRepository {
    getAll(): FutureData<ResourceCategory[]>;
}
