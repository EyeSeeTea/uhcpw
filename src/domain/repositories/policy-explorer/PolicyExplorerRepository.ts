import { DataOrientation } from "../../../webapp/pages/policy-explorer/PolicyExplorerState";
import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        countryIds: string[],
        yearsByCategory: Record<string, string[]>
    ): FutureData<PolicyExplorer>;
    saveToFile(policyExplorer: PolicyExplorer, categoryId: string, dataOrientation: DataOrientation): FutureData<void>;
}
