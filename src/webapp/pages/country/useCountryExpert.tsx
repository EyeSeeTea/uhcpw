import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { Country } from "../../../domain/entities/Country";
import { Person } from "../../../domain/entities/Person";
import { PersonState } from "../about/AboutState";

type CountryExpert = {
    experts: PersonState[];
};

export function useCountryExpert(country?: string[]): CountryExpert {
    const { compositionRoot, countries } = useAppContext();
    const [experts, setExperts] = useState<PersonState[]>([]);

    useEffect(() => {
        compositionRoot.about.getPersons.execute(false).run(
            persons => {
                setExperts(
                    persons
                        .filter(person => person.countryId === country?.[0])
                        .map(person => mapPersonToExpertState(person, countries))
                );
            },
            () => setExperts([])
        );
    }, [compositionRoot.about.getPersons, countries, country]);

    function mapPersonToExpertState(person: Person, countries: Country[]): PersonState {
        const country = countries.find(country => country.id === person.countryId);

        return { ...person, countryName: country?.name || "" };
    }

    return {
        experts,
    };
}
