import { FutureData } from "../entities/Future";
import { Person } from "../entities/Person";
import { OfficeTeamRepository } from "../repositories/OfficeTeamRepository";

export class GetOfficeTeamUseCase {
    constructor(private officeTeamRepository: OfficeTeamRepository) {}

    public execute(): FutureData<Person[]> {
        return this.officeTeamRepository.get();
    }
}
