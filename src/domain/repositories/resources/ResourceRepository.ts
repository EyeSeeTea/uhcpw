import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";

export interface ResourceFilters {
    category: string;
    searchTerm?: string;
    theme?: string;
    years?: string[];
}

export interface ResourceRepository {
    get(filters: ResourceFilters): FutureData<Resource[]>;
}
