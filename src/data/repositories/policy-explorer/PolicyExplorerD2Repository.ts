import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import { PolicyExplorer, PolicyExplorerGeneralInfo } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { PolicyExplorerRepository } from "../../../domain/repositories/policy-explorer/PolicyExplorerRepository";
import { policyExplorerDataSet_ID } from "../../../domain/utils";
import { D2Api, DataValueSetsDataValue, MetadataPick } from "../../../types/d2-api";
import { apiToFuture } from "../../../utils/futures";
import { exportToCSV } from "../../export/exportToCSV";

const generalDataElements: Record<string, string> = {
    source: "pDEHTRpRL8X",
    countryExperts: "mCEsfMPByf5",
    editors: "iyYnyNfyrfs",
    lastUpdate: "VDRInyNx7fG",
    references: "DsWWAKomY4Z",
};

export class PolicyExplorerD2Repository implements PolicyExplorerRepository {
    constructor(private api: D2Api) {}

    get(
        policyExplorerCategories: Record<string, string[]>,
        countries: string[],
        years: string[]
    ): FutureData<PolicyExplorer> {
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
                tables: this.buildTables(
                    policyExplorerCategories,
                    dataValuesResponse.dataValues,
                    orgUnitsResponse.objects,
                    dataSetResponse.objects[0]
                ),
                generalInfo: this.buildGeneralInfo(dataValuesResponse.dataValues, orgUnitsResponse.objects),
            };
        });
    }

    saveToFile(policyExplorer: PolicyExplorer, categoryId: string): FutureData<void> {
        const data = policyExplorer.tables[categoryId];
        if (data) {
            exportToCSV(
                [
                    {
                        data,
                        name: "Policy Explorer",
                    },
                ],
                "PolicyExplorer"
            );
        }
        return Future.success(undefined);
    }

    private buildGeneralInfo(
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[]
    ): PolicyExplorerGeneralInfo[] {
        const dataValuesByOrgUnit = _(dataValues)
            .groupBy(dataValue => dataValue.orgUnit)
            .value();

        return Object.keys(dataValuesByOrgUnit).map(orgUnitId => {
            const country = organisationUnits.find(ou => ou.id === orgUnitId)?.shortName || "";

            const source =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.source || "")
                )?.value || "";
            const countryExperts =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.countryExperts || "")
                )?.value || "";
            const editors =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.editors || "")
                )?.value || "";
            const lastUpdate =
                dataValues.find(
                    dv => dv.orgUnit === orgUnitId && dv.dataElement.includes(generalDataElements.lastUpdate || "")
                )?.value || "";

            return { country, source, countryExperts, editors, lastUpdate: new Date(lastUpdate) };
        });
    }

    private buildColumns(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataSet?: D2DataSet
    ): string[][] {
        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );

        return [["Country", "Period", ...dataElementsSection.map(de => de.formName)]];
    }

    private buildRows(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[],
        dataSet?: D2DataSet
    ): string[][] {
        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );

        const dataValuesByCountryAndYear = _(dataValues)
            .groupBy(dataValue => `${dataValue.orgUnit}-${dataValue.period}`)
            .value();

        return Object.keys(dataValuesByCountryAndYear).map(group => {
            const [orgUnit, period] = group.split("-");

            const orgUnitName = organisationUnits.find(ou => ou.id === orgUnit)?.shortName || "";
            const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

            const references =
                dataValues.find(
                    dv => dv.orgUnit === orgUnit && dv.dataElement.includes(generalDataElements.references || "")
                )?.value || "";

            return [
                orgUnitName,
                period || "",
                ...dataElementsSection.map(de => {
                    const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);

                    return `${dataValue?.value || ""}\n\n${references}`;
                }),
            ];
        });
    }

    private buildTables(
        policyExplorerCategories: Record<string, string[]>,
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[],
        dataSet?: D2DataSet
    ): Record<string, string[][]> {
        const tables = {};
        return Object.entries(policyExplorerCategories).reduce(
            (acc, [policyExplorerCategoryId, policyExplorerSubcategoriesIds]) => ({
                ...acc,
                [policyExplorerCategoryId]: [
                    ...this.buildColumns(policyExplorerCategoryId, policyExplorerSubcategoriesIds, dataSet),
                    ...this.buildRows(
                        policyExplorerCategoryId,
                        policyExplorerSubcategoriesIds,
                        dataValues,
                        organisationUnits,
                        dataSet
                    ),
                ],
            }),
            tables
        );
    }

    private getDataElementsSection(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataSet?: D2DataSet
    ) {
        return (
            dataSet?.sections
                .find(section => section.id === policyExplorerCategoryId)
                ?.dataElements.filter(
                    de => de.valueType === "LONG_TEXT" && policyExplorerSubcategoriesIds.includes(de.id)
                ) || []
        );
    }
}

const dataSetFields = {
    sections: { id: true, displayName: true, dataElements: { id: true, formName: true, valueType: true } },
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
