import { News } from "../../../../domain/entities/resources/Resource";
import { ComparativeAnalysisState, CountryAnalysisState, MultimediaState } from "../by-type/ResourcesByTypeState";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type LandingResourcesState = {
    countryAnalysisByCountry: CountryAnalysisCountry[];
    comparativeAnalysis: ComparativeAnalysisState[];
    news: News[];
    multimedia: MultimediaState[];
};

export type FilteredByTextOrThemeResourcesState = {
    countryAnalysis: CountryAnalysisState[];
    comparativeAnalysis: ComparativeAnalysisState[];
    news: News[];
    multimedia: MultimediaState[];
};

export type ResourcesState = {
    filters: ResourcesFiltersState;
    landingResources?: LandingResourcesState;
    filteredByTextOrThemeResources?: FilteredByTextOrThemeResourcesState;
    onGetResources: () => void;
    loading: boolean;
};

export type CountryAnalysisCountry = {
    kind: "flag";
    flag: string;
    countryId: string;
    countryName: string;
};
