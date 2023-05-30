import { useCallback, useEffect, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState, ResourceState } from "./ResourcesByTypeState";

export function useResourcesByType(category: string): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();
    const filters = useResourcesFilters(category);

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[]>([]);

    const [title, setTitle] = useState<string>("");

    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        setItems([]);
    }, [filters.category.selected]);

    useEffect(() => {
        const title = filters.category.options.find(cat => cat.value === filters.category.selected)?.text || "";

        setTitle(title);
    }, [filters.category.options, filters.category.selected]);

    useEffect(() => {
        setLoading(true);
        compositionRoot.countries.get.execute().run(
            countries => {
                setLoading(false);
                setCountries(countries);
            },
            () => {
                setLoading(false);
                setCountries([]);
            }
        );
    }, [compositionRoot.countries.get]);

    const onGetResources = useCallback(() => {
        setLoading(true);
        compositionRoot.resources.get
            .execute({
                searchTerm: filters.search.term,
                category,
                theme: filters.theme.selected,
                countries: filters.country.selected,
                years: filters.year.selected,
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
    }, [
        compositionRoot.resources.get,
        filters.search.term,
        filters.theme.selected,
        filters.country.selected,
        filters.year.selected,
        category,
        countries,
    ]);

    return {
        loading,
        title,
        filters,
        items,
        onGetResources,
    };
}
