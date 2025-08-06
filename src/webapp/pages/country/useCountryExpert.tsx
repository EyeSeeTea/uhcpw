import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";
import { Person } from "../../../domain/entities/Person";
import { PersonState } from "../about/AboutState";
import {
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
} from "../../../data/repositories/countries/CountryD2Repository";
import { Id } from "../../../domain/entities/Ref";

type CountryExpert = {
    experts: PersonState[];
};

export function useCountryExpert(countryIds: Id[]): CountryExpert {
    const { compositionRoot, countriesAndSubregions } = useAppContext();
    const [experts, setExperts] = useState<PersonState[]>([]);

    const mappedCountryIds = useMemo(() => {
        return countryIds.map(id => {
            return id === FEDERACIJA_BOSNE_I_HERCEGOVINE || id === REPUBLICA_SERPSKA
                ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
                : id;
        });
    }, [countryIds]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(
            persons => {
                const mappedExperts = persons
                    .filter(person => person.countryId && mappedCountryIds.includes(person.countryId))
                    .map(person => mapPersonToExpertState(person, countriesAndSubregions))
                    .sort((a, b) => a.countryName.localeCompare(b.countryName));

                setExperts(mappedExperts);
            },
            () => setExperts([])
        );
    }, [compositionRoot.about.getPersons, countriesAndSubregions, mappedCountryIds]);

    return {
        experts,
    };
}

function mapPersonToExpertState(person: Person, countries: Country[]): PersonState {
    const country = countries.find(country => country.id === person.countryId);
    return { ...person, countryName: country?.name || "" };
}
