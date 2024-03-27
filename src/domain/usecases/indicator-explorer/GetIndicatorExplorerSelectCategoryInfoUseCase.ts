import { FutureData } from "../../entities/Future";
import { IndicatorExplorerSelectCategoryInfo } from "../../entities/indicator-explorer/IndicatorExplorer";
import { IndicatorExplorerRepository } from "../../repositories/indicator-explorer/IndicatorExplorerRepository";

export class GetIndicatorExplorerSelectCategoryInfoUseCase {
    constructor(private indicatorExplorerRepository: IndicatorExplorerRepository) {}

    public execute(): FutureData<IndicatorExplorerSelectCategoryInfo> {
        return this.indicatorExplorerRepository.getSelectCategoryInfo();
    }
}
