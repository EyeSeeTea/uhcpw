import { Post } from "../entities/blog/Post";
import { FutureData } from "../entities/Future";
import { Id } from "../entities/Ref";
import { PaginatedReponse, Pagination, Sorting } from "../entities/Pagination";

export interface BlogFilters {
    searchTerm?: string;
    years?: string[];
}

export interface BlogRepository {
    get(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: BlogFilters;
    }): FutureData<PaginatedReponse<Post>>;
    getById(id: Id): FutureData<Post>;
}
