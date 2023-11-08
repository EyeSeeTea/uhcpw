import { CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID } from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { Future, FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { CountryRepository } from "../../repositories/CountryRepository";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";
import { generateYears, generateRangeOfYears } from "../utils/generateYears";

export class GetPolicyExplorerUseCase {
    constructor(
        private policyExplorerRepository: PolicyExplorerRepository,
        private countryRepository: CountryRepository
    ) {}

    public execute(
        policyExplorerCategories: Record<string, string[]>,
        countryIds: string[],
        years: string[]
    ): FutureData<PolicyExplorer> {
        return Future.joinObj({
            countries: this.getCountries(countryIds),
            yearsByCategory: this.getYearsByCategory(years, policyExplorerCategories),
        }).flatMap(({ countries, yearsByCategory }) => {
            return this.policyExplorerRepository.get(policyExplorerCategories, countries, yearsByCategory);
        });
    }

    private getCountries(countryIds: string[]): FutureData<string[]> {
        if (countryIds.length > 0) return Future.success(countryIds);

        return this.countryRepository.get().map(countries => countries.map(country => country.id));
    }

    private getYearsByCategory(
        years: string[],
        policyExplorerCategories: Record<string, string[]>
    ): FutureData<Record<string, string[]>> {
        const categoryIds = Object.keys(policyExplorerCategories);

        const yearsByCategory = categoryIds.reduce((acc, categoryId) => {
            switch (categoryId) {
                case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019:
                    return (acc = { ...acc, [categoryId]: generateRangeOfYears(2000, 2019).map(years => years.id) });
                case CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020:
                    return (acc = { ...acc, [categoryId]: generateRangeOfYears(2020).map(years => years.id) });
                default:
                    return (acc = {
                        ...acc,
                        [categoryId]: years.length > 0 ? years : generateYears().map(years => years.id),
                    });
            }
        }, {});

        return Future.success(yearsByCategory);
    }
}
