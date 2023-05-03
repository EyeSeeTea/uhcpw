import { FutureData } from "../../entities/Future";
import { PolicyExplorerCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../repositories/policy-explorer/PolicyExplorerCategoryRepository";

export class GetPolicyExplorerCategoriesUseCase {
    constructor(private policyExplorerCategoryRepository: PolicyExplorerCategoryRepository) {}

    public execute(): FutureData<PolicyExplorerCategory[]> {
        return this.policyExplorerCategoryRepository.getAll();
    }
}
