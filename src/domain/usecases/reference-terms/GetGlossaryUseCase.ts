import { ReferenceTermsRepository } from "../../repositories/ReferenceTermsRepository";

export class GetGlossaryUseCase {
    constructor(private repository: ReferenceTermsRepository) {}

    public execute() {
        return this.repository.getGlossary();
    }
}
