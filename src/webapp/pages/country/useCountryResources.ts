import { useEffect, useState } from "react";
import { Country } from "../../../domain/entities/Country";
import { ComparativeAnalysis, CountryAnalysis, Resource } from "../../../domain/entities/resources/Resource";
import { ResourceTheme, getThemeName } from "../../../domain/entities/resources/ResourceTheme";
import { useAppContext } from "../../contexts/app-context";
import { ResourceState } from "../resources/by-type/ResourcesByTypeState";

const RESOURCES_PRIORITY_TO_BE_SHOWN: Record<"country-analysis" | "comparative-analysis", number> = {
    "country-analysis": 1,
    "comparative-analysis": 2,
};

type CountryResourcesType = {
    loading: boolean;
    countryAnalysisResource?: ResourceState[];
    comparativeAnalysisResources?: ResourceState[];
};

export function useCountryResources(country: string): CountryResourcesType {
    const { compositionRoot, countries, themes } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [countryAnalysisResource, setCountryAnalysisResources] = useState<ResourceState[] | undefined>(undefined);
    const [comparativeAnalysisResources, setComparativeAnalysisResources] = useState<ResourceState[] | undefined>(
        undefined
    );

    useEffect(() => {
        setLoading(true);

        compositionRoot.resources.get
            .execute({
                countries: [country],
            })
            .run(
                resources => {
                    setLoading(false);
                    const resourceItems = buildResourcesBySection(resources, countries, themes, country);
                    setCountryAnalysisResources(resourceItems.filter(({ kind }) => kind === "country-analysis"));
                    setComparativeAnalysisResources(
                        resourceItems.filter(({ kind }) => kind === "comparative-analysis")
                    );
                },
                () => {
                    setLoading(false);
                    setComparativeAnalysisResources([]);
                    setCountryAnalysisResources([]);
                }
            );
    }, [compositionRoot.resources.get, countries, country, themes]);

    return {
        loading,
        countryAnalysisResource,
        comparativeAnalysisResources,
    };
}

function buildResourcesBySection(
    resources: Resource[],
    countries: Country[],
    themes: ResourceTheme[],
    countryOfPage: string
): ResourceState[] {
    const countryAndComparativeResources = resources.filter(
        ({ kind }) => kind === "country-analysis" || kind === "comparative-analysis"
    ) as (CountryAnalysis | ComparativeAnalysis)[];

    const uniqueResources = countryAndComparativeResources.reduce(
        (
            acc: (CountryAnalysis | ComparativeAnalysis)[],
            currentResource: CountryAnalysis | ComparativeAnalysis
        ): (CountryAnalysis | ComparativeAnalysis)[] => {
            const sameResourcesSortedByPriorityToBeShown = countryAndComparativeResources
                .filter(
                    resource =>
                        currentResource.id === resource.id &&
                        ((currentResource.kind === "country-analysis" && currentResource.countryId === countryOfPage) ||
                            currentResource.kind === "comparative-analysis")
                )
                .sort((resourceA, resourceB) => {
                    return (
                        RESOURCES_PRIORITY_TO_BE_SHOWN[resourceA.kind as "country-analysis" | "comparative-analysis"] -
                        RESOURCES_PRIORITY_TO_BE_SHOWN[resourceB.kind as "country-analysis" | "comparative-analysis"]
                    );
                });

            const isAlready = acc.find(({ id }) => currentResource.id === id);

            return isAlready || !sameResourcesSortedByPriorityToBeShown[0]
                ? acc
                : [...acc, sameResourcesSortedByPriorityToBeShown[0]];
        },
        []
    );

    return uniqueResources.map(item => {
        if (item.kind === "country-analysis") {
            const countryOfPageData = countries.find(({ id }) => id === countryOfPage);

            return {
                ...item,
                countryName: countryOfPageData?.name || "",
                countryFlag: countryOfPageData?.flag || "",
                themeName: getThemeName(themes, item.theme),
            };
        }

        return { ...item, themeName: getThemeName(themes, item.theme) };
    });
}
