import { Post } from "../entities/blog/Post";
import { FutureData } from "../entities/Future";
import { Id } from "../entities/Ref";
import { BlogRepository } from "../repositories/BlogRepository";

export class GetPostByIdUseCase {
    constructor(private blogRepository: BlogRepository) {}

    public execute(id: Id): FutureData<Post> {
        return this.blogRepository.getById(id);
    }
}
