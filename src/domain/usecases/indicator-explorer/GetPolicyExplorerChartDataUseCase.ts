import { FutureData } from "../../entities/Future";
import { LatestAvailable, LatestCOVID19 } from "../../entities/Year";
import { generateYears } from "../utils/generateYears";
import { Id } from "../../entities/Ref";
import { PolicyExplorerChartDataRepository } from "../../repositories/PolicyExplorerChartDataRepository";
import { PolicyExplorerChartData } from "../../entities/indicator-explorer/PolicyExplorerChartData";

export class GetPolicyExplorerChartDataUseCase {
    constructor(private policyExplorerChartDataRepository: PolicyExplorerChartDataRepository) {}

    public execute(periods: string[], countries: Id[]): FutureData<PolicyExplorerChartData[]> {
        const sortedPeriods = periods.sort();

        const finalPeriods =
            sortedPeriods[0] === LatestCOVID19.id
                ? generateYears(2019).map(year => year.id)
                : sortedPeriods[0] === LatestAvailable.id
                ? generateYears().map(year => year.id)
                : sortedPeriods;

        return this.policyExplorerChartDataRepository.get(countries, finalPeriods.sort());
    }
}
