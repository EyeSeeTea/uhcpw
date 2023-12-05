import { useCallback, useEffect, useState } from "react";
import { getThemeName } from "../../../../domain/entities/resources/ResourceTheme";
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
                favouriteSection: params.favouriteSection,
            })
            .run(
                resources => {
                    setLoading(false);

                    const finalItems = resources.map(item => {
                        if (item.kind === "news") {
                            return item;
                        } else if (item.kind === "country-analysis") {
                            const country = countries.find(country => country.id === item.countryId);

                            return {
                                ...item,
                                countryName: country?.name || "",
                                countryFlag: country?.flag || "",
                                themeName: getThemeName(themes, item.theme),
                            };
                        } else {
                            return {
                                ...item,
                                themeName: getThemeName(themes, item.theme),
                            };
                        }
                    });

                    setItems(finalItems);
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
