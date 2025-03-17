import { AnalyticsEvent, getCurrentPageLocation } from "../entities/AnalyticsEvent";
import { AnalyticsRepository } from "../repositories/AnalyticsRepository";

export class SendPageViewUseCase {
    constructor(private analyticsRepository: AnalyticsRepository) {}

    public async execute(options?: { location?: string; title?: string }) {
        const defaultOptions: AnalyticsEvent = {
            name: "page_view",
            pageLocation: options?.location ?? getCurrentPageLocation(),
            pageTitle: options?.title ?? document.title,
        };

        return this.analyticsRepository.send(defaultOptions);
    }
}
