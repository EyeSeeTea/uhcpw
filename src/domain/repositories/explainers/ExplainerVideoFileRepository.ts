import { FutureData } from "../../entities/Future";
import { ExplainerPage } from "../../entities/explainers/Explainer";
import { ExplainerVideoFile } from "../../entities/explainers/ExplainerVideoFile";

export interface ExplainerVideoFileRepository {
    get(page: ExplainerPage): FutureData<ExplainerVideoFile>;
}
