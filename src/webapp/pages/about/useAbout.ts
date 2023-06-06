import { useCallback, useEffect, useState } from "react";
import { PersonState, ResourcesState } from "./AboutState";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import i18n from "../../../locales";
import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";
import { Person } from "../../../domain/entities/Person";

export function useAbout(): ResourcesState {
    const { compositionRoot, countries } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [officeTeam, setOfficeTeam] = useState<PersonState[]>([]);

    const [selectedFilter, setSelectedFilter] = useState<string>(allFilter);
    const [experts, setExperts] = useState<PersonState[]>([]);
    const [filteredExperts, setFilteredExperts] = useState<PersonState[]>([]);

    useEffect(() => {
        setFilteredExperts(filterExperts(experts, selectedFilter, countryFilter.selected));
    }, [countryFilter.options, countryFilter.selected, experts, selectedFilter]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(true).run(
            persons => {
                setOfficeTeam(persons.map(person => mapPersonToExpertState(person, countries)));
            },
            () => setOfficeTeam([])
        );
    }, [compositionRoot.about, countries]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(
            persons => {
                setExperts(persons.map(person => mapPersonToExpertState(person, countries)));
            },
            () => setExperts([])
        );
    }, [compositionRoot.about.getPersons, countries]);

    const onFilterChange = useCallback(
        (value: string) => {
            setSelectedFilter(value);

            setFilteredExperts(filterExperts(experts, value, countryFilter.selected));
        },
        [countryFilter.selected, experts]
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

const filterExperts = (expertMembers: PersonState[], letterFilter: string, countrySelected?: string[]) => {
    return expertMembers.filter(
        expert =>
            (!countrySelected || countrySelected.length === 0 || countrySelected?.includes(expert.countryId || "")) &&
            (letterFilter === allFilter || expert.firstName.toLowerCase().startsWith(letterFilter.toLowerCase()))
    );
};

function mapPersonToExpertState(person: Person, countries: Country[]): PersonState {
    const country = countries.find(country => country.id === person.countryId);

    return { ...person, countryName: country?.name || "" };
}

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
