import { FutureData } from "../entities/Future";
import { Visualization } from "../entities/Visualization";

export interface VisualizationRepository {
    getAll(): FutureData<Visualization[]>;
    getById(id: string): FutureData<Visualization>;
}
