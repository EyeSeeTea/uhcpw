import { FutureData } from "../../entities/Future";
import { PolicyExplorerCategory } from "../../entities/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../repositories/PolicyExplorerCategoryRepository";

export class GetPolicyExplorerCategoriesUseCase {
    constructor(private policyExplorerCategoryRepository: PolicyExplorerCategoryRepository) {}

    public execute(): FutureData<PolicyExplorerCategory[]> {
        return this.policyExplorerCategoryRepository.getAll();
    }
}
