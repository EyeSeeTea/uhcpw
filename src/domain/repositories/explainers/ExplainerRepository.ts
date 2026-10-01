import { FutureData } from "../../entities/Future";
import { Explainer, ExplainerPage } from "../../entities/explainers/Explainer";

export interface ExplainerRepository {
    get(page: ExplainerPage): FutureData<Explainer>;
}
