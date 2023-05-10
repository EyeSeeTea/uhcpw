import { FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/indicator-explorer/Visualization";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class GetVisualizationByIdUseCase {
    constructor(private visualizationRepository: VisualizationRepository) {}

    public execute(id: string): FutureData<Visualization> {
        return this.visualizationRepository.getById(id);
    }
}
