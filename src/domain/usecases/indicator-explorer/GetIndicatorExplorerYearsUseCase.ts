import { FutureData } from "../../entities/Future";
import { Year } from "../../entities/Year";
import { DataSetRepository } from "../../repositories/metadata/DataSetRepository";
import { generateYears } from "../utils/generateYears";

const quantitativeDataForUHCPW_ID = "a4vQxAxn02B";

export class GetIndicatorExplorerYearsUseCase {
    constructor(private dataSetRepository: DataSetRepository) {}

    public execute(): FutureData<Year[]> {
        return this.dataSetRepository.getById(quantitativeDataForUHCPW_ID).map(dataSet => {
            const currentYear = new Date().getFullYear();

            const maxYear = currentYear - 1 + dataSet.openFuturePeriods;

            return generateYears(maxYear);
        });
    }
}
