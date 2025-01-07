import { Post } from "../entities/blog/Post";
import { FutureData } from "../entities/Future";
import { PaginatedReponse, Pagination, Sorting } from "../entities/Pagination";
import { BlogFilters, BlogRepository } from "../repositories/BlogRepository";

export class GetPostsUseCase {
    constructor(private blogRepository: BlogRepository) {}

    public execute(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: BlogFilters;
    }): FutureData<PaginatedReponse<Post>> {
        return this.blogRepository.get(params);
    }
}
