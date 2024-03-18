import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME, EMPTY_DATA, PERIOD_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { CATEGORY_BY_TYPE_OF_HEALTHCARE } from "../PolicyExplorerCategoryD2Repository";

export const USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS = {
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
    "Primary care": ["giUCPiCe745", "mTB12rvpJWd", "b29bW9mc9C7", "tu36CFgEoh8", "mSgmJhjn4Bi"],
    "Specialist visits": ["SWX96A7gnpA", "wDQRlBezRAs", "ZkElvtoVJSd", "zsiuJlUSvAW", "o6d3FfwRVj7"],
    "Emergency visits": ["WTtArv6Xvsy", "ibq7wtqnsns", "n8jFYyMKDaV", "SiNpgO1L5bG", "sASANfdEGUR"],
    "Outpatient medicines": ["gMAYqfQ5xAD", "EruJIoPKO1s", "KBW3D8lOlpg", "a67cjmP423S", "sk9g2PsK7vD"],
    "Inpatient medicines": ["NJ8zBQdwnd2", "KfHkuuRZdBh", "lj174orsYYW", "eRfuZtUFbPK", "Ut93noOXsdK"],
    "Medical products": ["VroSbngmebX", "CpMWBaXJ91P", "P7qWfL7oluy", "yhSc51DOubT", "olgegohqR8l"],
    "Diagnostics tests": ["OjTsewAuevP", "L2sCkhEbSfM", "NkHvpG471tm", "Cm6ngZTrVQR", "JLSGrrzqrW9"],
    "Dental visits": ["rZlHlitEiFp", "PUXn0hz2JFX", "lXBWfAv1EJE", "M228fF4qKsx", "wZ9JynvumSQ"],
    "Dental care treatment": ["RtLyOZpUtqO", "Py0PrMRPlUj", "Bwx3a0w5orN", "KQVn9LNZPlq", "SINKYu3EMgX"],
    "Inpatient care": ["TaS7d80ciTe", "L6ly0Y1uCe2", "syr5O2Mj2vL", "Urb1llvnJV4", "Ai7ziQeOU53"],
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
    "Primary care": ["EboejH0zPz9", "cBXErExkfsP", "uFiUQKJhltM", "xvfbvuNow1z", "BuXscQqeqt3", "AenLLMXSR2j"],
    "Specialist visits": ["oHXaoGjuNBz", "mXKLWeQblWM", "iho7qMihBEN", "H2f0XhUerVj", "gxOwKGHM5uM", "OVMONRywtGy"],
    "Emergency visits": ["NnTynkwUOLd", "AumlNzFYLzS", "RnRU6QWQtFO", "y1ZQGX2JSfk", "ZVvNouUFwSj", "U3EM7x9wA7q"],
    "Outpatient prescribed medicines": [
        "FPWimBd7wCe",
        "c6VoqBpnpxd",
        "asegoCEvyrS",
        "mik8Xg9vOeV",
        "phzaWpXIfni",
        "ngo9UfDawgI",
    ],
    "Medical products": ["SgGPLj9ftfg", "AA6Ye2mqJHR", "xmaBfCQrnvo", "SAdCPb1pzvB", "rRtvOQKWekP", "ZhPZvGqaolU"],
    "Diagnostics tests": ["KGrh7f4UdO2", "jgb82HFCuoF", "z21e4xo33Gq", "yACvBd3ApA0", "bC0ASJpuYnX", "cMmiVU55Byh"],
    "Dental visits": ["zZ0IhJeGF3G", "G68kPZZ43zG", "MDvxRjDZvDj", "U9QK3B63xKo", "VplpY1Yy1lR", "McgI8vrnFw6"],
    "Dental care treatment": ["sAxdNOgcV3H", "rajdlRWxCX4", "eUtTI5WTx9F", "r0iKZc6gEdK", "GaGhir32y1U", "DNTGpXo6buK"],
    "Inpatient care": ["UfpRQ2Ijiyb", "WdF9ezTBVNb", "BnI3YDe3flm", "ccDqDzq4b0x", "u1Eguha8n2H", "UUi5TUqljop"],
    "Inpatient medicines": ["KR7sMncAKlz", "q5cIxEo3MPq", "ZqAbKQHqhLR", "Dgg4Jc9U7Jn", "SUBFUbBNE8g", "IpwrxmI5FU7"],
};

export const TYPE_OF_HEALTH_CARE_HEADER_NAME = "Type of health care";

