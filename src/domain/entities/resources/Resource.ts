export interface BasicResource {
    id: string;
    title: string;
    imageOriginal: string;
    imageCustom?: string;
    date: Date;
    favourite: boolean;
    favouriteOrder: number;
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
    favouriteSection: boolean;
    favouriteSectionOrder: number;
}

export interface Multimedia extends MediaResource {
    kind: "multimedia";
    theme: string;
    favouriteSection: boolean;
    favouriteSectionOrder: number;
}

export interface ResourceLink {
    language: string;
    url: string;
}

export interface ComparativeAnalysis extends AnalysisResource {
    kind: "comparative-analysis";
    relatedCountries: string[];
    favouriteSection: boolean;
    favouriteSectionOrder: number;
}

export interface CountryAnalysis extends AnalysisResource {
    kind: "country-analysis";
    countryId: string;
    favouriteSection: boolean;
    favouriteSectionOrder: number;
}

export type Resource = News | Multimedia | CountryAnalysis | ComparativeAnalysis;
