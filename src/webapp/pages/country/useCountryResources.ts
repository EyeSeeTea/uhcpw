import { useEffect, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { Resource } from "../../../domain/entities/resources/Resource";
import { ResourceTheme, getThemeName } from "../../../domain/entities/resources/ResourceTheme";
import { useAppContext } from "../../contexts/app-context";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

type CountryResourcesType = {
    loading: boolean;
    items?: ResourceState[];
};

export function useCountryResources(country: string): CountryResourcesType {
    const { compositionRoot, countries, themes } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    useEffect(() => {
        setLoading(true);

        compositionRoot.resources.get
            .execute({
                countries: [country],
            })
            .run(
                resources => {
                    setLoading(false);
                    setItems(buildResourcesBySection(resources, countries, themes));
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

function buildResourcesBySection(
    resources: Resource[],
    countries: Country[],
    themes: ResourceTheme[]
): ResourceState[] {
    return resources.map(item => {
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
        }

        return { ...item, themeName: getThemeName(themes, item.theme) };
    });
}
