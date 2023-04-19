import { Future, FutureData } from "../../entities/Future";
import { PolicyExplorer } from "../../entities/PolicyExplorer";
import { CountryRepository } from "../../repositories/CountryRepository";
import { PolicyExplorerRepository } from "../../repositories/PolicyExplorerRepository";
import { generateYears } from "../utils/generateYears";

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
        return Future.joinObj({ countries: this.getCountries(countryIds), years: this.getYears(years) }).flatMap(
            ({ countries, years }) => {
                return this.policyExplorerRepository.get(policyExplorerCategoryId, countries, years);
            }
        );
    }

    private getCountries(countryIds: string[]): FutureData<string[]> {
        if (countryIds.length > 0) return Future.success(countryIds);

        return this.countryRepository.get().map(countries => countries.map(country => country.id));
    }

    private getYears(years: string[]): FutureData<string[]> {
        if (years.length > 0) return Future.success(years);

        return Future.success(generateYears().map(years => years.id));
    }
}
