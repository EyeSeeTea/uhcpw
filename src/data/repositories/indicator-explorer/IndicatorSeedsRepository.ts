import { IndicatorRepository } from "../../../domain/repositories/indicator-explorer/IndicatorRepository";
import { Indicator } from "../../../domain/entities/indicator-explorer/Indicator";
import { VisualizationsSeeds } from "./seed/VisualizationsSeeds";
import { Future, FutureData } from "../../../domain/entities/Future";

export class IndicatorSeedsRepository implements IndicatorRepository {
    public getAll(): FutureData<Indicator[]> {
        const indicators: Indicator[] = Object.entries(VisualizationsSeeds).map(([id, extra]) => ({
            id,
            ...extra,
        }));
        return Future.success(indicators);
    }
}
