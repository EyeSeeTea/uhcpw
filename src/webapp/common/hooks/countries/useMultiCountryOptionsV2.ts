import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "../../../../locales";
import { TreeOption } from "../../../components/tree-selector/TreeSelector";
import { useAppContext } from "../../../contexts/app-context";
import { CountriesRegion } from "../../../../domain/entities/Country";

export function useMultiCountryOptionsV2(params?: {
    selectedCountries?: string[];
    countryOptionsToSelect?: string[];
    showEurRegion?: boolean;
}) {
    const { countries, compositionRoot } = useAppContext();
    const [options, setOptions] = useState<TreeOption[]>([]);
    const [selected, setSelected] = useState<string[] | undefined>([]);
    const [eurRegion, setEurRegion] = useState<CountriesRegion | undefined>(undefined);

    const { selectedCountries, countryOptionsToSelect, showEurRegion } = useMemo(() => {
        return {
            selectedCountries: params?.selectedCountries,
            countryOptionsToSelect: params?.countryOptionsToSelect,
            showEurRegion: params?.showEurRegion,
        };
    }, [params?.countryOptionsToSelect, params?.selectedCountries, params?.showEurRegion]);

    useEffect(() => {
        setSelected(selectedCountries);
    }, [selectedCountries]);

    useEffect(() => {
        if (showEurRegion && !eurRegion) {
            compositionRoot.countries.getEurCountriesRegion.execute().run(
                eurRegionData => {
                    setEurRegion(eurRegionData);
                },
                () => {
                    setEurRegion(undefined);
                }
            );
        }
    }, [compositionRoot.countries, showEurRegion, eurRegion]);

    useEffect(() => {
        const countryOptions = countries.map(country => ({
            id: country.id,
            name: country.name,
            code: country.code,
            parents: [
                { id: "all", name: i18n.t("All countries and areas") },
                ...country.parents.filter(parent => !parent.name.includes("income")),
            ],
        }));

        const countryOptionsFiltered = countryOptionsToSelect
            ? countryOptions.filter(({ id }) => countryOptionsToSelect?.includes(id))
            : countryOptions;

        const optionsToSet =
            showEurRegion && eurRegion
                ? [
                      ...countryOptionsFiltered,
                      {
                          id: eurRegion.id,
                          name: eurRegion.name,
                          code: eurRegion.code,
                          parents: [],
                      },
                  ]
                : countryOptionsFiltered;
        setOptions(optionsToSet);
    }, [countries, countryOptionsToSelect, eurRegion, showEurRegion]);

    const onSelectedChange = useCallback((countries: string[] | undefined) => {
        setSelected(countries);
    }, []);

    return { options, selected, onSelectedChange };
}
