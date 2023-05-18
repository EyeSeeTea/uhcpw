import { FutureData } from "../entities/Future";
import { Person } from "../entities/Person";

export interface OfficeTeamRepository {
    get(isOfficeTeam: boolean): FutureData<Person[]>;
}
