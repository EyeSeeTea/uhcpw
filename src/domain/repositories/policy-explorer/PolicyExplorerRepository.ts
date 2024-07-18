import { Country } from "../../entities/Country";
import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: Record<string, string[]>,
        selectedCountriesIds: Id[],
        yearsByCategory: Record<string, string[]>,
        countriesAndRegions: Country[],
        programCategories: PolicyExplorerCategory[]
    ): FutureData<PolicyExplorer>;
    saveToFile(categories: PolicyExplorerCategory[], policyExplorer: PolicyExplorer): FutureData<void>;
}
