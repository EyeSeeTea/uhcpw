import { CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID } from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { Future, FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { CountryRepository } from "../../repositories/CountryRepository";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";
import { generateYears, generateYearsUntilToday } from "../utils/generateYears";

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
                case CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID:
                    return (acc = { ...acc, [categoryId]: generateYearsUntilToday().map(years => years.id) });
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
