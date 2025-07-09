import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Country } from "../../../../domain/entities/Country";
import { News, Resource } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import {
    ComparativeAnalysisState,
    CountryAnalysisState,
    MultimediaState,
    ResourceState,
} from "../by-type/ResourcesByTypeState";
import { CountryAnalysisCountry, ResourcesState } from "./ResourcesState";
import { useHistory } from "react-router-dom";
import { useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { buildResourcesBySection } from "../by-type/useResourcesByType";
import { useResourcesFilters } from "../common/useResourcesFilters";
import { Future, FutureData } from "../../../../domain/entities/Future";
import { ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
import { CompositionRoot } from "../../../../CompositionRoot";

export function useResources(): ResourcesState {
    const { compositionRoot, countries, themes } = useAppContext();
    const history = useHistory();
    const isSmallScreen = useIsSmallScreen();

    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<ResourceState[] | undefined>(undefined);

    const themeFilter = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const theme = searchParams.get("theme");

        return theme ?? undefined;
    }, [history.location.search]);

    const filters = useResourcesFilters({ theme: themeFilter });

    const onGetResources = useCallback(() => {
        setLoading(true);

        const cancel = Future.joinObj({
            normalResponse: compositionRoot.resources.get.execute({
                searchTerm: filters.search.term,
                theme: filters.theme.selected,
                countries: filters.country.selected,
                years: filters.year.selected,
                isFavouriteSection: filters.search.term ? undefined : true,
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

    const filteredByTextOrThemeResources = useMemo(() => {
        return items && (!!filters.search.term || !!filters.theme.selected)
            ? {
                  countryAnalysis: _.orderBy(
                      items.filter(item => item.kind === "country-analysis"),
                      "date",
                      "desc"
                  ) as CountryAnalysisState[],
                  comparativeAnalysis: _.orderBy(getComparativeAnalysis(items, false), "date", "desc"),
                  news: _.orderBy(getNews(items, false), "date", "desc"),
                  multimedia: _.orderBy(getMultimedia(items, false), "date", "desc"),
              }
            : undefined;
    }, [filters.search.term, filters.theme.selected, items]);

    return {
        loading,
        filters,
        landingResources,
        filteredByTextOrThemeResources,
        onGetResources,
    };
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
