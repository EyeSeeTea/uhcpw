import { FutureData } from "../../entities/Future";
import {
    PolicyExplorerCategory,
    PolicyExplorerSelectCategoryInfo,
} from "../../entities/policy-explorer/PolicyExplorerCategory";

export interface PolicyExplorerCategoryRepository {
    getAll(): FutureData<PolicyExplorerCategory[]>;
    getSelectCategoryInfo(): FutureData<PolicyExplorerSelectCategoryInfo>;
}
