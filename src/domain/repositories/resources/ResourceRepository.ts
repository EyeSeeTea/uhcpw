import { FutureData } from "../../entities/Future";
import { Resource } from "../../entities/resources/Resource";

export interface ResourceFilters {
    category?: string;
    searchTerm?: string;
    theme?: string;
    countries?: string[];
    years?: string[];
    count?: number;
}

export interface ResourceRepository {
    get(filters: ResourceFilters): FutureData<Resource[]>;
}
