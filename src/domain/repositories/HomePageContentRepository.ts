import { FutureData } from "../entities/Future";
import { HomePageContent, RegionalReportLink } from "../entities/HomePageContent";

export interface HomePageContentRepository {
    get(): FutureData<HomePageContent>;
    getRegionalReportLink(): FutureData<RegionalReportLink>;
}
