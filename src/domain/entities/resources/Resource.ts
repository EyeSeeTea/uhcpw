export interface ComparativeAnalysis {
    kind: "comparative-analysis";
    text: string;
    theme: string;
    image: string;
    links: ComparativeAnalysisLink[];
    year: string;
}

export interface ComparativeAnalysisLink {
    language: string;
    url: string;
}

export interface News {
    kind: "news";
}

export interface Multimedia {
    kind: "multimedia";
}

export interface CountryAnalysis {
    kind: "country-analysis";
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
