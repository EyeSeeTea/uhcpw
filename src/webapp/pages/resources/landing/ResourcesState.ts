import { ComparativeAnalysis, Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesState = {
    filters: ResourcesFiltersState;
    resources?: {
        countryAnalysisByCountry: CountryAnalysisCountry[];
        comparativeAnalysis: ComparativeAnalysis[];
        news: News[];
        multimedia: Multimedia[];
    };
    onGetResources: () => void;
};

interface CountryAnalysisCountry {
    flag: string;
    countryId: string;
}
