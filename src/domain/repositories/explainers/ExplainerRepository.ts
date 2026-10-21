import { FutureData } from "../../entities/Future";
import { Explainer, ExplainerPage } from "../../entities/explainers/Explainer";
import { Maybe } from "../../../types/utils";

export interface ExplainerRepository {
    get(page: ExplainerPage): FutureData<Maybe<Explainer>>;
}
