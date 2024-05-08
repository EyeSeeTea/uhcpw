import _ from "lodash";
import { useMemo } from "react";
import { Country } from "../../../../domain/entities/Country";
import { CountryAnalysis, News } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import {
    ComparativeAnalysisState,
    CountryAnalysisState,
    MultimediaState,
    ResourceState,
} from "../by-type/ResourcesByTypeState";
import { useResourcesByType } from "../by-type/useResourcesByType";
import { ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { countries } = useAppContext();
    const { filters, items, onGetResources } = useResourcesByType({
        favouriteSection: true,
        includeAdvancedSearch: true,
    });

    const landingResources = useMemo(() => {
        return items && !filters.search.term
            ? {
                  countryAnalysisByCountry: getAnalysisCountries(items, countries),
                  comparativeAnalysis: getComparativeAnalysis(items, true),
                  news: getNews(items, true),
                  multimedia: getMultimedia(items, true),
              }
            : undefined;
    }, [countries, filters.search.term, items]);

    const filteredByTextResources = useMemo(() => {
        return items && !!filters.search.term
            ? {
                  countryAnalysis: items.filter(item => item.kind === "country-analysis") as CountryAnalysisState[],
                  comparativeAnalysis: getComparativeAnalysis(items, false),
                  news: getNews(items, false),
                  multimedia: getMultimedia(items, false),
              }
            : undefined;
    }, [filters.search.term, items]);

    return {
        filters,
        landingResources,
        filteredByTextResources,
        onGetResources,
    };
}
function getAnalysisCountries(items: ResourceState[], countries: Country[]) {
    return _.unionBy(
        _.orderBy(
            items
                .filter(item => item.kind === "country-analysis")
                .map(countryAnalysis => {
                    const countryId = (countryAnalysis as CountryAnalysis).countryId;
                    const country = countries.find(country => country.id === countryId);
                    return { countryId, countryName: country?.name || "", flag: country?.flag || "" };
                }),
            "countryName"
        ),
        country => country.countryId
    );
}

function getNews(items: ResourceState[], isLanding: boolean): News[] {
    const news = _.orderBy(
        items.filter(item => item.kind === "news"),
        "favouriteSectionOrder"
    ) as News[];

    return isLanding ? news.slice(0, 1) : news;
}

function getMultimedia(items: ResourceState[], isLanding: boolean): MultimediaState[] {
    const multimedia = _.orderBy(
        items.filter(item => item.kind === "multimedia"),
        "favouriteSectionOrder"
    ) as MultimediaState[];

    return isLanding ? multimedia.slice(0, 1) : multimedia;
}

function getComparativeAnalysis(items: ResourceState[], isLanding: boolean): ComparativeAnalysisState[] {
    const comparativeAnalysis = _.orderBy(
        items.filter(item => item.kind === "comparative-analysis"),
        "favouriteSectionOrder"
    ) as ComparativeAnalysisState[];

    return isLanding ? comparativeAnalysis.slice(0, 6) : comparativeAnalysis;
}
