import { News } from "../../../../domain/entities/resources/Resource";
import { ComparativeAnalysisState, CountryAnalysisState, MultimediaState } from "../by-type/ResourcesByTypeState";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type LandingResourcesState = {
    countryAnalysisByCountry: CountryAnalysisCountry[];
    comparativeAnalysis: ComparativeAnalysisState[];
    news: News[];
    multimedia: MultimediaState[];
};

export type FilteredByTextResourcesState = {
    countryAnalysis: CountryAnalysisState[];
    comparativeAnalysis: ComparativeAnalysisState[];
    news: News[];
    multimedia: MultimediaState[];
};

export type ResourcesState = {
    filters: ResourcesFiltersState;
    landingResources?: LandingResourcesState;
    filteredByTextResources?: FilteredByTextResourcesState;
    onGetResources: () => void;
};

interface CountryAnalysisCountry {
    flag: string;
    countryId: string;
    countryName: string;
}
