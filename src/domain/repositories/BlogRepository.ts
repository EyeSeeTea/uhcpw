import { PaginatedPosts, Post } from "../entities/blog/Post";
import { FutureData } from "../entities/Future";
import { Id } from "../entities/Ref";

export interface BlogFilters {
    searchTerm?: string;
    years?: string[];
}

export interface BlogRepository {
    get(page: number, filters: BlogFilters): FutureData<PaginatedPosts>;
    getById(id: Id): FutureData<Post>;
}
