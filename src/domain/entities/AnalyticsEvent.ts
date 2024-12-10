export type PageViewEvent = {
    name: "page_view";
    pageLocation: string;
    pageTitle: string;
};

export type FileDownloadEvent = {
    name: "file_download";
    filename: string;
};

export type AnalyticsEvent = PageViewEvent | FileDownloadEvent;
