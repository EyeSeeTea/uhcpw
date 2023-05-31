import { Person } from "../../../domain/entities/Person";
import { CountryFilterState } from "../../common/state/state";

export type ResourcesState = {
    team: Person[];
    experts: Person[];
    countryFilter: CountryFilterState;
    filters: string[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
};
