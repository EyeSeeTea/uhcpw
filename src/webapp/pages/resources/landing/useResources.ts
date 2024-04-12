import _ from "lodash";
import { useMemo } from "react";
import { Country } from "../../../../domain/entities/Country";
import { CountryAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { ComparativeAnalysisState, ResourceState } from "../by-type/ResourcesByTypeState";
import { useResourcesByType } from "../by-type/useResourcesByType";
import { ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { countries } = useAppContext();
    const { filters, items, onGetResources } = useResourcesByType({
        favouriteSection: true,
        includeAdvancedSearch: true,
    });

    const resources = useMemo(() => {
        return items
            ? {
                  countryAnalysisByCountry: getAnalysisCountries(items, countries),
                  comparativeAnalysis: getComparativeAnalysis(items),
                  news: getNews(items),
                  multimedia: getMultimedia(items),
              }
            : undefined;
    }, [countries, items]);

    return {
        filters,
        resources,
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

function getNews(items: ResourceState[]): News[] {
    return _.orderBy(
        items.filter(item => item.kind === "news"),
        "favouriteSectionOrder"
    ).slice(0, 1) as News[];
}

function getMultimedia(items: ResourceState[]): Multimedia[] {
    return _.orderBy(
        items.filter(item => item.kind === "multimedia"),
        "favouriteSectionOrder"
    ).slice(0, 1) as Multimedia[];
}

function getComparativeAnalysis(items: ResourceState[]): ComparativeAnalysisState[] {
    return _.orderBy(
        items.filter(item => item.kind === "comparative-analysis"),
        "favouriteSectionOrder"
    ).slice(0, 6) as ComparativeAnalysisState[];
}
