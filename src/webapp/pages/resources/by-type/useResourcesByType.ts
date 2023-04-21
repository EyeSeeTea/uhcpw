import { useEffect, useState } from "react";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState } from "./ResourcesByTypeState";

export function useResourcesByType(category: string): ResourcesByTypeState {
    const { compositionRoot } = useAppContext();
    const filters = useResourcesFilters(category);

    const [items, setItems] = useState<Resource[]>([]);

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        const title = filters.categoryFilters.find(cat => cat.value === filters.selectedCategoryFilter)?.text || "";

        setTitle(title);
    }, [filters.categoryFilters, category]);

    useEffect(() => {
        compositionRoot.resources.get.execute(category, filters.selectedThemeFilter, filters.selectedYearFilter).run(
            items => setItems(items),
            () => {
                setItems([]);
            }
        );
    }, [compositionRoot.resources, category, filters.selectedThemeFilter, filters.selectedYearFilter]);

    return {
        title,
        filters,
        items,
    };
}
