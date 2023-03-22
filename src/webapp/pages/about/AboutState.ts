import { DropdownItem } from "@eyeseetea/d2-ui-components";

export type ResourcesState = {
    team: Person[];
    experts: Person[];
    selectCountries: DropdownItem<string>[];
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
