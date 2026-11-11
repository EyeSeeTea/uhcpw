import { FutureData } from "../../entities/Future";
import { PolicyExplorerCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";
import { PolicyExplorerContent } from "../../entities/policy-explorer/PolicyExplorerContent";

export interface PolicyExplorerCategoryRepository {
    getAll(isRegionalPage?: boolean): FutureData<PolicyExplorerCategory[]>;
    getPageContent(): FutureData<PolicyExplorerContent>;
}
