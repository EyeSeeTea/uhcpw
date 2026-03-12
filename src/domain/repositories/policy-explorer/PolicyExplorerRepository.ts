import { Country } from "../../entities/Country";
import { FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerSelectableCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";

export interface PolicyExplorerRepository {
    get(
        policyExplorerCategories: PolicyExplorerCategories,
        selectedCountriesIds: Id[],
        yearsByCategory: Record<string, string[]>,
        countriesAndSubregions: Country[],
        programCategories: PolicyExplorerSelectableCategory[],
        useCountryCodes?: boolean
    ): FutureData<PolicyExplorer>;
    saveToFile(
        categories: PolicyExplorerSelectableCategory[],
        policyExplorer: PolicyExplorer,
        fileName?: string
    ): FutureData<void>;
}

type SubcategoryId = Id;
export type PolicyExplorerCategories = Record<Id, SubcategoryId[]>;
