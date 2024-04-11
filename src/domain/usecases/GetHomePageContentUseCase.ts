import { FutureData } from "../entities/Future";
import { HomePageContent } from "../entities/HomePageContent";
import { HomePageContentRepository } from "../repositories/HomePageContentRepository";

export class GetHomePageContentUseCase {
    constructor(private repository: HomePageContentRepository) {}

    public execute(): FutureData<HomePageContent> {
        return this.repository.get();
    }
}
