import { FutureData } from "../../entities/Future";
import { ChecklistPolicyMakersRepository } from "../../repositories/region/ChecklistPolicyMakersRepository";

export class DownloadChecklistPolicyMakersUseCase {
    constructor(private checklistPolicyMakersRepository: ChecklistPolicyMakersRepository) {}

    public execute(data: string[][]): FutureData<void> {
        return this.checklistPolicyMakersRepository.saveToFile(data);
    }
}
