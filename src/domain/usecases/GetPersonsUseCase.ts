import { FutureData } from "../entities/Future";
import { Person } from "../entities/Person";
import { PersonRepository } from "../repositories/PersonRepository";

export class GetPersonsUseCase {
    constructor(private officeTeamRepository: PersonRepository) {}

    public execute(isOfficeTeam: boolean): FutureData<Person[]> {
        return this.officeTeamRepository.get(isOfficeTeam);
    }
}
