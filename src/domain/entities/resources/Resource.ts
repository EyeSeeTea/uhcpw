export interface ComparativeAnalysis {
    kind: "comparative-analysis";
    id: string;
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
    id: string;
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
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
