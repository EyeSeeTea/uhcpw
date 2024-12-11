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

export type AnalyticsEvent =
    | PageViewEvent
    | FileDownloadEvent
    | CountryPageViewEvent
    | ResourceKindPageViewEvent
    | ResourceEvent;
