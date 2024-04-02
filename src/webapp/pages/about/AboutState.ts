import { Person } from "../../../domain/entities/Person";
import { OfficeInfo } from "../../../domain/entities/about/OfficeInfo";
import { CountryFilterState } from "../../common/state/state";

export type ResourcesState = {
    officeInfo: OfficeInfo | undefined;
    team: PersonState[];
    experts: PersonState[];
    countryFilter: CountryFilterState;
    onFilterChange: (value: string) => void;
};

export interface PersonState extends Person {
    countryName: string;
}
