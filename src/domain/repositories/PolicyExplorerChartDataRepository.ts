import { FutureData } from "../entities/Future";
import { PolicyExplorerChartData } from "../entities/indicator-explorer/PolicyExplorerChartData";
import { Id } from "../entities/Ref";

export interface PolicyExplorerChartDataRepository {
    get(countries: Id[], periods: Id[]): FutureData<PolicyExplorerChartData[]>;
}
