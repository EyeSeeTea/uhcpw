import { DataOrientation } from "../../../webapp/pages/policy-explorer/PolicyExplorerState";
import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";

export class DownloadPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(
        policyExplorer: PolicyExplorer,
        categoryId: string,
        dataOrientation: DataOrientation
    ): FutureData<void> {
        return this.policyExplorerRepository.saveToFile(policyExplorer, categoryId, dataOrientation);
    }
}
