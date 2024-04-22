import { useCallback, useEffect, useState } from "react";
import { CompositionRoot } from "../../../../CompositionRoot";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { getThemeName, ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
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
    includeAdvancedSearch?: boolean;
}): ResourcesByTypeState {
    const { compositionRoot, countries, themes } = useAppContext();
    const { category, countriesFilter, themeFilter, includeAdvancedSearch } = params;
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

        const cancel = Future.joinObj({
            normalResponse: compositionRoot.resources.get.execute({
                searchTerm: filters.search.term,
                category: params.category,
                theme: filters.theme.selected,
                countries: filters.country.selected,
                years: filters.year.selected,
                count: params.count,
                favourite: params.favourite,
                favouriteSection: filters.search.term ? undefined : params.favouriteSection,
            }),
            advancedResponse: includeAdvancedSearch
                ? executeAdvancedSearch(compositionRoot, countries, themes, filters.search.term)
                : Future.success([]),
        }).run(
            ({ normalResponse, advancedResponse }) => {
                setLoading(false);

                setItems(buildResourcesBySection([...normalResponse, ...advancedResponse], countries, themes));
            },
            () => {
                setLoading(false);
                setItems([]);
            }
        );

        return cancel;
    }, [
        compositionRoot,
        filters.search.term,
        filters.theme.selected,
        filters.country.selected,
        filters.year.selected,
        params.category,
        params.count,
        params.favourite,
        params.favouriteSection,
        includeAdvancedSearch,
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

function executeAdvancedSearch(
    compositionRoot: CompositionRoot,
    countries: Country[],
    themes: ResourceTheme[],
    searchTerm: string
): FutureData<Resource[]> {
    if (!searchTerm) {
        return Future.success([]);
    }

    const countryByTerm = countries.find(country => country.name.toLowerCase() === searchTerm.toLowerCase());
    const themeByTerm = themes.find(theme => theme.name.toLowerCase() === searchTerm.toLowerCase());

    return Future.joinObj({
        byCountryResponse: countryByTerm
            ? compositionRoot.resources.get.execute({
                  countries: [countryByTerm.id],
              })
            : Future.success([]),
        byThemeResponse: themeByTerm
            ? compositionRoot.resources.get.execute({
                  theme: themeByTerm.name,
              })
            : Future.success([]),
    }).map(({ byCountryResponse, byThemeResponse }) => {
        return [...byCountryResponse, ...byThemeResponse];
    });
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
