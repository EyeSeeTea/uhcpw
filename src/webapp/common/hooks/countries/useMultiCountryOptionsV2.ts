import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "../../../../locales";
import { TreeOption } from "../../../components/tree-selector/TreeSelector";
import { useAppContext } from "../../../contexts/app-context";
import { CountriesRegion } from "../../../../domain/entities/Country";
import {
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
    SORTED_COUNTRY_GROUPINGS,
} from "../../../../data/repositories/countries/CountryD2Repository";

const REGEX_INSIDE_PARENTHESIS = /BIH \(([^)]+)\)/;

export function useMultiCountryOptionsV2(params?: {
    selectedCountries?: string[];
    countryOptionsToSelect?: string[];
    showEurRegion?: boolean;
    showSubRegions?: boolean;
}) {
    const { countries, compositionRoot } = useAppContext();
    const [options, setOptions] = useState<TreeOption[]>([]);
    const [selected, setSelected] = useState<string[] | undefined>([]);
    const [eurRegion, setEurRegion] = useState<CountriesRegion | undefined>(undefined);

    const { selectedCountries, countryOptionsToSelect, showEurRegion, showSubRegions } = useMemo(() => {
        return {
            selectedCountries: params?.selectedCountries,
            countryOptionsToSelect: params?.countryOptionsToSelect,
            showEurRegion: params?.showEurRegion,
            showSubRegions: params?.showSubRegions,
        };
    }, [params?.countryOptionsToSelect, params?.selectedCountries, params?.showEurRegion, params?.showSubRegions]);

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
        const countryOptions: TreeOption[] = countries.map(country => ({
            id: country.id,
            name: country.name,
            code: country.code,
            parents: [
                { id: "all", name: i18n.t("All countries and areas") },
                ...country.parents.filter(parent => !parent.name.includes("income")),
            ],
            children: showSubRegions
                ? country.children?.map(child => ({
                      id: child.id,
                      name:
                          child.id === REPUBLICA_SERPSKA || child.id === FEDERACIJA_BOSNE_I_HERCEGOVINE
                              ? child.name.match(REGEX_INSIDE_PARENTHESIS)?.[1] || child.name
                              : child.name,
                      code: child.code,
                      parents: [],
                  }))
                : undefined,
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
                          parents: [averagesGroup],
                      },
                  ]
                : countryOptionsFiltered;
        setOptions(optionsToSet);
    }, [countries, countryOptionsToSelect, eurRegion, showEurRegion, showSubRegions]);

    const onSelectedChange = useCallback((countries: string[] | undefined) => {
        setSelected(countries);
    }, []);

    const parentSort = useCallback(
        (a: string, b: string) => countryGroupings.indexOf(a) - countryGroupings.indexOf(b),
        []
    );

    return { options, selected, onSelectedChange, parentSort };
}

const averagesGroup = {
    id: "averages",
    name: "Averages",
};

const countryGroupings = ["averges", "all", ...SORTED_COUNTRY_GROUPINGS];
