import { CountryFilterState, YearFilterState } from "../../../common/state/state";
import { Option } from "../../../components/dropdown/Option";

export type ResourcesFiltersState = {
    search: {
        term: string;
        onTermChange: (value: string) => void;
    };
    country: CountryFilterState;
    category: CategoryFilterState;
    theme: ThemeFilterState;

    year: YearFilterState;
};

export type CategoryFilterState = {
    options: Option<string>[];
    selected: string | undefined;
    onSelectedChange: (value: string | undefined) => void;
};

export type ThemeFilterState = {
    options: Option<string>[];
    selected: string | undefined;
    onSelectedChange: (value: string | undefined) => void;
};
