import { FutureData } from "../entities/Future";
import { Person } from "../entities/Person";

export interface PersonRepository {
    get(isOfficeTeam: boolean): FutureData<Person[]>;
}
