export interface BasicResource {
    id: string;
    title: string;
    image: string;
    date: Date;
    favourite: boolean;
    favouriteOrder: number;
    favouriteSection: boolean;
    favouriteSectionOrder: number;
}

export interface AnalysisResource extends BasicResource {
    links: ResourceLink[];
    theme: string;
}

export interface MediaResource extends BasicResource {
    url: string;
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
    countryName: string;
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
