import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { DataOrientation } from "../../../webapp/pages/policy-explorer/PolicyExplorerState";
import { FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        countryIds: string[],
        yearsByCategory: Record<string, string[]>
    ): FutureData<PolicyExplorer>;
    saveToFile(
        categories: CategoryOption[],
        policyExplorer: PolicyExplorer,
        dataOrientationByTable: Record<string, DataOrientation>
    ): FutureData<void>;
}
