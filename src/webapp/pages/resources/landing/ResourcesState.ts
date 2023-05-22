import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesState = {
    countryAnalysis: CountryAnalysisItem[];
    filters: ResourcesFiltersState;
    comparativeAnalysis: ComparativeAnalysis[];
    news: NewsItem[];
    multimedia: MultimediaItem[];
    onGetResources: () => void;
};

export type CountryAnalysisItem = {
    name: string;
    image: string;
    code: string;
    category: string;
    theme: string;
    year: string;
};

export type ComparativeAnalysisState = {
    text: string;
    theme: string;
    image: string;
    language: string;
    year: string;
};

export type NewsItem = {
    title: string;
    img: string;
    date: string;
};

export type MultimediaItem = {
    title: string;
    img: string;
    date: string;
};
