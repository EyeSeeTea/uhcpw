import { FutureData } from "../../entities/Future";
import { IndicatorExplorerContent } from "../../entities/indicator-explorer/IndicatorExplorerContent";
import { IndicatorExplorerContentRepository } from "../../repositories/indicator-explorer/IndicatorExplorerContentRepository";

export class GetIndicatorExplorerPageContentUseCase {
    constructor(private indicatorExplorerRepository: IndicatorExplorerContentRepository) {}

    public execute(): FutureData<IndicatorExplorerContent> {
        return this.indicatorExplorerRepository.get();
    }
}
