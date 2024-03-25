import { FutureData } from "../../entities/Future";
import { PolicyExplorerSelectCategoryInfo } from "../../entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerCategoryRepository } from "../../repositories/policy-explorer/PolicyExplorerCategoryRepository";

export class GetPolicyExplorerSelectCategoryInfoUseCase {
    constructor(private policyExplorerCategoryRepository: PolicyExplorerCategoryRepository) {}

    public execute(): FutureData<PolicyExplorerSelectCategoryInfo> {
        return this.policyExplorerCategoryRepository.getSelectCategoryInfo();
    }
}
