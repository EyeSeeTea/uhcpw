import { useCallback, useEffect, useState } from "react";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export function useResourcesByType(category?: string): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();
    const filters = useResourcesFilters(category);

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<Resource[] | undefined>(undefined);

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
        compositionRoot.resources.get
            .execute({
                searchTerm: filters.search.term,
                category,
                theme: filters.theme.selected,
                years: filters.year.selected,
            })
            .run(
                items => {
                    setLoading(false);
                    setItems(items);
                },
                () => {
                    setLoading(false);
                    setItems([]);
                }
            );
    }, [compositionRoot.resources, category, filters.theme.selected, filters.year.selected, filters.search.term]);

    return {
        loading,
        title,
        filters,
        items,
        onGetResources,
    };
}
