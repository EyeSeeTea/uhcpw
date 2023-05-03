import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";

export interface ResourceFilters {
    category: string;
    searchTerm?: string;
    theme?: string;
    year?: string;
}

export interface ResourceRepository {
    get(filters: ResourceFilters): FutureData<Resource[]>;
}
