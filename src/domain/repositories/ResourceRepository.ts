import { FutureData } from "../entities/Future";
import { Resource } from "../entities/Resource";

export interface ResourceRepository {
    get(category: string): FutureData<Resource[]>;
}
