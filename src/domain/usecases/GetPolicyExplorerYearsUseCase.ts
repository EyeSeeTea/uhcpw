import { FutureData } from "../entities/Future";
import { Year } from "../entities/Year";
import { DataSetRepository } from "../repositories/metadata/DataSetRepository";

const qualitativeDataForUHCPW_ID = "asMJECXNLpV";

export class GetPolicyExplorerYearsUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(): FutureData<Year[]> {
        return this.dataSetRepository.getById(qualitativeDataForUHCPW_ID).map(dataSet => {
            const currentYear = new Date().getFullYear();

            const minYear = 1999;
            const maxYear = currentYear - 1 + dataSet.openFuturePeriods;

            return Array.from({ length: maxYear - minYear }, (_, i) => maxYear - i).map(year => ({
                id: year.toString(),
            }));
        });
    }
}
