import { FutureData } from "../../entities/Future";
import { Visualization } from "../../entities/indicator-explorer/Visualization";

export interface VisualizationRepository {
    getAll(): FutureData<Visualization[]>;
    getById(id: string): FutureData<Visualization>;
}
