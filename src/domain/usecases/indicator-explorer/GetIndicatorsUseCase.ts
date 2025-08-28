import { FutureData } from "../../entities/Future";
import { Indicator } from "../../entities/indicator-explorer/Indicator";
import { IndicatorRepository } from "../../repositories/indicator-explorer/IndicatorRepository";

export class GetIndicatorsUseCase {
    constructor(private indicatorRepository: IndicatorRepository) {}

    public execute(): FutureData<Indicator[]> {
        return this.indicatorRepository.getAll();
    }
}
