export type PageViewEvent = {
    name: "page_view";
    pageLocation: string;
    pageTitle: string;
};

export type CountryPageViewEvent = {
    name: "country_page_view";
    title: string;
    country: string;
};

export type FileDownloadEvent = {
    name: "file_download";
    filename: string;
};

export type AnalyticsEvent = PageViewEvent | FileDownloadEvent | CountryPageViewEvent;
