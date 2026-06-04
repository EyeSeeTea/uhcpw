import { DataValueSetsDataValue } from "../../../../types/d2-api";
import {
    PolicyExplorerCell,
    PolicyExplorerCellHeader,
    PolicyExplorerCellType,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME, D2DataSet, EMPTY_DATA, PERIOD_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { TableBuilder } from "./TableBuilder";
import { CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID } from "../PolicyExplorerCategoryD2Repository";

const AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT = [
    "rFzgrBm8piY",
    "Y0UWk1wG4kw",
    "O9eSNeYpfzq",
    "PG1RjHaaqTu",
    "RRVsUauKccf",
    "jhVIdAjgnEA",
    "XAIhDM4iJHq",
    "QbpUYK6an0Z",
    "e9tWfkO2rmq",
    "a614C538ff6",
    "rYsTOgT34lv",
    "Cl2LRTD6dtU",
    "GiIV5DBa1MQ",
    "jXgydamyX4v",
    "hU9OaM3Ssb3",
    "y4lRm044S5h",
    "Hxor3bU0wG8",
    "nt5iHC69vO5",
    "lOruUIIynsj",
    "KY0FwjqW4xj",
] as const;

export const CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES: Record<string, string[]> = {
    MONTH_OF_CHANGE_IN_COVERAGE_POLICY: [
        "SZj4LVtPJhZ",
        "eAvddXS2gMt",
        "YJ95rSdosLq",
        "fBN2oqBByJi",
        "RMMwFbPBCSZ",
        "KaHyWIkTXed",
        "Wkhte2i9YUQ",
        "N0vnvEUWgsq",
        "slyKOdh6XTH",
        "JP6tyBu3236",
        "U4N5xac8pmo",
        "D78Xa9pSvpm",
        "WwaBsXSleHu",
        "sZX7Hpaa9Sh",
        "xe9vvN9AcBU",
        "rLIXdgvrk0R",
        "cWBSBglr7so",
        "t22ker43Vi7",
        "WRaZ7YO8JV6",
        "BrmUF8mdt3c",
    ],
    AREA_OF_CHANGE_IN_COVERAGE_POLICY: [
        "xP4nCc5rpV4",
        "AFxIxVuvvsZ",
        "IjpUXUVF9bn",
        "Soj201VJFWL",
        "JfqWVc1eCJl",
        "CEjDnfFPHAn",
        "PRq7KFCDGWc",
        "oVgaMvPvL3R",
        "eohpuMxhpeT",
        "e4ieVLuEisR",
        "KDsEXYarBTu",
        "ewpOQ5y97nj",
        "hDGqtzIFTAg",
        "Ed553tXFkcC",
        "G90HxQdY44N",
        "NYOzeiIIuer",
        "sbJ5LiyNmKl",
        "WA27bUg63Dh",
        "xGDYpRE0Vvl",
        "uF05inoJDh5",
    ],
    POLICY_OF_CHANGE_IN_COVERAGE_POLICY: [
        "mQYv2QxdflF",
        "JMYOe9wMIoE",
        "dfWsuiDvDlR",
        "tdlh9Z0uktG",
        "PyBU3BkN3oQ",
        "kUBtnGm4EKp",
        "TH73JJkBEXA",
        "gdZ63nAVakA",
        "O5Z0EpAy0HE",
        "IVVTmrOelXA",
        "u50ywFZ6gum",
        "pnUIywtp441",
        "fVrKY8v7ZRy",
        "xZjl72SoX34",
        "RPDIUoT8kU7",
        "D4F1hKgVhkm",
        "vWyHWGYlxGx",
        "os0IgAMStfl",
        "OE3asNfDFlf",
        "LzUtOANFszs",
    ],
    HEALTH_CARE_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY: [
        "peIML3XRBaN",
        "FKBHFNqiFM4",
        "AZgRUJmVPNi",
        "jq0sGqVVTNW",
        "zvBP5xebI2D",
        "SfaynclXRLx",
        "QMd8Ch70DMO",
        "zNkK3T9RC20",
        "qbUvq6u68Vp",
        "SLw4hji7Eqz",
        "gOtySPsOkmn",
        "ueyZG15lJNe",
        "oR85dLJrBWB",
        "GMqwcTkBm5u",
        "GwYOC7auTo3",
        "qOJSgPcqcL2",
        "WR7QyEwmqtq",
        "x3jxJF9DqNy",
        "YzGXBvmFVYm",
        "iP2LBbjXJMD",
    ],
    PEOPLE_TARGETED_IN_CHARGE_IN_COVERAGE_POLICY: [
        "CUSj5kPkJ0W",
        "fgsOChZT1Yp",
        "M90TwNwsXjY",
        "XZbHFY1652W",
        "b5kKyrRkcHG",
        "Azmt9ndZOE2",
        "S9zr8VMFxu7",
        "DzK5t6bz3En",
        "GJ7LuLvC5NP",
        "l26WfNjfVSx",
        "CnlZeapVRTA",
        "Dg9FyroZ53d",
        "Ak3h87SXFws",
        "OAFiKkIj9AV",
        "VqZfgxa6KhX",
        "jRzKTIos828",
        "vmfNUlnK3D3",
        "B12VprnJrCs",
        "uPUoqXkGxWx",
        "NG7PK1qyFuN",
    ],
};

// NOTICE: This is because in the same year data could change up to 20 times and table have to show all the data changes
export const CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS: Record<string, string[]> = {
    FIRST_CHANGE: [
        "SZj4LVtPJhZ",
        "xP4nCc5rpV4",
        "mQYv2QxdflF",
        "peIML3XRBaN",
        "CUSj5kPkJ0W",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[0],
    ],
    SECOND_CHANGE: [
        "eAvddXS2gMt",
        "AFxIxVuvvsZ",
        "JMYOe9wMIoE",
        "FKBHFNqiFM4",
        "fgsOChZT1Yp",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[1],
    ],
    THIRD_CHANGE: [
        "YJ95rSdosLq",
        "IjpUXUVF9bn",
        "dfWsuiDvDlR",
        "AZgRUJmVPNi",
        "M90TwNwsXjY",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[2],
    ],
    FOURTH_CHANGE: [
        "fBN2oqBByJi",
        "Soj201VJFWL",
        "tdlh9Z0uktG",
        "jq0sGqVVTNW",
        "XZbHFY1652W",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[3],
    ],
    FIFTH_CHANGE: [
        "RMMwFbPBCSZ",
        "JfqWVc1eCJl",
        "PyBU3BkN3oQ",
        "zvBP5xebI2D",
        "b5kKyrRkcHG",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[4],
    ],
    SIXTH_CHANGE: [
        "KaHyWIkTXed",
        "CEjDnfFPHAn",
        "kUBtnGm4EKp",
        "SfaynclXRLx",
        "Azmt9ndZOE2",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[5],
    ],
    SEVENTH_CHANGE: [
        "Wkhte2i9YUQ",
        "PRq7KFCDGWc",
        "TH73JJkBEXA",
        "QMd8Ch70DMO",
        "S9zr8VMFxu7",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[6],
    ],
    EIGHTH_CHANGE: [
        "N0vnvEUWgsq",
        "oVgaMvPvL3R",
        "gdZ63nAVakA",
        "zNkK3T9RC20",
        "DzK5t6bz3En",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[7],
    ],
    NINTH_CHANGE: [
        "slyKOdh6XTH",
        "eohpuMxhpeT",
        "O5Z0EpAy0HE",
        "qbUvq6u68Vp",
        "GJ7LuLvC5NP",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[8],
    ],
    TENTH_CHANGE: [
        "JP6tyBu3236",
        "e4ieVLuEisR",
        "IVVTmrOelXA",
        "SLw4hji7Eqz",
        "l26WfNjfVSx",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[9],
    ],
    ELEVENTH_CHANGE: [
        "U4N5xac8pmo",
        "KDsEXYarBTu",
        "u50ywFZ6gum",
        "gOtySPsOkmn",
        "CnlZeapVRTA",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[10],
    ],
    TWELFTH_CHANGE: [
        "D78Xa9pSvpm",
        "ewpOQ5y97nj",
        "pnUIywtp441",
        "ueyZG15lJNe",
        "Dg9FyroZ53d",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[11],
    ],
    THIRTEENTH_CHANGE: [
        "WwaBsXSleHu",
        "hDGqtzIFTAg",
        "fVrKY8v7ZRy",
        "oR85dLJrBWB",
        "Ak3h87SXFws",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[12],
    ],
    FOURTEENTH_CHANGE: [
        "sZX7Hpaa9Sh",
        "Ed553tXFkcC",
        "xZjl72SoX34",
        "GMqwcTkBm5u",
        "OAFiKkIj9AV",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[13],
    ],
    FIFTEENTH_CHANGE: [
        "xe9vvN9AcBU",
        "G90HxQdY44N",
        "RPDIUoT8kU7",
        "GwYOC7auTo3",
        "VqZfgxa6KhX",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[14],
    ],
    SIXTEENTH_CHANGE: [
        "rLIXdgvrk0R",
        "NYOzeiIIuer",
        "D4F1hKgVhkm",
        "qOJSgPcqcL2",
        "jRzKTIos828",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[15],
    ],
    SEVENTEENTH_CHANGE: [
        "cWBSBglr7so",
        "sbJ5LiyNmKl",
        "vWyHWGYlxGx",
        "WR7QyEwmqtq",
        "vmfNUlnK3D3",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[16],
    ],
    EIGHTEENTH_CHANGE: [
        "t22ker43Vi7",
        "WA27bUg63Dh",
        "os0IgAMStfl",
        "x3jxJF9DqNy",
        "B12VprnJrCs",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[17],
    ],
    NINETEENTH_CHANGE: [
        "WRaZ7YO8JV6",
        "xGDYpRE0Vvl",
        "OE3asNfDFlf",
        "YzGXBvmFVYm",
        "uPUoqXkGxWx",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[18],
    ],
    TWENTIETH_CHANGE: [
        "BrmUF8mdt3c",
        "uF05inoJDh5",
        "LzUtOANFszs",
        "iP2LBbjXJMD",
        "NG7PK1qyFuN",
        AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT[19],
    ],
};

const MONTH_NAME_ORDER = [
    "December",
    "November",
    "October",
    "September",
    "August",
    "July",
    "June",
    "May",
    "April",
    "March",
    "February",
    "January",
] as const;

const MONTH_REGEX = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;

export class TableBuilderChangesInCoveragePolicy implements TableBuilder {
    buildColumns(params: { dataSet?: D2DataSet }): PolicyExplorerCellHeader[] {
        const { dataSet } = params;
        const columnsNames = this.getColumnsNamesFromChangesInCoveragePolicy(dataSet);

        return [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
            { type: PolicyExplorerCellType.HEADER, value: PERIOD_HEADER_NAME },
            ...columnsNames.map<PolicyExplorerCellHeader>(name => ({
                type: PolicyExplorerCellType.HEADER,
                value: name,
            })),
        ];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
        sortByMonth?: boolean;
        policyExplorerSubcategoriesIds?: string[];
    }): PolicyExplorerCell[][] {
        const {
            currentRowsInTable,
            dataValuesByGroup,
            orgUnitName,
            period,
            references,
            sortByMonth = false,
            policyExplorerSubcategoriesIds,
        } = params;

        if (!period) return currentRowsInTable;

        const subcategoriesIdsByColumn = CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES;

        const subcategoriesIdsByChangeInTheYear = sortByMonth
            ? this.getSubcategoriesIdsByChangeInTheYearSortedByMonth(dataValuesByGroup)
            : CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS;

        const rows = Object.values(subcategoriesIdsByChangeInTheYear).reduce(
            (accRows: PolicyExplorerCell[][], subcategoriesIdsInAChangeOfTheYear, index) => {
                const areaTypeCatDataElementId = AREA_OF_CHANGE_IN_COVERAGE_POLICY_CAT.find(areaCategory =>
                    subcategoriesIdsInAChangeOfTheYear.includes(areaCategory)
                );
                const areaTypeCatDataValues =
                    dataValuesByGroup.find(dv => dv.dataElement === areaTypeCatDataElementId)?.value.split(",") ?? [];

                const isAreaTypeInSubcategories = areaTypeCatDataValues.some(areaType =>
                    policyExplorerSubcategoriesIds?.includes(areaType)
                );

                if (!isAreaTypeInSubcategories) {
                    return accRows;
                }

                const initCellsInRow: PolicyExplorerCell[] =
                    index === 0 || !accRows.length
                        ? [
                              { type: PolicyExplorerCellType.DATA, value: orgUnitName },
                              { type: PolicyExplorerCellType.DATA, value: period || EMPTY_DATA },
                          ]
                        : [
                              { type: PolicyExplorerCellType.DATA, value: EMPTY_DATA },
                              { type: PolicyExplorerCellType.DATA, value: period || EMPTY_DATA },
                          ];

                const restCellsInRow = Object.values(subcategoriesIdsByColumn).map(subcategoriesIdsInColumn => {
                    const subcategoryIdInThisColumnInThisChangeOfTheYear = subcategoriesIdsInColumn.find(
                        subcategoryIdInColumn => subcategoriesIdsInAChangeOfTheYear.includes(subcategoryIdInColumn)
                    );

                    const dataValue = dataValuesByGroup.find(
                        dv => dv.dataElement === subcategoryIdInThisColumnInThisChangeOfTheYear
                    );
                    return {
                        type: PolicyExplorerCellType.DATA,
                        value: dataValue?.value || EMPTY_DATA,
                        references,
                    };
                });

                const row = [...initCellsInRow, ...restCellsInRow];

                const isAllRowEmpty = restCellsInRow.every(cell => !cell.value);
                return isAllRowEmpty ? accRows : [...accRows, row];
            },
            []
        );

        return [...currentRowsInTable, ...rows];
    }

    private getColumnsNamesFromChangesInCoveragePolicy(dataSet?: D2DataSet): string[] {
        const onlyFirstIdOfSubcategories =
            CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS.FIRST_CHANGE?.slice(0, -1) || [];

        const dataElementsFromFirstChangesInCoveragePolicy =
            dataSet?.sections
                .find(section => section.id === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID)
                ?.dataElements.filter(
                    de =>
                        (de.valueType === "LONG_TEXT" || de.valueType === "TEXT") &&
                        onlyFirstIdOfSubcategories.includes(de.id)
                ) || [];

        // Do not show "Month" in header
        return dataElementsFromFirstChangesInCoveragePolicy.map(de =>
            de.id === "U4N5xac8pmo" ? "" : de.description || de.formName
        );
    }

    private getMonthNameFromValue(value: string): string | null {
        const match = value.match(MONTH_REGEX);
        if (!match) return null;

        const month = match[0];
        return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    }

    private getMonthOrderFromValue(value: string): number {
        const monthName = this.getMonthNameFromValue(value);
        if (!monthName) return Number.MAX_SAFE_INTEGER;

        return MONTH_NAME_ORDER.indexOf(monthName as typeof MONTH_NAME_ORDER[number]);
    }

    private getSubcategoriesIdsByChangeInTheYearSortedByMonth(
        dataValuesByGroup: DataValueSetsDataValue[]
    ): typeof CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS {
        const sortedDataElementMonthsIds = (
            CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES?.MONTH_OF_CHANGE_IN_COVERAGE_POLICY || []
        )
            .map((monthDataElementId, index) => {
                const rawValue =
                    dataValuesByGroup.find(dv => dv.dataElement === monthDataElementId)?.value.trim() || EMPTY_DATA;
                const value = rawValue.trim();
                const monthName = this.getMonthNameFromValue(value);

                return {
                    id: monthDataElementId,
                    originalIndex: index,
                    monthName: monthName,
                    monthOrder: this.getMonthOrderFromValue(value),
                };
            })
            .sort((a, b) => {
                const aHasMonth = a.monthName !== null;
                const bHasMonth = b.monthName !== null;

                if (aHasMonth && bHasMonth) {
                    return a.monthOrder - b.monthOrder;
                }

                if (aHasMonth) return -1;
                if (bHasMonth) return 1;

                return a.originalIndex - b.originalIndex;
            })
            .map(item => item.id);

        return sortedDataElementMonthsIds.reduce(
            (acc: Record<string, string[]>, monthId: string): Record<string, string[]> => {
                const changeInTheYearKeyFound = Object.keys(
                    CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS
                ).find(changeInTheYearKey => {
                    const changeInTheYearValueIds =
                        CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS[changeInTheYearKey] || [];

                    const isMonthIdInclude = changeInTheYearValueIds.includes(monthId);

                    return isMonthIdInclude;
                });

                return changeInTheYearKeyFound
                    ? {
                          ...acc,
                          [changeInTheYearKeyFound]:
                              CHANGES_IN_COVERAGE_POLICY_SUBCATEGORIES_BY_CHANGE_IN_YEARS[changeInTheYearKeyFound] ||
                              [],
                      }
                    : acc;
            },
            {}
        );
    }
}
