import { OptionsFilterState } from "../../../common/state/state";
import { CountryOption } from "../../../components/country-selector/CountrySelector";

export type IndicatorExplorerFakeState = {
    filters: IndicatorExplorerFiltersFakeState;
    chartName?: string;
    chartImage?: string;
    onGetChart: () => void;
};

export type IndicatorExplorerFiltersFakeState = {
    country: CountryFilterFakeState;
    category: OptionsFilterState;
};

export type CountryFilterFakeState = {
    visible?: boolean;
    options: CountryOption[];
    selected: string[] | undefined;
    onSelectedChange: (value: string[] | undefined) => void;
    groupedByIncome: boolean;
    onGroupedByIncomeChange: (value: boolean) => void;
};
