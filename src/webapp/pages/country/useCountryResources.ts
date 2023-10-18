import { useEffect, useState } from "react";
import { getThemeName } from "../../../domain/entities/resources/ResourceTheme";
import { useAppContext } from "../../contexts/app-context";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

type CountryResourcesType = {
    loading: boolean;
    items?: ResourceState[];
};

export function useCountryResources(country?: string[]): CountryResourcesType {
    const { compositionRoot, countries, themes } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        compositionRoot.resources.get
            .execute({
                countries: country,
            })
            .run(
                items => {
                    setLoading(false);
                    const finalItems = items.map(item => {
                        if (item.kind === "news") {
                            return item;
                        }
                        if (item.kind === "country-analysis") {
                            const country = countries.find(country => country.id === item.countryId);

                            return {
                                ...item,
                                countryName: country?.name || "",
                                countryFlag: country?.flag || "",
                                themeName: getThemeName(themes, item.theme),
                            };
                        } else {
                            return { ...item, themeName: getThemeName(themes, item.theme) };
                        }
                    });

                    setItems(finalItems);
                },
                () => {
                    setLoading(false);
                    setItems([]);
                }
            );
    }, [compositionRoot.resources.get, countries, country, themes]);

    return {
        loading,
        items,
    };
}
