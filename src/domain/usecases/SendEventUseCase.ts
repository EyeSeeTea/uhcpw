import { AnalyticsEvent } from "../entities/AnalyticsEvent";
import { AnalyticsRepository } from "../repositories/AnalyticsRepository";

export class SendEventUseCase {
    constructor(private analyticsRepository: AnalyticsRepository) {}

    public async execute(event: AnalyticsEvent) {
        return this.analyticsRepository.send(event);
    }
}
