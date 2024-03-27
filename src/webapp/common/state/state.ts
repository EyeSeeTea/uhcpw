import { CountryOption } from "../../components/country-selector/CountrySelector";
import { Option } from "../../components/dropdown/Option";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";

export type CountryFilterState = {
    options: CountryOption[];
    selected: string[] | undefined;
    onSelectedChange: (value: string[] | undefined) => void;
};

export type PolicyExplorerCategoriesFilterState = {
    options: CategoryOption[];
    selected: Record<string, string[]> | undefined;
    onSelectedChange: (value: Record<string, string[]> | undefined) => void;
};

export type OptionsFilterState<T extends string = string> = {
    options: Option<T>[];
    selected: string | undefined;
    onSelectedChange: (value: string | undefined) => void;
};

export type OptionsMultiFilterState<T extends string = string> = {
    options: Option<T>[];
    selected: string[] | undefined;
    onSelectedChange: (value: string[] | undefined) => void;
};
