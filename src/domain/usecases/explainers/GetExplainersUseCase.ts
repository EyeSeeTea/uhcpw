import { FutureData } from "../../entities/Future";
import { Explainer } from "../../entities/explainers/Explainer";
import { ExplainerRepository } from "../../repositories/explainers/ExplainerRepository";

export class GetExplainersUseCase {
    constructor(private repository: ExplainerRepository) {}

    public execute(): FutureData<ReadonlyArray<Explainer>> {
        return this.repository.getAll();
    }
}
