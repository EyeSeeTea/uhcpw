import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(policyExplorerCategoryId: string, countryIds: string[], years: string[]): FutureData<PolicyExplorer>;
    saveToFile(policyExplorer: PolicyExplorer): FutureData<void>;
}
