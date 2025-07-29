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

type CountryExpert = {
    experts: PersonState[];
};

export function useCountryExpert(country: string): CountryExpert {
    const { compositionRoot, countriesAndSubregions } = useAppContext();
    const [experts, setExperts] = useState<PersonState[]>([]);

    const countryId = useMemo(() => {
        return country === FEDERACIJA_BOSNE_I_HERCEGOVINE || country === REPUBLICA_SERPSKA
            ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
            : country;
    }, [country]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(
            persons => {
                setExperts(
                    persons
                        .filter(person => person.countryId === countryId)
                        .map(person => mapPersonToExpertState(person, countriesAndSubregions))
                );
            },
            () => setExperts([])
        );
    }, [compositionRoot.about.getPersons, countriesAndSubregions, countryId]);

    function mapPersonToExpertState(person: Person, countries: Country[]): PersonState {
        const country = countries.find(country => country.id === person.countryId);

        return { ...person, countryName: country?.name || "" };
    }

    return {
        experts,
    };
}
