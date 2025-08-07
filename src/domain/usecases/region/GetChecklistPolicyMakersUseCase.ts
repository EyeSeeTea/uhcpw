import { FutureData } from "../../entities/Future";
import { ChecklistPolicyMakers } from "../../entities/region/ChecklistPolicyMakers";
import { ChecklistPolicyMakersRepository } from "../../repositories/region/ChecklistPolicyMakersRepository";

export class GetChecklistPolicyMakersUseCase {
    constructor(private checklistPolicyMakersRepository: ChecklistPolicyMakersRepository) {}

    public execute(): FutureData<ChecklistPolicyMakers> {
        return this.checklistPolicyMakersRepository.get();
    }
}
