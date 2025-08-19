import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/dropdown/Option";

export type CountryPageState = {
    countryFilter: {
        countryOptions: Option<string>[];
        selectedCountry: string;
        onCountryChange: (value: string) => void;
    };
    resetTab: boolean;
    handleResetTab: (value: boolean) => void;
};

export function useCountryPage(): CountryPageState {
    const { countriesAndSubregions } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [resetTab, setResetTab] = useState<boolean>(false);

    const countryOptions: Option<string>[] = useMemo(() => {
        return countriesAndSubregions
            .filter(({ isInCountryPage }) => isInCountryPage)
            .map(country => ({ value: country.id, text: country.name }));
    }, [countriesAndSubregions]);

    const onCountryChange = useCallback((country: string) => {
        setSelectedCountry(country);
    }, []);

    const handleResetTab = useCallback((value: boolean) => {
        setResetTab(value);
    }, []);

    return {
        countryFilter: { countryOptions, selectedCountry, onCountryChange },
        resetTab,
        handleResetTab,
    };
}
