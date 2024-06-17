import { CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID } from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { Future, FutureData } from "../../entities/Future";
import { Id } from "../../entities/Ref";
import { latestAvailableYear, PolicyExplorer } from "../../entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../repositories/policy-explorer/PolicyExplorerRepository";
import { generate, generateYears } from "../utils/generateYears";
import { Country } from "../../entities/Country";

export class GetPolicyExplorerUseCase {
    constructor(private policyExplorerRepository: PolicyExplorerRepository) {}

    public execute(
        policyExplorerCategories: Record<string, string[]>,
        selectedCountriesIds: Id[],
        years: string[],
        countriesAndRegions: Country[]
    ): FutureData<PolicyExplorer> {
        return this.getYearsByCategory(years, policyExplorerCategories).flatMap(yearsByCategory => {
            return this.policyExplorerRepository.get(
                policyExplorerCategories,
                selectedCountriesIds,
                yearsByCategory,
                countriesAndRegions
            );
        });
    }

    private getYearsByCategory(
        years: string[],
        policyExplorerCategories: Record<string, string[]>
    ): FutureData<Record<string, string[]>> {
        const categoryIds = Object.keys(policyExplorerCategories);

        const yearsByCategory = categoryIds.reduce((acc, categoryId) => {
            switch (categoryId) {
                case CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID: {
                    const year = years[0];
                    const finalYear =
                        year === undefined || years[0] === latestAvailableYear ? new Date().getFullYear() : +year;

                    return (acc = {
                        ...acc,
                        [categoryId]: generate(finalYear, 1970).map(years => years.id),
                    });
                }
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
