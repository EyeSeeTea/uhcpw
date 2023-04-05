import { FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/Visualization";
import { VisualizationRepository } from "../../repositories/VisualizationRepository";

export class GetVisualizationByIdUseCase {
    constructor(private visualizationRepository: VisualizationRepository) {}

    public execute(id: string): FutureData<Visualization> {
        return this.visualizationRepository.getById(id);
    }
}
