import { useCallback, useEffect, useState, useRef } from "react";
import { getThemeName, ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
import { Country } from "../../../../domain/entities/Country";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { ResourcesByTypeState, ResourceState } from "./ResourcesByTypeState";
import { useInfiniteScroll } from "./useInfiniteScroll";

const page_size = 5;

export function useResourcesByType(params: {
    category?: string;
    countriesFilter?: string[];
    themeFilter?: string;
    paging?: boolean;
    isFavouriteHome?: boolean;
    isFavouriteSection?: boolean;
    includeAdvancedSearch?: boolean;
}): ResourcesByTypeState {
    const { compositionRoot, countries, themes } = useAppContext();
    const { category, countriesFilter, themeFilter, paging } = params;
    const filters = useResourcesFilters({ category, countries: countriesFilter, theme: themeFilter });

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const isLoadingRef = useRef<boolean>(false);

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (filters.category.selected) {
            setItems([]);
            setCurrentPage(1);
            setHasMore(false);
            setLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [filters.category.selected]);

    useEffect(() => {
        const title = filters.category.options.find(cat => cat.value === filters.category.selected)?.text || "";

        setTitle(title === "Country or area analysis" ? "Country analysis" : title);
    }, [filters.category.options, filters.category.selected]);

    const loadResources = useCallback(
        (page: number, isLoadMore = false) => {
            if (isLoadingRef.current) {
                return;
            }

            isLoadingRef.current = true;

            if (!isLoadMore) {
                setLoading(true);
            }

            const cancel = compositionRoot.resources.get
                .execute({
                    searchTerm: filters.search.term,
                    category: params.category,
                    theme: filters.theme.selected,
                    countries: filters.country.selected,
                    years: filters.year.selected,
                    pageSize: paging ? page_size : undefined,
                    page: paging ? page : undefined,
                    isFavouriteHome: params.isFavouriteHome,
                    isFavouriteSection: filters.search.term ? undefined : params.isFavouriteSection,
                })
                .run(
                    response => {
                        isLoadingRef.current = false;

                        const newItems = buildResourcesBySection(response, countries, themes);

                        if (isLoadMore) {
                            setLoadingMore(false);
                        } else {
                            setLoading(false);
                        }

                        if (isLoadMore) {
                            setItems(prevItems => (prevItems ? [...prevItems, ...newItems] : newItems));
                        } else {
                            setItems(newItems);
                        }

                        // Determinar si hay más datos - hay más si recibimos al menos 1 elemento
                        const newHasMore = Boolean(paging && newItems.length > 0);
                        setHasMore(newHasMore);

                        // Si es la primera carga y hay datos, verificar si hay más páginas
                        if (!isLoadMore && paging && newItems.length === page_size) {
                            setHasMore(true);
                        }
                    },
                    () => {
                        if (isLoadMore) {
                            setLoadingMore(false);
                        } else {
                            setLoading(false);
                        }
                        isLoadingRef.current = false;
                        if (!isLoadMore) {
                            setItems([]);
                        }
                    }
                );

            return cancel;
        },
        [
            compositionRoot,
            filters.search.term,
            filters.theme.selected,
            filters.country.selected,
            filters.year.selected,
            params.category,
            params.isFavouriteHome,
            params.isFavouriteSection,
            paging,
            countries,
            themes,
        ]
    );

    const onGetResources = useCallback(() => {
        setCurrentPage(1);
        loadResources(1, false);
    }, [loadResources]);

    const onLoadMore = useCallback(() => {
        if (!hasMore || loadingMore || isLoadingRef.current) {
            return;
        }
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadResources(nextPage, true);
    }, [loadResources, hasMore, loadingMore, currentPage]);

    // Usar useInfiniteScroll internamente solo si hay paginación
    const { loadingRef } = useInfiniteScroll({
        onLoadMore,
        hasMore: paging ? hasMore : false,
        loadingMore,
    });

    useEffect(() => onGetResources(), [onGetResources]);

    return {
        loading,
        title,
        filters,
        items,
        onGetResources,
        hasMore,
        loadingMore,
        loadingRef,
    };
}

export function buildResourcesBySection(
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
