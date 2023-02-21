import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useEffect, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { useAppContext } from "../../contexts/app-context";

export function useCountryMenuItems() {
    const { compositionRoot } = useAppContext();
    const [countries, setCountries] = useState<Country[]>([]);
    const snackbar = useSnackbar();

    useEffect(() => {
        compositionRoot.countries.get.execute().run(setCountries, () => {
            setCountries([]);
        });
    }, [compositionRoot.countries, snackbar]);

    return countries;
}
