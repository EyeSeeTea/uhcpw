export interface ComparativeAnalysis {
    kind: "comparative-analysis";
    text: string;
    theme: string;
    image: string;
    links: { language: string; url: string }[];
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

export type Resource = News | Multimedia | CountryAnaliysis | ComparativeAnalysis;
