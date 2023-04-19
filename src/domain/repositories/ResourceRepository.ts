import { ResourceType } from "../../webapp/pages/resources/by-type/useResourcesByType";
import { FutureData } from "../entities/Future";
import { Resource } from "../entities/Resource";

export interface ResourceRepository {
    get(type: ResourceType): FutureData<Resource[]>;
}
