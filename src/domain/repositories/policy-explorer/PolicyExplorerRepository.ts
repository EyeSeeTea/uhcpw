import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        countryIds: string[],
        yearsByCategory: Record<string, string[]>
    ): FutureData<PolicyExplorer>;
    saveToFile(categories: CategoryOption[], policyExplorer: PolicyExplorer): FutureData<void>;
}
