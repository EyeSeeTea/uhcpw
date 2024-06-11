import { FutureData } from "../entities/Future";
import { GeneralContent } from "../entities/GeneralContent";
import { GeneralContentRepository } from "../repositories/GeneralContentRepository";

export class GetGeneralContentUseCase {
    constructor(private repository: GeneralContentRepository) {}

    public execute(): FutureData<GeneralContent> {
        return this.repository.get();
    }
}
