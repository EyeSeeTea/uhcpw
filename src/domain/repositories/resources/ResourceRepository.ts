import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { Resource } from "../../entities/resources/Resource";

export interface ResourceFilters {
    category?: string;
    searchTerm?: string;
    themeCode?: string;
    countries?: Id[];
    years?: string[];
    pageSize?: number;
    page?: number;
    isFavouriteHome?: boolean;
    isFavouriteSection?: boolean;
}

export interface ResourceRepository {
    get(filters: ResourceFilters): FutureData<Resource[]>;
}
