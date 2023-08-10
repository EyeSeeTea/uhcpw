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

const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY = "u800TAhsIBY";
const TYPES_OF_USER_CHARGE = "lHk8jtKonPh";

const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS = [
    "Type of health care",
    "User charges apply",
    "Type of user charge",
    "Reduced user charges",
    "Exemptions from user charges",
    "Cap on user charges",
];

const TYPE_OF_HEALTHCARE_VALUES = [
    "Primary Care",
    "Specialist Visits",
    "Emergency Visits",
    "Outpatient Medicines",
    "Inpatient Medicines",
    "Medical Products",
    "Diagnostics Tests",
    "Dental Visits",
    "Dental Care Treatment",
    "Inpatient Care",
];

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

const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS = {
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

const TYPES_OF_USER_CHARGE_COLUMNS_DATA_ELEMENT_SECTION_IDS = {
    "Fixed co-payment": [
        "EboejH0zPz9",
        "oHXaoGjuNBz",
        "NnTynkwUOLd",
        "FPWimBd7wCe",
        "SgGPLj9ftfg",
        "KGrh7f4UdO2",
        "zZ0IhJeGF3G",
        "sAxdNOgcV3H",
        "UfpRQ2Ijiyb",
        "KR7sMncAKlz",
    ],
    "Percentage co-payment": [
        "cBXErExkfsP",
        "mXKLWeQblWM",
        "AumlNzFYLzS",
        "c6VoqBpnpxd",
        "AA6Ye2mqJHR",
        "jgb82HFCuoF",
        "G68kPZZ43zG",
        "rajdlRWxCX4",
        "WdF9ezTBVNb",
        "q5cIxEo3MPq",
    ],
    "Reference pricing": [
        "uFiUQKJhltM",
        "iho7qMihBEN",
        "RnRU6QWQtFO",
        "asegoCEvyrS",
        "xmaBfCQrnvo",
        "z21e4xo33Gq",
        "MDvxRjDZvDj",
        "eUtTI5WTx9F",
        "BnI3YDe3flm",
        "ZqAbKQHqhLR",
    ],
    Deductible: [
        "xvfbvuNow1z",
        "H2f0XhUerVj",
        "y1ZQGX2JSfk",
        "mik8Xg9vOeV",
        "SAdCPb1pzvB",
        "yACvBd3ApA0",
        "U9QK3B63xKo",
        "r0iKZc6gEdK",
        "ccDqDzq4b0x",
        "Dgg4Jc9U7Jn",
    ],
    "Balance billing": [
        "BuXscQqeqt3",
        "gxOwKGHM5uM",
        "ZVvNouUFwSj",
        "phzaWpXIfni",
        "rRtvOQKWekP",
        "bC0ASJpuYnX",
        "VplpY1Yy1lR",
        "GaGhir32y1U",
        "u1Eguha8n2H",
        "SUBFUbBNE8g",
    ],
    "Extra billing/full price": [
        "AenLLMXSR2j",
        "OVMONRywtGy",
        "U3EM7x9wA7q",
        "ngo9UfDawgI",
        "ZhPZvGqaolU",
        "cMmiVU55Byh",
        "McgI8vrnFw6",
        "DNTGpXo6buK",
        "UUi5TUqljop",
        "IpwrxmI5FU7",
    ],
};

const TYPES_OF_USER_CHARGE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS = {
    "Primary Care": ["EboejH0zPz9", "cBXErExkfsP", "uFiUQKJhltM", "xvfbvuNow1z", "BuXscQqeqt3", "AenLLMXSR2j"],
    "Specialist Visits": ["oHXaoGjuNBz", "mXKLWeQblWM", "iho7qMihBEN", "H2f0XhUerVj", "gxOwKGHM5uM", "OVMONRywtGy"],
    "Emergency Visits": ["NnTynkwUOLd", "AumlNzFYLzS", "RnRU6QWQtFO", "y1ZQGX2JSfk", "ZVvNouUFwSj", "U3EM7x9wA7q"],
    "Outpatient prescribed medicines": [
        "FPWimBd7wCe",
        "c6VoqBpnpxd",
        "asegoCEvyrS",
        "mik8Xg9vOeV",
        "phzaWpXIfni",
        "ngo9UfDawgI",
    ],
    "Medical Products": ["SgGPLj9ftfg", "AA6Ye2mqJHR", "xmaBfCQrnvo", "SAdCPb1pzvB", "rRtvOQKWekP", "ZhPZvGqaolU"],
    "Diagnostics Tests": ["KGrh7f4UdO2", "jgb82HFCuoF", "z21e4xo33Gq", "yACvBd3ApA0", "bC0ASJpuYnX", "cMmiVU55Byh"],
    "Dental Visits": ["zZ0IhJeGF3G", "G68kPZZ43zG", "MDvxRjDZvDj", "U9QK3B63xKo", "VplpY1Yy1lR", "McgI8vrnFw6"],
    "Dental Care Treatment": ["sAxdNOgcV3H", "rajdlRWxCX4", "eUtTI5WTx9F", "r0iKZc6gEdK", "GaGhir32y1U", "DNTGpXo6buK"],
    "Inpatient Care": ["UfpRQ2Ijiyb", "WdF9ezTBVNb", "BnI3YDe3flm", "ccDqDzq4b0x", "u1Eguha8n2H", "UUi5TUqljop"],
    "Inpatient Medicines": ["KR7sMncAKlz", "q5cIxEo3MPq", "ZqAbKQHqhLR", "Dgg4Jc9U7Jn", "SUBFUbBNE8g", "IpwrxmI5FU7"],
};

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
                generalInfo: this.buildGeneralInfo(dataValuesResponse.dataValues, orgUnitsResponse.objects),
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

    private buildColumns(policyExplorerCategoryId: string, dataSet?: D2DataSet): string[][] {
        const dataElementsSection = this.getDataElementsSection(policyExplorerCategoryId, dataSet);

        switch (policyExplorerCategoryId) {
            case USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY:
                return this.getUserChargeByTypeOfHealthcareColumns();
            case TYPES_OF_USER_CHARGE:
                return this.getTypeOfUserChargeColumns();
            default:
                return [["Country", "Period", ...dataElementsSection.map(de => de.formName)]];
        }
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

        return Object.keys(dataValuesByCountryAndYear).reduce((accMain: string[][], group): string[][] => {
            const [orgUnit, period] = group.split("-");

            const orgUnitName = organisationUnits.find(ou => ou.id === orgUnit)?.shortName || "";
            const dataValuesByGroup = dataValuesByCountryAndYear[group] || [];

            const references =
                dataValues.find(
                    dv => dv.orgUnit === orgUnit && dv.dataElement.includes(generalDataElements.references || "")
                )?.value || "";

            switch (policyExplorerCategoryId) {
                case USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY:
                    return [
                        ...accMain,
                        ...this.getRowsByTypeOfHealthcareUsingIds({
                            policyExplorerCategoryId,
                            dataValuesByGroup,
                            orgUnitName,
                            period,
                            references,
                        }),
                    ];
                case TYPES_OF_USER_CHARGE:
                    return [
                        ...accMain,
                        ...this.getRowsByTypeOfHealthcareUsingIds({
                            policyExplorerCategoryId,
                            dataValuesByGroup,
                            orgUnitName,
                            period,
                            references,
                        }),
                    ];
                default:
                    return [
                        ...accMain,
                        [
                            orgUnitName,
                            period || "",
                            ...dataElementsSection.map(de => {
                                const dataValue = dataValuesByGroup.find(dv => dv.dataElement === de.id);

                                return `${dataValue?.value || ""}\n\n${references}`;
                            }),
                        ],
                    ];
            }
        }, []);
    }

    private getDataElementsSection(policyExplorerCategoryId: string, dataSet?: D2DataSet) {
        return (
            dataSet?.sections
                .find(section => section.id === policyExplorerCategoryId)
                ?.dataElements.filter(de => de.valueType === "LONG_TEXT") || []
        );
    }

    private getUserChargeByTypeOfHealthcareColumns() {
        return [
            [
                "Country",
                "Period",
                "Type of health care",
                ...Object.keys(USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS),
            ],
        ];
    }

    private getTypeOfUserChargeColumns() {
        return [
            [
                "Country",
                "Period",
                "Type of health care",
                ...Object.keys(TYPES_OF_USER_CHARGE_COLUMNS_DATA_ELEMENT_SECTION_IDS),
            ],
        ];
    }

    private getRowsByTypeOfHealthcareUsingIds(params: {
        policyExplorerCategoryId: string;
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }) {
        const { dataValuesByGroup, policyExplorerCategoryId, orgUnitName, period, references } = params;

        const idsByTypeOfHealthcare =
            policyExplorerCategoryId === USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY
                ? USER_CHARGE_BY_TYPE_OF_HEALTHCARE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS
                : TYPES_OF_USER_CHARGE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS;

        const idsByColumn =
            policyExplorerCategoryId === USER_CHARGE_BY_TYPE_OF_HEALTHCARE_CATEGORY
                ? USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS
                : TYPES_OF_USER_CHARGE_COLUMNS_DATA_ELEMENT_SECTION_IDS;

        const rows = Object.entries(idsByTypeOfHealthcare).reduce(
            (acc: string[][], [healthcareType, dataElementsSectionIdsInType], index) => {
                const initRow = index === 0 ? [orgUnitName, period || "", healthcareType] : ["", "", healthcareType];
                const restRow = Object.values(idsByColumn).map(dataElementsSectionIdsInColumn => {
                    const dataElementsSectionId = dataElementsSectionIdsInColumn.find(item =>
                        dataElementsSectionIdsInType.includes(item)
                    );

                    const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementsSectionId);
                    return `${dataValue?.value || ""}\n\n${references}`;
                });
                const row = [...initRow, ...restRow];
                return [...acc, row];
            },
            []
        );
        return rows;
    }

    // Other way using formName
    private getUserChargeByTypeOfHealthcareRowsUsingFormName(params: {
        dataElementsSection: Record<string, string>[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }) {
        const { dataElementsSection, dataValuesByGroup, orgUnitName, period, references } = params;

        const values: string[][] = USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS.reduce(
            (acc, columnName) => {
                if (columnName !== "Type of health care") {
                    const columnValues: string[] = TYPE_OF_HEALTHCARE_VALUES.reduce(
                        (accValues: string[], type: string) => {
                            const dataElementSection = dataElementsSection.find(
                                de => de.formName && de.formName.includes(columnName, 0) && de.formName.includes(type)
                            );

                            const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementSection?.id);

                            return [...accValues, `${dataValue?.value || ""}\n\n${references}`];
                        },
                        []
                    );
                    acc = [...acc, columnValues];
                }
                return acc;
            },
            [TYPE_OF_HEALTHCARE_VALUES]
        );

        const rows: string[][] = TYPE_OF_HEALTHCARE_VALUES.reduce((acc: string[][], _, index) => {
            const initRow = index === 0 ? [orgUnitName, period || ""] : ["", ""];
            const restRow: string[] = values.map(val => val[index] || "");
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
