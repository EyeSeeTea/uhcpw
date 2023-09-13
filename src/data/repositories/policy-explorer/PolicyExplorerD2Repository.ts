import _ from "lodash";
import { Future, FutureData } from "../../../domain/entities/Future";
import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerCellType,
    PolicyExplorerGeneralInfo,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
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

const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY = "u800TAhsIBY";

const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS = {
    "User charges apply": [
        "giUCPiCe745",
        "SWX96A7gnpA",
        "WTtArv6Xvsy",
        "gMAYqfQ5xAD",
        "NJ8zBQdwnd2",
        "VroSbngmebX",
        "OjTsewAuevP",
        "rZlHlitEiFp",
        "RtLyOZpUtqO",
        "TaS7d80ciTe",
    ],
    "Type of user charge": [
        "mTB12rvpJWd",
        "wDQRlBezRAs",
        "ibq7wtqnsns",
        "EruJIoPKO1s",
        "KfHkuuRZdBh",
        "CpMWBaXJ91P",
        "L2sCkhEbSfM",
        "PUXn0hz2JFX",
        "Py0PrMRPlUj",
        "L6ly0Y1uCe2",
    ],
    "Reduced user charges": [
        "b29bW9mc9C7",
        "ZkElvtoVJSd",
        "n8jFYyMKDaV",
        "KBW3D8lOlpg",
        "lj174orsYYW",
        "P7qWfL7oluy",
        "NkHvpG471tm",
        "lXBWfAv1EJE",
        "Bwx3a0w5orN",
        "syr5O2Mj2vL",
    ],
    "Exemptions from user charges": [
        "tu36CFgEoh8",
        "zsiuJlUSvAW",
        "SiNpgO1L5bG",
        "a67cjmP423S",
        "eRfuZtUFbPK",
        "yhSc51DOubT",
        "Cm6ngZTrVQR",
        "M228fF4qKsx",
        "KQVn9LNZPlq",
        "Urb1llvnJV4",
    ],
    "Cap on user charges": [
        "mSgmJhjn4Bi",
        "o6d3FfwRVj7",
        "sASANfdEGUR",
        "sk9g2PsK7vD",
        "Ut93noOXsdK",
        "olgegohqR8l",
        "JLSGrrzqrW9",
        "wZ9JynvumSQ",
        "SINKYu3EMgX",
        "Ai7ziQeOU53",
    ],
};

const TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS = {
    "Primary Care": ["giUCPiCe745", "mTB12rvpJWd", "b29bW9mc9C7", "tu36CFgEoh8", "mSgmJhjn4Bi"],
    "Specialist Visits": ["SWX96A7gnpA", "wDQRlBezRAs", "ZkElvtoVJSd", "zsiuJlUSvAW", "o6d3FfwRVj7"],
    "Emergency Visits": ["WTtArv6Xvsy", "ibq7wtqnsns", "n8jFYyMKDaV", "SiNpgO1L5bG", "sASANfdEGUR"],
    "Outpatient Medicines": ["gMAYqfQ5xAD", "EruJIoPKO1s", "KBW3D8lOlpg", "a67cjmP423S", "sk9g2PsK7vD"],
    "Inpatient Medicines": ["NJ8zBQdwnd2", "KfHkuuRZdBh", "lj174orsYYW", "eRfuZtUFbPK", "Ut93noOXsdK"],
    "Medical Products": ["VroSbngmebX", "CpMWBaXJ91P", "P7qWfL7oluy", "yhSc51DOubT", "olgegohqR8l"],
    "Diagnostics Tests": ["OjTsewAuevP", "L2sCkhEbSfM", "NkHvpG471tm", "Cm6ngZTrVQR", "JLSGrrzqrW9"],
    "Dental Visits": ["rZlHlitEiFp", "PUXn0hz2JFX", "lXBWfAv1EJE", "M228fF4qKsx", "wZ9JynvumSQ"],
    "Dental Care Treatment": ["RtLyOZpUtqO", "Py0PrMRPlUj", "Bwx3a0w5orN", "KQVn9LNZPlq", "SINKYu3EMgX"],
    "Inpatient Care": ["TaS7d80ciTe", "L6ly0Y1uCe2", "syr5O2Mj2vL", "Urb1llvnJV4", "Ai7ziQeOU53"],
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
        const rows = policyExplorer.tables[categoryId];
        if (rows) {
            exportToCSV(
                [
                    {
                        data: this.getRowsData(rows),
                        name: "Policy Explorer",
                    },
                ],
                "PolicyExplorer"
            );
        }
        return Future.success(undefined);
    }

    private getRowsData(rows: PolicyExplorerCell[][]): string[][] {
        return rows.reduce((accRowsData: string[][], currentRow: PolicyExplorerCell[]) => {
            const rowData: string[] = currentRow.map(({ value }) => value);
            return [...accRowsData, rowData];
        }, []);
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
    ): PolicyExplorerCell[][] {
        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );
        const columns =
            policyExplorerCategoryId === USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY
                ? this.getUserChargeByTypeOfHealthcareColumns(policyExplorerSubcategoriesIds)
                : [
                      { type: PolicyExplorerCellType.HEADER, value: "Country" },
                      { type: PolicyExplorerCellType.HEADER, value: "Period" },
                      ...dataElementsSection.map(de => ({ type: PolicyExplorerCellType.HEADER, value: de.formName })),
                  ];

        return [columns];
    }

    private buildRows(
        policyExplorerCategoryId: string,
        policyExplorerSubcategoriesIds: string[],
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[],
        dataSet?: D2DataSet
    ): PolicyExplorerCell[][] {
        const dataElementsSection = this.getDataElementsSection(
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataSet
        );

        const dataValuesByCountryAndYear = _(dataValues)
            .groupBy(dataValue => `${dataValue.orgUnit}-${dataValue.period}`)
            .value();

        return Object.keys(dataValuesByCountryAndYear).reduce(
            (accRows: PolicyExplorerCell[][], group): PolicyExplorerCell[][] => {
                const [orgUnit, period] = group.split("-");

                const orgUnitName = organisationUnits.find(ou => ou.id === orgUnit)?.shortName || "";
                const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

                const references =
                    dataValues.find(
                        dv => dv.orgUnit === orgUnit && dv.dataElement.includes(generalDataElements.references || "")
                    )?.value || "";

                if (policyExplorerCategoryId === USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY) {
                    const rows = this.getUserChargeByTypeOfHealthcareRowsUsingIds({
                        policyExplorerSubcategoriesIds,
                        dataValuesByGroup,
                        orgUnitName,
                        period,
                        references,
                    });

                    return [...accRows, ...rows];
                }

                return [
                    ...accRows,
                    [
                        { type: PolicyExplorerCellType.DATA, value: orgUnitName },
                        { type: PolicyExplorerCellType.DATA, value: period || "" },
                        ...dataElementsSection.map(de => {
                            const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);

                            return {
                                type: PolicyExplorerCellType.DATA,
                                value: `${dataValue?.value || ""}\n\n${references}`,
                            };
                        }),
                    ],
                ];
            },
            []
        );
    }

    private buildTables(
        policyExplorerCategories: Record<string, string[]>,
        dataValues: DataValueSetsDataValue[],
        organisationUnits: D2OrgUnit[],
        dataSet?: D2DataSet
    ): Record<string, PolicyExplorerCell[][]> {
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

    private getUserChargeByTypeOfHealthcareColumns(policyExplorerSubcategoriesIds: string[]) {
        const columns = Object.entries(USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS)
            .filter(([_columnName, dataElementIds]) => {
                return policyExplorerSubcategoriesIds.some(subcategoryId => dataElementIds.includes(subcategoryId));
            })
            .map(([columnName, _dataElementIds]) => ({
                type: PolicyExplorerCellType.HEADER,
                value: columnName,
            }));

        return [
            { type: PolicyExplorerCellType.HEADER, value: "Country" },
            { type: PolicyExplorerCellType.HEADER, value: "Period" },
            { type: PolicyExplorerCellType.HEADER, value: "Type of health care" },
            ...columns,
        ];
    }

    private getUserChargeByTypeOfHealthcareRowsUsingIds(params: {
        policyExplorerSubcategoriesIds: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }) {
        const { dataValuesByGroup, orgUnitName, period, references, policyExplorerSubcategoriesIds } = params;

        const rows = Object.entries(TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS)
            .filter(([_columnName, dataElementIds]) => {
                return policyExplorerSubcategoriesIds.some(subcategoryId => dataElementIds.includes(subcategoryId));
            })
            .reduce((acc: PolicyExplorerCell[][], [healthcareType, dataElementsSectionIdsInType], index) => {
                const initRow: PolicyExplorerCell[] =
                    index === 0
                        ? [
                              { type: PolicyExplorerCellType.DATA, value: orgUnitName },
                              { type: PolicyExplorerCellType.DATA, value: period || "" },
                              { type: PolicyExplorerCellType.HEADER, value: healthcareType },
                          ]
                        : [
                              { type: PolicyExplorerCellType.DATA, value: "" },
                              { type: PolicyExplorerCellType.DATA, value: "" },
                              { type: PolicyExplorerCellType.HEADER, value: healthcareType },
                          ];
                const restRow = Object.values(USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS).map(
                    dataElementsSectionIdsInColumn => {
                        const dataElementsSectionId = dataElementsSectionIdsInColumn.find(item =>
                            dataElementsSectionIdsInType.includes(item)
                        );

                        const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementsSectionId);
                        return {
                            type: PolicyExplorerCellType.DATA,
                            value: `${dataValue?.value || ""}\n\n${references}`,
                        };
                    }
                );
                const row = [...initRow, ...restRow];
                return [...acc, row];
            }, []);
        return rows;
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
