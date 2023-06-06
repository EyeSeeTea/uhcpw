import { Person } from "../../../domain/entities/Person";
import { CountryFilterState } from "../../common/state/state";

export type ResourcesState = {
    team: PersonState[];
    experts: PersonState[];
    countryFilter: CountryFilterState;
    filters: string[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
};

export interface PersonState extends Person {
    countryName: string;
}
