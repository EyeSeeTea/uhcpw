import {
    ComparativeAnalysis,
    CountryAnalysis,
    Multimedia,
    News,
    Resource,
} from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesByTypeState = {
    loading: boolean;
    title: string;
    filters: ResourcesFiltersState;
    items: ResourceState[];
    onGetResources: () => void;
};

export type ResourceState = News | Multimedia | CountryAnalysisState | ComparativeAnalysis;

export interface CountryAnalysisState extends CountryAnalysis {
    countryName: string;
    countryFlag: string;
}
