import _ from "lodash";
import { useEffect, useMemo } from "react";
import { Country } from "../../../../domain/entities/Country";
import { ComparativeAnalysis, CountryAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { useAppContext } from "../../../contexts/app-context";
import { ResourceState } from "../by-type/ResourcesByTypeState";
import { useResourcesByType } from "../by-type/useResourcesByType";
import { ResourcesState } from "./ResourcesState";

export function useResources(): ResourcesState {
    const { countries } = useAppContext();
    const { filters, items, onGetResources } = useResourcesByType({});

    useEffect(() => onGetResources(), [onGetResources]);

    const resources = useMemo(() => {
        return items
            ? {
                  countryAnalysisByCountry: getAnalysisCountries(items, countries),
                  comparativeAnalysis: items
                      .filter(item => item.kind === "comparative-analysis")
                      .slice(0, 4) as ComparativeAnalysis[],
                  news: items.filter(item => item.kind === "news").slice(0, 1) as News[],
                  multimedia: items.filter(item => item.kind === "multimedia").slice(0, 1) as Multimedia[],
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
        items
            .filter(item => item.kind === "country-analysis")
            .map(countryAnalysis => {
                const countryId = (countryAnalysis as CountryAnalysis).countryId;
                const country = countries.find(country => country.id === countryId);
                return { countryId, flag: country?.flag || "" };
            }),
        country => country.countryId
    );
}
