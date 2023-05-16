import { CountryFilterState } from "../../common/state/state";
import { Option } from "../../components/dropdown/Option";

export type ResourcesState = {
    team: Person[];
    experts: Person[];
    countryFilter: CountryFilterState;
    filters: string[];
    selectedFilter: string;
    onFilterChange: (value: string) => void;
};

export type Person = {
    image: string;
    firstName: string;
    lastName: string;
    position: string;
    linkedin: string;
    email: string;
    twitter?: string;
    countryCode?: string;
    country?: string;
};
