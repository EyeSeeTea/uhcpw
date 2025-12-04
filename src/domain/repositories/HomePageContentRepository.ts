import { FutureData } from "../entities/Future";
import { HomePageContent } from "../entities/HomePageContent";

export interface HomePageContentRepository {
    get(): FutureData<HomePageContent>;
}
