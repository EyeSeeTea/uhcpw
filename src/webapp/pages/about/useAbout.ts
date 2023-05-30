import { useCallback, useEffect, useState } from "react";
import { ResourcesState } from "./AboutState";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "../../../locales";
import { Person } from "../../../domain/entities/Person";
import { useAppContext } from "../../contexts/app-context";
import { CountryOption } from "../../components/country-selector/CountrySelector";

export function useAbout(): ResourcesState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [officeTeam, setOfficeTeam] = useState<Person[]>([]);

    const [selectedFilter, setSelectedFilter] = useState<string>(allFilter);
    const [experts, setExperts] = useState<Person[]>([]);
    const [filteredExperts, setFilteredExperts] = useState<Person[]>([]);

    useEffect(() => {
        setFilteredExperts(filterExperts(experts, selectedFilter, countryFilter.options, countryFilter.selected));
    }, [countryFilter.options, countryFilter.selected, experts, selectedFilter]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(true).run(setOfficeTeam, () => setOfficeTeam([]));
    }, [compositionRoot.about]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(setExperts, () => setExperts([]));
    }, [compositionRoot.about.getPersons]);

    const onFilterChange = useCallback(
        (value: string) => {
            setSelectedFilter(value);

            setFilteredExperts(filterExperts(experts, value, countryFilter.options, countryFilter.selected));
        },
        [countryFilter.options, countryFilter.selected, experts]
    );

    return {
        team: officeTeam,
        experts: filteredExperts,
        countryFilter,
        filters,
        selectedFilter,
        onFilterChange,
    };
}

const filterExperts = (
    expertMembers: Person[],
    letterFilter: string,
    countryOptions: CountryOption[],
    countrySelected?: string[]
) => {
    const countryNames = countrySelected
        ? countryOptions.filter(country => countrySelected?.includes(country.id)).map(({ name }) => name || "")
        : undefined;

    return expertMembers.filter(
        expert =>
            (!countryNames || countryNames.length === 0 || countryNames?.includes(expert.country || "")) &&
            (letterFilter === allFilter || expert.firstName.toLowerCase().startsWith(letterFilter.toLowerCase()))
    );
};

const allFilter = i18n.t("All");

const filters = [
    allFilter,
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
