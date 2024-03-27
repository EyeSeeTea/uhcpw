import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Option } from "../../components/dropdown/Option";

export type CountryPageState = {
    countryFilter: {
        countryOptions: Option<string>[];
        selectedCountry: string;
        onCountryChange: (value: string) => void;
    };
};

export function useCountryPage(): CountryPageState {
    const { countries } = useAppContext();
    const [selectedCountry, setSelectedCountry] = useState<string>("");

    const countryOptions: Option<string>[] = useMemo(() => {
        return countries
            .filter(({ isInCountryPage }) => isInCountryPage)
            .map(country => ({ value: country.id, text: country.name }));
    }, [countries]);

    const onCountryChange = useCallback((country: string) => {
        setSelectedCountry(country);
    }, []);

    return {
        countryFilter: { countryOptions, selectedCountry, onCountryChange },
    };
}
