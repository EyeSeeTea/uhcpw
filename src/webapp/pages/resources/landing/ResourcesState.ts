import { ComparativeAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesState = {
    filters: ResourcesFiltersState;
    resources?: {
        countryAnalysis: CountryAnalysisItem[];
        comparativeAnalysis: ComparativeAnalysis[];
        news: News[];
        multimedia: Multimedia[];
    };
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

export type MultimediaItem = {
    title: string;
    img: string;
    date: string;
};
