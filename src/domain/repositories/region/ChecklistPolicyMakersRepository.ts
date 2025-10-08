import { FutureData } from "../../entities/Future";
import { ChecklistPolicyMakers } from "../../entities/region/ChecklistPolicyMakers";

export interface ChecklistPolicyMakersRepository {
    get(): FutureData<ChecklistPolicyMakers>;
}
