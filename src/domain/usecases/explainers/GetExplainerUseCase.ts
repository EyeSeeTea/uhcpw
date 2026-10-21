import { FutureData } from "../../entities/Future";
import { Explainer, ExplainerPage } from "../../entities/explainers/Explainer";
import { ExplainerRepository } from "../../repositories/explainers/ExplainerRepository";
import { Maybe } from "../../../types/utils";

export class GetExplainerUseCase {
    constructor(private repository: ExplainerRepository) {}

    public execute(page: ExplainerPage): FutureData<Maybe<Explainer>> {
        return this.repository.get(page);
    }
}