export class TableBuilderByTypeOfHealthcare implements TableBuilder {
    buildColumns(params: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
    }): PolicyExplorerCell[] {
        const { policyExplorerCategoryId, policyExplorerSubcategoriesIds } = params;
        const columnsDataElementSectionIds =
            policyExplorerCategoryId === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES
                ? USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS
                : TYPES_OF_USER_CHARGE_COLUMNS_DATA_ELEMENT_SECTION_IDS;

        const commonColumns = [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
            { type: PolicyExplorerCellType.HEADER, value: PERIOD_HEADER_NAME },
            { type: PolicyExplorerCellType.HEADER, value: TYPE_OF_HEALTH_CARE_HEADER_NAME },
        ];

        const restColumns = Object.entries(columnsDataElementSectionIds)
            .filter(([_columnName, dataElementIds]) => {
                return policyExplorerSubcategoriesIds.some(subcategoryId => dataElementIds.includes(subcategoryId));
            })
            .map(([columnName, _dataElementIds]) => ({
                type: PolicyExplorerCellType.HEADER,
                value: columnName,
            }));

        return [...commonColumns, ...restColumns];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }) {
        const {
            policyExplorerCategoryId,
            policyExplorerSubcategoriesIds,
            dataValuesByGroup,
            orgUnitName,
            period,
            references,
            currentRowsInTable,
        } = params;

        const idsByTypeOfHealthcare =
            policyExplorerCategoryId === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES
                ? USER_CHARGE_BY_TYPE_OF_HEALTHCARE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS
                : TYPES_OF_USER_CHARGE_TYPE_OF_HEALTHCARE_VALUES_DATA_ELEMENT_SECTION_IDS;

        const idsByColumn =
            policyExplorerCategoryId === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES
                ? USER_CHARGE_BY_TYPE_OF_HEALTHCARE_COLUMNS_DATA_ELEMENT_SECTION_IDS
                : TYPES_OF_USER_CHARGE_COLUMNS_DATA_ELEMENT_SECTION_IDS;

        const idsByTypeOfHealthcareByPolicyExplorerSubcategoriesIdsSelected =
            this.filterGroupedDataElementIdsByPolicyExplorerSubcategoriesIds(
                idsByTypeOfHealthcare,
                policyExplorerSubcategoriesIds
            );

        const idsByColumnByPolicyExplorerSubcategoriesIdsSelected =
            this.filterGroupedDataElementIdsByPolicyExplorerSubcategoriesIds(
                idsByColumn,
                policyExplorerSubcategoriesIds
            );

        const rows = Object.entries(idsByTypeOfHealthcareByPolicyExplorerSubcategoriesIdsSelected).reduce(
            (accRows: PolicyExplorerCell[][], [healthcareType, dataElementsSectionIdsInType], index) => {
                const initCellsInRow: PolicyExplorerCell[] =
                    index === 0
                        ? [
                              { type: PolicyExplorerCellType.DATA, value: orgUnitName },
                              { type: PolicyExplorerCellType.DATA, value: period || EMPTY_DATA },
                              { type: PolicyExplorerCellType.HEADER, value: healthcareType },
                          ]
                        : [
                              { type: PolicyExplorerCellType.DATA, value: EMPTY_DATA },
                              { type: PolicyExplorerCellType.DATA, value: EMPTY_DATA },
                              { type: PolicyExplorerCellType.HEADER, value: healthcareType },
                          ];

                const restCellsInRow = Object.values(idsByColumnByPolicyExplorerSubcategoriesIdsSelected).map(
                    dataElementsSectionIdsInColumn => {
                        const dataElementsSectionId = dataElementsSectionIdsInColumn.find(item =>
                            dataElementsSectionIdsInType.includes(item)
                        );

                        const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementsSectionId);
                        return {
                            type: PolicyExplorerCellType.DATA,
                            value: dataValue?.value || EMPTY_DATA,
                            references,
                        };
                    }
                );

                const row = [...initCellsInRow, ...restCellsInRow];

                const isAllRowEmpty = restCellsInRow.every(cell => !cell.value);
                return isAllRowEmpty ? accRows : [...accRows, row];
            },
            []
        );

        return [...currentRowsInTable, ...rows];
    }

    private filterGroupedDataElementIdsByPolicyExplorerSubcategoriesIds(
        groupedDataElementIds: Record<string, string[]>,
        policyExplorerSubcategoriesIds: string[]
    ) {
        const filteredData: Record<string, string[]> = {};

        for (const key in groupedDataElementIds) {
            const filteredArray = groupedDataElementIds[key]?.filter((item: string) =>
                policyExplorerSubcategoriesIds.includes(item)
            );
            if (filteredArray?.length) {
                filteredData[key] = filteredArray;
            }
        }

        return filteredData;
    }
}
