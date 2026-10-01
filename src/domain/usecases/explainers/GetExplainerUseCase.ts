import { FutureData } from "../../entities/Future";
import { Explainer, ExplainerPage } from "../../entities/explainers/Explainer";
import { ExplainerRepository } from "../../repositories/explainers/ExplainerRepository";

export class GetExplainerUseCase {
    constructor(private repository: ExplainerRepository) {}

    public execute(page: ExplainerPage): FutureData<Explainer> {
        return this.repository.get(page);
    }
}
