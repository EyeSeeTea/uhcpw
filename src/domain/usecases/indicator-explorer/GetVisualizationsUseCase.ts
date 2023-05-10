import { FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/indicator-explorer/Visualization";
import { VisualizationRepository } from "../../repositories/indicator-explorer/VisualizationRepository";

export class GetVisualizationsUseCase {
    constructor(private visualizationRepository: VisualizationRepository) {}

    public execute(): FutureData<Visualization[]> {
        return this.visualizationRepository.getAll();
    }
}
