import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState, ResourceState } from "./ResourcesByTypeState";

export function useResourcesByType(params: {
    category?: string;
    countriesFilter?: string[];
    count?: number;
    favourite?: boolean;
    favouriteSection?: boolean;
}): ResourcesByTypeState {
    const { compositionRoot, countries } = useAppContext();
    const filters = useResourcesFilters(params.category, params.countriesFilter);

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);
    const [selectedCountry, setSelectedCountry] = useState<string[] | undefined>([""]);

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (filters.country.selected) {
            setSelectedCountry(filters.country.selected);
        }
    }, [filters.country.selected]);

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
                countries: selectedCountry,
                years: filters.year.selected,
                count: params.count,
                favourite: params.favourite,
                favouriteSection: params.favouriteSection,
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

        return cancel;
    }, [
        compositionRoot.resources.get,
        countries,
        selectedCountry,
        filters.search.term,
        filters.theme.selected,
        filters.year.selected,
        params.category,
        params.count,
        params.favourite,
        params.favouriteSection,
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
