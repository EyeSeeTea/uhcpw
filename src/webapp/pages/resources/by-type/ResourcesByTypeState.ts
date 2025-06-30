import { ComparativeAnalysis, CountryAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";
import { RefObject } from "react";

export type ResourcesByTypeState = {
    loading: boolean;
    title: string;
    filters: ResourcesFiltersState;
    items?: ResourceState[];
    onGetResources: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    loadingRef: RefObject<HTMLDivElement>;
};

export type ResourceState = News | MultimediaState | CountryAnalysisState | ComparativeAnalysisState;

export interface CountryAnalysisState extends CountryAnalysis {
    countryName: string;
    countryFlag: string;
    themeName: string;
}

export interface ComparativeAnalysisState extends ComparativeAnalysis {
    themeName: string;
}

export interface MultimediaState extends Multimedia {
    themeName: string;
}
