import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerSelectableCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";

export class DownloadPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(
        categories: PolicyExplorerSelectableCategory[],
        policyExplorer: PolicyExplorer,
        fileName?: string
    ): FutureData<void> {
        return this.policyExplorerRepository.saveToFile(categories, policyExplorer, fileName);
    }
}
