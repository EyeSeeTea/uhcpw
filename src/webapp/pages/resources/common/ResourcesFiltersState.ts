import { CountryFilterState, OptionsFilterState, OptionsMultiFilterState } from "../../../common/state/state";

export type ResourcesFiltersState = {
    search: {
        term: string;
        onTermChange: (value: string) => void;
    };
    country: CountryFilterState;
    category: OptionsFilterState;
    theme: OptionsFilterState;
    year: OptionsMultiFilterState;
};
