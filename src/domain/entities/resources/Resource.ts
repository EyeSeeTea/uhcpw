export interface AnalysisResource {
    text: string;
    theme: string;
    image: string;
    links: ResourceLink[];
    year: string;
}

export interface MediaResource {
    title: string;
    url: string;
    image: string;
    date: string;
}

export interface News extends MediaResource {
    kind: "news";
}

export interface Multimedia extends MediaResource {
    kind: "multimedia";
    theme: string;
}

export interface ResourceLink {
    language: string;
    url: string;
}

export interface ComparativeAnalysis extends AnalysisResource {
    kind: "comparative-analysis";
}

export interface CountryAnalysis extends AnalysisResource {
    kind: "country-analysis";
    countryId: string;
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
