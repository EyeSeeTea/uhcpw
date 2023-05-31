import { FutureData } from "../../entities/Future";
import { PolicyExplorerCategory } from "../../entities/policy-explorer/PolicyExplorerCategory";

export interface PolicyExplorerCategoryRepository {
    getAll(): FutureData<PolicyExplorerCategory[]>;
}
