export interface ComparativeAnalysis {
    kind: "comparative-analysis";
    text: string;
    theme: string;
    image: string;
    links: ResourceLink[];
    year: string;
}

export interface ResourceLink {
    language: string;
    url: string;
}

export interface News {
    kind: "news";
    title: string;
    url: string;
    image: string;
    date: string;
}

export interface Multimedia {
    kind: "multimedia";
    title: string;
    url: string;
    image: string;
    date: string;
    theme: string;
}

export interface CountryAnalysis {
    kind: "country-analysis";
    text: string;
    theme: string;
    image: string;
    links: ResourceLink[];
    year: string;
    countryId: string;
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
