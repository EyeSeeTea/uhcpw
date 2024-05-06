import { FutureData } from "../entities/Future";
import { RegionalReportLink } from "../entities/HomePageContent";
import { HomePageContentRepository } from "../repositories/HomePageContentRepository";

export class GetRegionalReportLinkUseCase {
    constructor(private repository: HomePageContentRepository) {}

    public execute(): FutureData<RegionalReportLink> {
        return this.repository.getRegionalReportLink();
    }
}
