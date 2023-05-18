import { FutureData } from "../entities/Future";
import { Person } from "../entities/Person";
import { OfficeTeamRepository } from "../repositories/OfficeTeamRepository";

export class GetPersonsUseCase {
    constructor(private officeTeamRepository: OfficeTeamRepository) {}

    public execute(isOfficeTeam: boolean): FutureData<Person[]> {
        return this.officeTeamRepository.get(isOfficeTeam);
    }
}
