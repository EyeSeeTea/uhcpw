import { FutureData } from "../../../domain/entities/Future";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { policyExplorerDataSet_ID } from "../utils";
import { Id } from "../../../domain/entities/Ref";
import { PolicyExplorerChartDataRepository } from "../../../domain/repositories/PolicyExplorerChartDataRepository";
import { PolicyExplorerChartData } from "../../../domain/entities/indicator-explorer/PolicyExplorerChartData";

export const POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE = "TKq3zGVr1vj";
export const POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT = "BAuD3jhIXTY";

export class PolicyExplorerChartDataD2Repository implements PolicyExplorerChartDataRepository {
    constructor(private api: D2Api) {}

    get(countries: Id[], periods: Id[]): FutureData<PolicyExplorerChartData[]> {
        return apiToFuture(
            this.api.dataValues.getSet({
                dataSet: [policyExplorerDataSet_ID],
                orgUnit: countries,
                period: periods,
            })
        ).map(response => {
            return (response.dataValues || [])
                .filter(dataValue => {
                    return (
                        dataValue.dataElement === POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT ||
                        dataValue.dataElement === POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE
                    );
                })
                .map(dataValue => ({
                    country: dataValue.orgUnit,
                    period: dataValue.period,
                    value: dataValue.value === "true",
                    dataElement: dataValue.dataElement,
                }));
        });
    }
}
