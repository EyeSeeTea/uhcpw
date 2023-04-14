import { FutureData } from "../entities/Future";
import { PolicyExplorer } from "../entities/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(policyExplorerCategoryId: string, countryIds: string[], years: string[]): FutureData<PolicyExplorer>;
}
