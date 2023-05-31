import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { exportToCSV } from "../../export/exportToCSV";

export class PolicyExplorerD2Repository implements PolicyExplorerRepository {
    constructor(private api: D2Api) {}

    get(policyExplorerCategoryId: string, countries: string[], years: string[]): FutureData<PolicyExplorer> {
        return Future.joinObj({
            dataSetResponse: apiToFuture(
                this.api.models.dataSets.get({
                    fields: dataSetFields,
                    filter: { id: { eq: policyExplorerDataSet_ID } },
                })
            ),
            dataValuesResponse: apiToFuture(
                this.api.dataValues.getSet({
                    dataSet: [policyExplorerDataSet_ID],
                    orgUnit: countries,
                    period: years,
                })
            ),
            orgUnitsResponse: apiToFuture(
                this.api.models.organisationUnits.get({
                    fields: organisationUnitsFields,
                    paging: false,
                    level: 3,
                })
            ),
        }).map(({ dataSetResponse, dataValuesResponse, orgUnitsResponse }) => {
            return {
                rows: [
                    ...this.buildColumns(policyExplorerCategoryId, dataSetResponse.objects[0]),
                    ...this.buildRows(
                        policyExplorerCategoryId,
                        dataValuesResponse.dataValues,
                        orgUnitsResponse.objects,
                        dataSetResponse.objects[0]
                    ),
                ],
            };
        });
    }

    saveToFile(policyExplorer: PolicyExplorer): FutureData<void> {
        exportToCSV(
            [
                {
                    data: policyExplorer.rows,
                    name: "Policy Explorer",
                },
            ],
            "PolicyExplorer"
        );
        return Future.success(undefined);
    }

    private buildColumns(policyExplorerCategoryId: string, dataSet?: D2DataSet): string[][] {
        const dataElementsSection = this.getDataElementsSection(policyExplorerCategoryId, dataSet);

        return [["Country", "Period", ...dataElementsSection.map(de => de.displayName)]];
    }

    private buildRows(
        policyExplorerCategoryId: string,
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[],
        dataSet?: D2DataSet
    ): string[][] {
        const dataElementsSection = this.getDataElementsSection(policyExplorerCategoryId, dataSet);

        const dataValuesByCountryAndYear = _(dataValues)
            .groupBy(dataValue => `${dataValue.orgUnit}-${dataValue.period}`)
            .value();

        return Object.keys(dataValuesByCountryAndYear).map(group => {
            const [orgUnit, period] = group.split("-");

            const orgUnitName = organisationUnits.find(ou => ou.id === orgUnit)?.shortName || "";
            const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

            return [
                orgUnitName,
                period || "",
                ...dataElementsSection.map(de => {
                    const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);

                    return dataValue?.value || "";
                }),
            ];
        });
    }

    private getDataElementsSection(policyExplorerCategoryId: string, dataSet?: D2DataSet) {
        return (
            dataSet?.sections
                .find(section => section.id === policyExplorerCategoryId)
                ?.dataElements.filter(de => de.valueType === "LONG_TEXT") || []
        );
    }
}

const dataSetFields = {
    sections: { id: true, displayName: true, dataElements: { id: true, displayName: true, valueType: true } },
} as const;

type D2DataSet = MetadataPick<{
    dataSets: { fields: typeof dataSetFields };
}>["dataSets"][number];

const organisationUnitsFields = {
    id: true,
    shortName: true,
} as const;

type D2OrgUnit = MetadataPick<{
    organisationUnits: { fields: typeof organisationUnitsFields };
}>["organisationUnits"][number];
