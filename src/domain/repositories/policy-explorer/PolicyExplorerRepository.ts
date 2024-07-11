import { CategoryOption } from "../../../webapp/components/policy-explorer/category-selector/CategorySelector";
import { Country } from "../../entities/Country";
import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        selectedCountriesIds: Id[],
        yearsByCategory: Record<string, string[]>,
        countriesAndRegions: Country[],
        programCategories: CategoryOption[]
    ): FutureData<PolicyExplorer>;
    saveToFile(categories: CategoryOption[], policyExplorer: PolicyExplorer): FutureData<void>;
}
