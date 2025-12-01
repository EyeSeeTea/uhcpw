import { FutureData } from "../../entities/Future";
import {
    PolicyExplorerCategory,
    PolicyExplorerSelectCategoryInfo,
} from "../../entities/policy-explorer/PolicyExplorerCategory";

export interface PolicyExplorerCategoryRepository {
    getAll(isRegionalPage?: boolean): FutureData<PolicyExplorerCategory[]>;
    getSelectCategoryInfo(): FutureData<PolicyExplorerSelectCategoryInfo>;
}
