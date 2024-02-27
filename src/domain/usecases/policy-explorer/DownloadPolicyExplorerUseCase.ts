import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { DataOrientation } from "../../../webapp/pages/policy-explorer/PolicyExplorerState";
import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";

export class DownloadPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(
        categories: CategoryOption[],
        policyExplorer: PolicyExplorer,
        dataOrientationByTable: Record<string, DataOrientation>
    ): FutureData<void> {
        return this.policyExplorerRepository.saveToFile(categories, policyExplorer, dataOrientationByTable);
    }
}
