import { FutureData } from "../../entities/Future";
import { ResourceCategory } from "../../entities/ResourceCategory";

export interface ResourceCategoryRepository {
    getAll(): FutureData<ResourceCategory[]>;
}
