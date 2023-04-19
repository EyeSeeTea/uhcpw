import { FutureData } from "../entities/Future";
import { PolicyExplorerCategory } from "../entities/PolicyExplorerCategory";

export interface PolicyExplorerCategoryRepository {
    getAll(): FutureData<PolicyExplorerCategory[]>;
}
