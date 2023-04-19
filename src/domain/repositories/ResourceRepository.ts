import { FutureData } from "../entities/Future";
import { Resource, ResourceCategory } from "../entities/Resource";

export interface ResourceRepository {
    get(category: ResourceCategory): FutureData<Resource[]>;
}
