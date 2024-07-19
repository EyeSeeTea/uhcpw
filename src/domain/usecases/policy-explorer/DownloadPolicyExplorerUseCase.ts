import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";

export class DownloadPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(categories: PolicyExplorerCategory[], policyExplorer: PolicyExplorer): FutureData<void> {
        return this.policyExplorerRepository.saveToFile(categories, policyExplorer);
    }
}
