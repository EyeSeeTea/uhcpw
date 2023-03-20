import { Option } from "../../components/dropdown/Dropdown";

export type ResourcesState = {
    team: Person[];
    experts: Person[];
    selectCountries: Option<string>[];
    selectedCountry: string | undefined;
    onCountryChange: (country: string | undefined) => void;
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
