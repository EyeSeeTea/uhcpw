import { useEffect, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import { useAppContext } from "../../../contexts/app-context";

export function useCountries() {
    const { compositionRoot } = useAppContext();
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        compositionRoot.countries.get.execute().run(setCountries, () => {
            setCountries([]);
        });
    }, [compositionRoot.countries]);

    return countries;
}
