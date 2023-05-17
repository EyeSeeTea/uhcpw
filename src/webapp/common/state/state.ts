import { CountryOption } from "../../components/country-selector/CountrySelector";
import { Option } from "../../components/dropdown/Option";

export type CountryFilterState = {
    options: CountryOption[];
    selected: string[] | undefined;
    onSelectedChange: (value: string[] | undefined) => void;
    groupedByIncome: boolean;
    onGroupedByIncomeChange: (value: boolean) => void;
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
