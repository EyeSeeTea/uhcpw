import { PaginatedPosts } from "../entities/blog/Post";
import { FutureData } from "../entities/Future";
import { BlogFilters, BlogRepository } from "../repositories/BlogRepository";

export class GetPostsUseCase {
    constructor(private blogRepository: BlogRepository) {}

    public execute(page: number, filters: BlogFilters): FutureData<PaginatedPosts> {
        return this.blogRepository.get(page, filters);
    }
}
