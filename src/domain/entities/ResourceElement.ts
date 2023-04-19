export type ResourceTheme =
    | "Resilience and financial sustainability"
    | "Spending on health"
    | "Voluntary health insurance"
    | "Financial protection";

export interface ComparativeAnalysis {
    kind: "comparative-analysis";
    text: string;
    theme: ResourceTheme;
    image: string;
    languages: string[];
    year: string;
}

export interface News {
    kind: "news";
}

export interface Multimedia {
    kind: "multimedia";
}

export interface CountryAnaliysis {
    kind: "country-analysis";
}

export type ResourceElement = News | Multimedia | CountryAnaliysis | ComparativeAnalysis;
