import { Future, FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { CountryRepository } from "../../repositories/CountryRepository";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";
import { generateYears, generateRangeOfYears } from "../utils/generateYears";

const CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_CATEGORY_ID = "FtRwT2aBET4";
const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_ID = "Dg4b8bTfEIr";

export class GetPolicyExplorerUseCase {
    constructor(
        private policyExplorerRepository: PolicyExplorerRepository,
        private countryRepository: CountryRepository
    ) {}

    public execute(
        policyExplorerCategoryId: string,
        countryIds: string[],
        years: string[]
    ): FutureData<PolicyExplorer> {
        return Future.joinObj({
            countries: this.getCountries(countryIds),
            years: this.getYears(years, policyExplorerCategoryId),
        }).flatMap(({ countries, years }) => {
            return this.policyExplorerRepository.get(policyExplorerCategoryId, countries, years);
        });
    }

    private getCountries(countryIds: string[]): FutureData<string[]> {
        if (countryIds.length > 0) return Future.success(countryIds);

        return this.countryRepository.get().map(countries => countries.map(country => country.id));
    }

    private getYears(years: string[], policyExplorerCategoryId: string): FutureData<string[]> {
        switch (policyExplorerCategoryId) {
            case CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_CATEGORY_ID:
                return Future.success(generateRangeOfYears(2000, 2019).map(years => years.id));
            case CHANGES_IN_COVERAGE_POLICY_SINCE_2020_CATEGORY_ID:
                return Future.success(generateRangeOfYears(2020).map(years => years.id));
            default:
                if (years.length > 0) return Future.success(years);
                return Future.success(generateYears().map(years => years.id));
        }
    }
}
