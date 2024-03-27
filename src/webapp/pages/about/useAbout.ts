import { useCallback, useEffect, useState } from "react";
import { PersonState, ResourcesState } from "./AboutState";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";
import { Person } from "../../../domain/entities/Person";
import _ from "lodash";

export function useAbout(): ResourcesState {
    const { compositionRoot, countries } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [officeTeam, setOfficeTeam] = useState<PersonState[]>([]);

    const [experts, setExperts] = useState<PersonState[]>([]);
    const [filteredExperts, setFilteredExperts] = useState<PersonState[]>([]);

    useEffect(() => {
        setFilteredExperts(filterExperts(experts, countryFilter.selected));
    }, [countryFilter.options, countryFilter.selected, experts]);

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
                const experts = persons.map(person => mapPersonToExpertState(person, countries));

                const orderedExperts = _(experts).orderBy(["countryName", "firstName"], ["asc", "asc"]).value();

                setExperts(orderedExperts);
            },
            () => setExperts([])
        );
    }, [compositionRoot.about.getPersons, countries]);

    const onFilterChange = useCallback(() => {
        setFilteredExperts(filterExperts(experts, countryFilter.selected));
    }, [countryFilter.selected, experts]);

    return {
        team: officeTeam,
        experts: filteredExperts,
        countryFilter,
        onFilterChange,
    };
}

const filterExperts = (expertMembers: PersonState[], countrySelected?: string[]) => {
    return expertMembers.filter(
        expert => !countrySelected || countrySelected.length === 0 || countrySelected?.includes(expert.countryId || "")
    );
};

function mapPersonToExpertState(person: Person, countries: Country[]): PersonState {
    const country = countries.find(country => country.id === person.countryId);

    return { ...person, countryName: country?.name || "" };
}
