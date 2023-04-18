import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/PolicyExplorer";
import { PolicyExplorerRepository } from "../../repositories/PolicyExplorerRepository";

export class DownloadPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(policyExplorer: PolicyExplorer): FutureData<void> {
        return this.policyExplorerRepository.saveToFile(policyExplorer);
    }
}
