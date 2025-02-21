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

export type AnalyticsEvent =
    | PageViewEvent
    | FileDownloadEvent
    | CountryPageViewEvent
    | ResourceKindPageViewEvent
    | ResourceEvent
    | ExternalLinkEvent;

export function getCurrentPageLocation(): string {
    return window.location.hash.split("?")[0] ?? "";
}
