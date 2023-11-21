import { FutureData } from "../../entities/Future";
import { LegendSet } from "../../entities/indicator-explorer/LegendSet";
import { Id } from "../../entities/Ref";
import { LegendSetRepository } from "../../repositories/indicator-explorer/LegendSetRepository";

export class GetLegendSetsUseCase {
    constructor(private legendSetRepository: LegendSetRepository) {}

    public execute(ids: Id[]): FutureData<LegendSet[]> {
        return this.legendSetRepository.get(ids);
    }
}
