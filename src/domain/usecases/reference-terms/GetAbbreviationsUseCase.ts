import { ReferenceTermsRepository } from "../../repositories/ReferenceTermsRepository";

export class GetAbbreviationsUseCase {
    constructor(private repository: ReferenceTermsRepository) {}

    public execute() {
        return this.repository.getAbbreviations();
    }
}
