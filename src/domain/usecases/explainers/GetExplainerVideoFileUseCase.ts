import { FutureData } from "../../entities/Future";
import { ExplainerPage } from "../../entities/explainers/Explainer";
import { ExplainerVideoFile } from "../../entities/explainers/ExplainerVideoFile";
import { ExplainerVideoFileRepository } from "../../repositories/explainers/ExplainerVideoFileRepository";

export class GetExplainerVideoFileUseCase {
    constructor(private repository: ExplainerVideoFileRepository) {}

    public execute(page: ExplainerPage): FutureData<ExplainerVideoFile> {
        return this.repository.get(page);
    }
}
