import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        countryIds: string[],
        years: string[]
    ): FutureData<PolicyExplorer>;
    saveToFile(policyExplorer: PolicyExplorer, categoryId: string): FutureData<void>;
}
