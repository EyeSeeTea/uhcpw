export interface AnalysisResource {
    id: string;
    text: string;
    theme: string;
    image: string;
    links: ResourceLink[];
    year: string;
}

export interface MediaResource {
    id: string;
    title: string;
    url: string;
    image: string;
    date: Date;
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
