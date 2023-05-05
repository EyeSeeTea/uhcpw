import { Analytics } from "../../entities/indicator-explorer/Analytics";
import { FutureData } from "../../entities/Future";
import { AnalyticsRepository } from "../../repositories/indicator-explorer/AnalyticsRepository";

export class GetAnalyticsUseCase {
    constructor(private analyticsRepository: AnalyticsRepository) {}

    public execute(): FutureData<Analytics> {
        return this.analyticsRepository.get();
    }
}
