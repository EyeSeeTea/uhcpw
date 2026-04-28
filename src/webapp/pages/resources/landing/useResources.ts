import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import { News, Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { ComparativeAnalysisState, MultimediaState, ResourceState } from "../by-type/ResourcesByTypeState";
import {
    CountryAnalysisCountry,
    ResourceSectionKind,
    ResourcesListBySectionState,
    ResourcesState,
} from "./ResourcesState";
import { useParams } from "react-router-dom";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { buildResourcesBySection } from "../by-type/useResourcesByType";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
import { CompositionRoot } from "../../../../CompositionRoot";
import i18n from "../../../../locales";
import { findThemeFromParam } from "../../../utils/formatResourcesThemeParamName";

const RESOURCES_PRIORITY: Record<"country-analysis" | "comparative-analysis" | "news" | "multimedia", number> = {
    "country-analysis": 1,
    "comparative-analysis": 2,
    multimedia: 3,
    news: 4,
};

export function useResources(): ResourcesState {
    const { compositionRoot, countries, themes } = useAppContext();
    const isSmallScreen = useIsSmallScreen();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    const { theme } = useParams<{
        theme?: string;
    }>();

    const themeFilter = useMemo(() => {
        const foundTheme = theme ? findThemeFromParam(themes, theme) : undefined;

        // NOTICE: use theme name to filter resources by theme in ResourceRepository get()
        const themeName = foundTheme ? foundTheme?.name : undefined;

        return themeName;
    }, [theme, themes]);

    const filters = useResourcesFilters({ theme: themeFilter });

    useEffect(() => {
        // Reset items when these filters change to avoid showing stale data
        setItems([]);
    }, [filters.search.term, filters.theme.selected]);

    const onGetResources = useCallback(() => {
        setLoading(true);

        const cancel = Future.joinObj({
            normalResponse: compositionRoot.resources.get.execute({
                searchTerm: filters.search.term,
                theme: filters.theme.selected,
                countries: filters.country.selected,
                years: filters.year.selected,
                isFavouriteSection: filters.theme.selected || filters.search.term ? undefined : true,
            }),
            advancedResponse: executeAdvancedSearch(compositionRoot, countries, themes, filters.search.term),
        }).run(
            ({ normalResponse, advancedResponse }) => {
                setLoading(false);

                const mergedResponses = [
                    ...normalResponse.filter(({ id, kind }) => {
                        const isNormalAlreadyIncludedInAdvanced = advancedResponse.some(
                            advanced => advanced.id === id && advanced.kind === kind
                        );
                        return !isNormalAlreadyIncludedInAdvanced;
                    }),
                    ...advancedResponse,
                ];

                setItems(buildResourcesBySection(mergedResponses, countries, themes));
            },
            () => {
                setLoading(false);
                setItems([]);
            }
        );

        return cancel;
    }, [
        compositionRoot,
        countries,
        filters.country.selected,
        filters.search.term,
        filters.theme.selected,
        filters.year.selected,
        themes,
    ]);

    useEffect(() => onGetResources(), [onGetResources]);

    const landingResources = useMemo(() => {
        return items && !filters.search.term && !filters.theme.selected
            ? {
                  countryAnalysisByCountry: getFavoriteAnalysisCountries(countries),
                  comparativeAnalysis: getComparativeAnalysis(items, true),
                  news: getNews(items, true, isSmallScreen),
                  multimedia: getMultimedia(items, true, isSmallScreen),
              }
            : undefined;
    }, [countries, filters.search.term, filters.theme.selected, isSmallScreen, items]);

    const resourcesBySection = useMemo(() => {
        const hasSearchTerm = !!filters.search.term;
        return items && (hasSearchTerm || !!filters.theme.selected)
            ? buildResourcesSections(items, hasSearchTerm)
            : undefined;
    }, [filters.search.term, filters.theme.selected, items]);

    return {
        loading,
        filters,
        landingResources,
        resourcesBySection,
        onGetResources,
    };
}

function buildResourcesSections(resources: ResourceState[], hasSearchTerm: boolean): ResourcesListBySectionState[] {
    return _(resources)
        .groupBy(item => getResourceSection(item.kind, hasSearchTerm))
        .map((items, key) => {
            const kind = key as ResourceSectionKind;
            const sectionDetails = getSectionDetails(kind);
            return {
                kind: kind,
                title: sectionDetails.title,
                seeAllUrl: sectionDetails.seeAllUrl,
                order: sectionDetails.order,
                resources: _(items)
                    .orderBy(item => item.date, "desc")
                    .orderBy(item => RESOURCES_PRIORITY[item.kind], ["asc"])
                    .value(),
            };
        })
        .orderBy(section => section.order)
        .value();
}

function getResourceSection(kind: Resource["kind"], hasSearchTerm: boolean): ResourceSectionKind {
    switch (kind) {
        case "country-analysis":
        case "comparative-analysis":
            return hasSearchTerm ? "country-comparative-analysis" : kind;
        default:
            return kind;
    }
}

function getSectionDetails(kind: ResourceSectionKind) {
    switch (kind) {
        case "country-comparative-analysis":
            return {
                title: "",
                seeAllUrl: "",
                order: 0,
            };
        case "country-analysis":
            return {
                title: i18n.t("Country or area analysis"),
                seeAllUrl: "/resources/country-analysis",
                order: 1,
            };
        case "comparative-analysis":
            return {
                title: i18n.t("Comparative analysis"),
                seeAllUrl: "/resources/comparative-analysis",
                order: 2,
            };
        case "multimedia":
            return {
                title: i18n.t("Multimedia"),
                seeAllUrl: "/resources/multimedia",
                order: 3,
            };
        case "news":
            return {
                title: i18n.t("News"),
                seeAllUrl: "/resources/news",
                order: 4,
            };
        default:
            return { title: "", seeAllUrl: "", order: 10 };
    }
}

function getFavoriteAnalysisCountries(countries: Country[]): CountryAnalysisCountry[] {
    return _.unionBy(
        _.orderBy(
            countries
                .filter(country => country.showCountryFlag)
                .map(country => {
                    return {
                        countryId: country.id,
                        countryName: country.name || "",
                        flag: country.flag || "",
                        kind: "flag",
                    };
                }),
            "countryName"
        ),
        country => country.countryId
    );
}

function getNews(items: ResourceState[], isLanding: boolean, isSmallScreen?: boolean): News[] {
    const news = _.orderBy(
        items.filter(item => item.kind === "news"),
        "favouriteSectionOrder"
    ) as News[];

    const totalFavorites = isSmallScreen ? 6 : 1;

    return isLanding ? news.slice(0, totalFavorites) : news;
}

function getMultimedia(items: ResourceState[], isLanding: boolean, isSmallScreen?: boolean): MultimediaState[] {
    const multimedia = _.orderBy(
        items.filter(item => item.kind === "multimedia"),
        "favouriteSectionOrder"
    ) as MultimediaState[];

    const totalFavorites = isSmallScreen ? 6 : 1;

    return isLanding ? multimedia.slice(0, totalFavorites) : multimedia;
}

function getComparativeAnalysis(items: ResourceState[], isLanding: boolean): ComparativeAnalysisState[] {
    const comparativeAnalysis = _.orderBy(
        items.filter(item => item.kind === "comparative-analysis"),
        "favouriteSectionOrder"
    ) as ComparativeAnalysisState[];

    return isLanding ? comparativeAnalysis.filter(item => !!item.favouriteSection).slice(0, 6) : comparativeAnalysis;
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
