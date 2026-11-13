import { FutureData } from "../../entities/Future";
import { PolicyExplorerContent } from "../../entities/policy-explorer/PolicyExplorerContent";
import { PolicyExplorerCategoryRepository } from "../../repositories/policy-explorer/PolicyExplorerCategoryRepository";

export class GetPolicyExplorerPageContentUseCase {
    constructor(private policyExplorerCategoryRepository: PolicyExplorerCategoryRepository) {}

    public execute(): FutureData<PolicyExplorerContent> {
        return this.policyExplorerCategoryRepository.getPageContent();
    }
}
