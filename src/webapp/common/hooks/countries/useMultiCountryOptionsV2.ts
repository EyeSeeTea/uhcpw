import { useCallback, useEffect, useMemo, useState } from "react";
import i18n from "../../../../locales";
import { TreeOption } from "../../../components/tree-selector/TreeSelector";
import { useAppContext } from "../../../contexts/app-context";
import {
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
    SORTED_COUNTRY_GROUPINGS,
} from "../../../../data/repositories/countries/CountryD2Repository";
import { ALL_NODE_ID } from "../../../components/tree-selector/useTreeSelector";
import { SORTED_REGIONS } from "../../../../domain/entities/region/Region";

const REGEX_INSIDE_PARENTHESIS = /BIH \(([^)]+)\)/;

export function useMultiCountryOptionsV2(params?: {
    selectedCountries?: string[];
    countryOptionsToSelect?: string[];
    showRegions?: boolean;
    showSubRegions?: boolean;
}) {
    const { countries, regions } = useAppContext();
    const [options, setOptions] = useState<TreeOption[]>([]);
    const [selected, setSelected] = useState<string[] | undefined>([]);

    const { selectedCountries, countryOptionsToSelect, showRegions, showSubRegions } = useMemo(() => {
        return {
            selectedCountries: params?.selectedCountries,
            countryOptionsToSelect: params?.countryOptionsToSelect,
            showRegions: params?.showRegions,
            showSubRegions: params?.showSubRegions,
        };
    }, [params?.countryOptionsToSelect, params?.selectedCountries, params?.showRegions, params?.showSubRegions]);

    useEffect(() => {
        setSelected(selectedCountries);
    }, [selectedCountries]);

    const regionOptions: TreeOption[] = useMemo(() => {
        return regions
            .map(region => ({
                id: region.id,
                name: `${region.name} average`,
                code: region.code,
                parents: [AVERAGES_REGIONS_PARENT],
            }))
            .sort((a, b) => {
                const indexA = SORTED_REGIONS.indexOf(a.id);
                const indexB = SORTED_REGIONS.indexOf(b.id);
                return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
            });
    }, [regions]);

    useEffect(() => {
        const countryOptions: TreeOption[] = countries.map(country => ({
            id: country.id,
            name: country.name,
            code: country.code,
            parents: [
                { id: ALL_NODE_ID, name: i18n.t("All countries and areas") },
                ...country.parents
                    .filter(parent => !parent.name.includes("income"))
                    .map(g => ({
                        id: `parent-${g.id}`,
                        name: g.name,
                    })),
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

        const optionsToSet = showRegions ? [...countryOptionsFiltered, ...regionOptions] : countryOptionsFiltered;
        setOptions(optionsToSet);
    }, [countries, countryOptionsToSelect, showRegions, showSubRegions, regionOptions]);

    const onSelectedChange = useCallback((countries: string[] | undefined) => {
        setSelected(countries);
    }, []);

    const parentSort = useCallback(
        (a: string, b: string) => countryGroupings.indexOf(a) - countryGroupings.indexOf(b),
        []
    );

    return { options, selected, onSelectedChange, parentSort };
}

export const AVERAGES_REGIONS_PARENT = {
    id: "averages",
    name: "Averages",
};

const countryGroupings = [AVERAGES_REGIONS_PARENT.id, ALL_NODE_ID, ...SORTED_COUNTRY_GROUPINGS.map(g => `parent-${g}`)];
