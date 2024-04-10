import { useCallback, useEffect, useState } from "react";
import { ResourceTheme, getThemeName } from "../../../../domain/entities/resources/ResourceTheme";
import { Country } from "../../../../domain/entities/Country";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState, ResourceState } from "./ResourcesByTypeState";

export function useResourcesByType(params: {
    category?: string;
    countriesFilter?: string[];
    count?: number;
    favourite?: boolean;
    themeFilter?: string;
    favouriteSection?: boolean;
}): ResourcesByTypeState {
    const { compositionRoot, countries, themes } = useAppContext();
    const { category, countriesFilter, themeFilter } = params;
    const filters = useResourcesFilters({ category, countries: countriesFilter, theme: themeFilter });

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (filters.category.selected) {
            setItems([]);
        }
    }, [filters.category.selected]);

    useEffect(() => {
        const title = filters.category.options.find(cat => cat.value === filters.category.selected)?.text || "";

        setTitle(title);
    }, [filters.category.options, filters.category.selected]);

    const onGetResources = useCallback(() => {
        setLoading(true);

        const cancel = compositionRoot.resources.get
            .execute({
                searchTerm: filters.search.term,
                category: params.category,
                theme: filters.theme.selected,
                countries: filters.country.selected,
                years: filters.year.selected,
                count: params.count,
                favourite: params.favourite,
                favouriteSection: filters.search.term ? undefined : params.favouriteSection,
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

        return cancel;
    }, [
        compositionRoot.resources.get,
        filters.search.term,
        filters.theme.selected,
        filters.country.selected,
        filters.year.selected,
        params.category,
        params.count,
        params.favourite,
        params.favouriteSection,
        countries,
        themes,
    ]);

    useEffect(() => onGetResources(), [onGetResources]);

    return {
        loading,
        title,
        filters,
        items,
        onGetResources,
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

        return {
            ...item,
            themeName: getThemeName(themes, item.theme),
        };
    });
}
