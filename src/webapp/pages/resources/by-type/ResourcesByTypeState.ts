import { ComparativeAnalysis, CountryAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { getResourceThemes, ResourceTheme } from "../../../../domain/entities/resources/ResourceTheme";
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

export type ThemesState = Readonly<{
    /** Names of the main and secondary themes joined with commas, as sent to analytics */
    analyticsTheme: string;
    /** Main and secondary themes, in display order */
    resourceThemes: ReadonlyArray<ResourceTheme>;
}>;

export interface CountryAnalysisState extends CountryAnalysis, ThemesState {
    countryName: string;
    countryFlag: string;
}

export interface ComparativeAnalysisState extends ComparativeAnalysis, ThemesState {}

export interface MultimediaState extends Multimedia, ThemesState {}

export function buildThemesState(themes: ReadonlyArray<ResourceTheme>, themeCodes: ReadonlyArray<string>): ThemesState {
    const resourceThemes = getResourceThemes(themes, themeCodes);

    return { analyticsTheme: resourceThemes.map(theme => theme.name).join(", "), resourceThemes };
}
