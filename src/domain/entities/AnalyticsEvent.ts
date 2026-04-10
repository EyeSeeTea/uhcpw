import { Maybe } from "../../types/utils";

type PageViewEvent = {
    name: "page_view";
    pageLocation: string;
    pageTitle: string;
};

type CountryPageViewEvent = {
    name: "country_page_view";
    pageTitle: string;
    country: string;
};

type ResourceKindPageViewEvent = {
    name: "resource_kind_page_view";
    pageTitle: string;
    category: string;
};

type FileDownloadEvent = {
    name: "file_download";
    pageTitle: string;
    contentType: string;
    contentGroup: string;
    contentId: Maybe<string>;
};

type ResourceEvent = {
    name: "resource";
    category: string;
    pageTitle: string;
    resourceName: string;
    year: number;
    theme?: string;
    language?: string;
    country?: string;
};

type ExternalLinkEvent = {
    name: "external_link";
    text: string;
    href: string;
};

type IndicatorExplorerSummaryEvent = {
    name: "indicator_explorer_summary";
    indicator: string;
    allCountriesSelected: boolean;
    allYearsSelected: boolean;
    yearsSelected: string[];
    eu27average: boolean;
    numberOfCountries: number;
};

type IndicatorExplorerEvent = {
    name: "indicator_explorer";
    indicator: string;
    country: string;
    year: string;
};

type PolicyExplorerSummaryEvent = {
    name: "policy_explorer_summary";
    numberOfCategories: number;
    numberOfSubcategories: number;
    allCountriesSelected: boolean;
    numberOfCountries: number;
    year: string;
};

type PolicyCategoryEvent = {
    name: "policy_explorer_category";
    category: string;
    subcategory: string;
    country: string;
    year: string;
};

export type AnalyticsEvent =
    | PageViewEvent
    | FileDownloadEvent
    | CountryPageViewEvent
    | ResourceKindPageViewEvent
    | ResourceEvent
    | ExternalLinkEvent
    | IndicatorExplorerSummaryEvent
    | IndicatorExplorerEvent
    | PolicyExplorerSummaryEvent
    | PolicyCategoryEvent;

export function getCurrentPageLocation(): string {
    return window.location.pathname + window.location.search;
}
