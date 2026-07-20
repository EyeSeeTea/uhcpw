import { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { PersonState, ResourcesState } from "./AboutState";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";
import { Person } from "../../../domain/entities/Person";
import { OfficeInfo } from "../../../domain/entities/about/OfficeInfo";
import { KOSOVO } from "../../../data/repositories/countries/CountryD2Repository";

export function useAbout(params?: { regionCode?: string }): ResourcesState {
    const { compositionRoot, countries, regions } = useAppContext();

    const selectedCountries = useMemo(
        () => regions.find(region => region.code === params?.regionCode)?.countries,
        [regions, params?.regionCode]
    );

    const countryFilter = useMultiCountryOptionsV2({ selectedCountries });

    const [officeTeam, setOfficeTeam] = useState<PersonState[]>([]);
    const [isTeamLoading, setIsTeamLoading] = useState(true);

    const [experts, setExperts] = useState<PersonState[]>([]);
    const [isExpertsLoading, setIsExpertsLoading] = useState(true);

    const [officeInfo, setOfficeInfo] = useState<OfficeInfo | undefined>(undefined);
    const [isOfficeInfoLoading, setIsOfficeInfoLoading] = useState(true);

    const [filteredExperts, setFilteredExperts] = useState<PersonState[]>([]);

    useEffect(() => {
        setFilteredExperts(filterExperts(experts, countryFilter.selected));
    }, [countryFilter.options, countryFilter.selected, experts]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(true).run(
            persons => {
                const team = persons.map(person => mapPersonToExpertState(person, countries));
                const orderedTeam = _(team).orderBy(["firstName"], ["asc"]).value();
                setOfficeTeam(orderedTeam);
                setIsTeamLoading(false);
            },
            () => {
                setOfficeTeam([]);
                setIsTeamLoading(false);
            }
        );
    }, [compositionRoot.about, countries]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(
            persons => {
                const experts = persons.map(person => mapPersonToExpertState(person, countries));

                const orderedExperts = _(experts)
                    .orderBy(
                        [expert => (expert.countryId === KOSOVO ? 1 : 0), "countryName", "firstName"], // Custom sort for Kosovo to be last
                        ["asc", "asc", "asc"]
                    )
                    .value();

                setExperts(orderedExperts);
                setIsExpertsLoading(false);
            },
            () => {
                setExperts([]);
                setIsExpertsLoading(false);
            }
        );
    }, [compositionRoot.about.getPersons, countries]);

    useEffect(() => {
        compositionRoot.about.getOfficeInfo.execute().run(
            info => {
                setOfficeInfo(info);
                setIsOfficeInfoLoading(false);
            },
            () => {
                setOfficeInfo(undefined);
                setIsOfficeInfoLoading(false);
            }
        );
    }, [compositionRoot.about.getOfficeInfo]);

    const onFilterChange = useCallback(() => {
        setFilteredExperts(filterExperts(experts, countryFilter.selected));
    }, [countryFilter.selected, experts]);

    return {
        officeInfo,
        team: officeTeam,
        experts: filteredExperts,
        countryFilter,
        onFilterChange,
        isLoading: isTeamLoading || isExpertsLoading || isOfficeInfoLoading,
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
