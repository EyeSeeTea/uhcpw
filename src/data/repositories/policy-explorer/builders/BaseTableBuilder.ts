import _ from "lodash";
import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";

type BaseTableBuilderProps = {
    basisForLatestYear?: string[];
};
export class BaseTableBuilder {
    private basisForLatestYear: string[];
    constructor(protected readonly props: BaseTableBuilderProps = {}) {
        this.basisForLatestYear = props.basisForLatestYear || ["SQQ3ZDRbxGT"]; //de: Basis for entitlement to publicly financed health service
    }

    filterDataValuesByLatestAvailableYear<T extends DataValueSetsDataValue>(dataValues: T[]): T[] {
        const byOrgUnit = _(dataValues).groupBy("orgUnit").value();

        return _(byOrgUnit)
            .flatMap(orgUnitDataValues => {
                const latestPeriod = _(orgUnitDataValues)
                    .filter(dv => this.basisForLatestYear.includes(dv.dataElement))
                    .map(dv => +dv.period)
                    .max();

                if (!latestPeriod) {
                    return orgUnitDataValues;
                }
                return orgUnitDataValues.filter(dv => +dv.period === latestPeriod);
            })
            .value();
    }
}
