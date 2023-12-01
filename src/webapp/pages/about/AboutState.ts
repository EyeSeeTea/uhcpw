import { Person } from "../../../domain/entities/Person";
import { CountryFilterState } from "../../common/state/state";

export type ResourcesState = {
    team: PersonState[];
    experts: PersonState[];
    countryFilter: CountryFilterState;
    onFilterChange: (value: string) => void;
};

export interface PersonState extends Person {
    countryName: string;
}
