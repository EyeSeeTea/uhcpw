import { Multimedia, News } from "../../../../domain/entities/resources/Resource";
import { ComparativeAnalysisState } from "../by-type/ResourcesByTypeState";
import { ResourcesFiltersState } from "../common/ResourcesFiltersState";

export type ResourcesState = {
    filters: ResourcesFiltersState;
    resources?: {
        countryAnalysisByCountry: CountryAnalysisCountry[];
        comparativeAnalysis: ComparativeAnalysisState[];
        news: News[];
        multimedia: Multimedia[];
    };
    onGetResources: () => void;
};

interface CountryAnalysisCountry {
    flag: string;
    countryId: string;
    countryName: string;
}
