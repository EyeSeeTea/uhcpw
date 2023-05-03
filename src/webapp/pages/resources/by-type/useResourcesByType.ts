import { useEffect, useState } from "react";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export function useResourcesByType(category: string): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();
    const filters = useResourcesFilters(category);

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<Resource[]>([]);

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        const title = filters.categoryFilters.find(cat => cat.value === filters.selectedCategoryFilter)?.text || "";

        setTitle(title);
    }, [filters.categoryFilters, filters.selectedCategoryFilter]);

    useEffect(() => {
        setLoading(true);
        compositionRoot.resources.get
            .execute({
                searchTerm: filters.searchTerm,
                category,
                theme: filters.selectedThemeFilter,
                year: filters.selectedYearFilter,
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
    }, [
        compositionRoot.resources,
        category,
        filters.selectedThemeFilter,
        filters.selectedYearFilter,
        filters.searchTerm,
    ]);

    return {
        loading,
        title,
        filters,
        items,
    };
}
