import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";

export interface ResourceRepository {
    get(category: string): FutureData<Resource[]>;
}
