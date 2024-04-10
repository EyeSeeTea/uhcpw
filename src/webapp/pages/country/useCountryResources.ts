import { useEffect, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { Resource } from "../../../domain/entities/resources/Resource";
import { ResourceTheme, getThemeName } from "../../../domain/entities/resources/ResourceTheme";
import { useAppContext } from "../../contexts/app-context";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

const RESOURCES_PRIORITY_TO_BE_SHOWN: Record<
    "country-analysis" | "comparative-analysis" | "news" | "multimedia",
    number
> = {
    "country-analysis": 1,
    "comparative-analysis": 2,
    news: 3,
    multimedia: 4,
};

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
    const uniqueResources = resources.reduce((acc: Resource[], resource: Resource): Resource[] => {
        const sameResourcesSortedByPriorityToBeShown = resources
            .filter(({ id }) => resource.id === id)
            .sort((resourceA, resourceB) => {
                return RESOURCES_PRIORITY_TO_BE_SHOWN[resourceA.kind] - RESOURCES_PRIORITY_TO_BE_SHOWN[resourceB.kind];
            });

        const isAlready = acc.find(({ id }) => resource.id === id);

        return isAlready || !sameResourcesSortedByPriorityToBeShown[0]
            ? acc
            : [...acc, sameResourcesSortedByPriorityToBeShown[0]];
    }, []);

    return uniqueResources.map(item => {
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
