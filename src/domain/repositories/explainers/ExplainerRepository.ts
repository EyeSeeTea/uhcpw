import { FutureData } from "../../entities/Future";
import { Explainer } from "../../entities/explainers/Explainer";

export interface ExplainerRepository {
    getAll(): FutureData<ReadonlyArray<Explainer>>;
}
