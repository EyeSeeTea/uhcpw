import { FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/Visualization";
import { VisualizationRepository } from "../../repositories/VisualizationRepository";

export class GetVisualizationsUseCase {
    constructor(private visualizationRepository: VisualizationRepository) {}

    public execute(): FutureData<Visualization[]> {
        return this.visualizationRepository.getAll();
    }
}
