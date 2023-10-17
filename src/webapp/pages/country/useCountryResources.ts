import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

type CountryResourcesType = {
    loading: boolean;
    items?: ResourceState[];
};

export function useCountryResources(country: string): CountryResourcesType {
    const { compositionRoot, countries } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        compositionRoot.resources.get
            .execute({
                countries: [country],
            })
            .run(
                items => {
                    setLoading(false);
                    const finalItems = items.map(item => {
                        if (item.kind === "country-analysis") {
                            const country = countries.find(country => country.id === item.countryId);

                            return { ...item, countryName: country?.name || "", countryFlag: country?.flag || "" };
                        } else {
                            return item;
                        }
                    });

                    setItems(finalItems);
                },
                () => {
                    setLoading(false);
                    setItems([]);
                }
            );
    }, [compositionRoot.resources.get, countries, country]);

    return {
        loading,
        items,
    };
}
