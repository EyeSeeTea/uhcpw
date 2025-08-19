import { News, Resource } from "../../../../domain/entities/resources/Resource";
import { ComparativeAnalysisState, ResourceState, MultimediaState } from "../by-type/ResourcesByTypeState";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type LandingResourcesState = {
    countryAnalysisByCountry: CountryAnalysisCountry[];
    comparativeAnalysis: ComparativeAnalysisState[];
    news: News[];
    multimedia: MultimediaState[];
};

export type ResourceSectionKind = Resource["kind"] | "country-comparative-analysis";
export type ResourcesListBySectionState = {
    title: string;
    seeAllUrl: string;
    kind: ResourceSectionKind;
    resources: ResourceState[];
};

export type ResourcesState = {
    filters: ResourcesFiltersState;
    landingResources?: LandingResourcesState;
    resourcesBySection?: ResourcesListBySectionState[];
    onGetResources: () => void;
    loading: boolean;
};

export type CountryAnalysisCountry = {
    kind: "flag";
    flag: string;
    countryId: string;
    countryName: string;
};
