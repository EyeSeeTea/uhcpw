import { DataValueSetsDataValue } from "../../../../types/d2-api";
import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME, D2DataSet, EMPTY_DATA, PERIOD_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { TableBuilder } from "./TableBuilder";
import { CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID } from "../PolicyExplorerCategoryD2Repository";
import { generateRangeOfYears } from "../../../../domain/usecases/utils/generateYears";

export const CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES = {
    AREA_OF_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
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
    HEALTH_SERVICES_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
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
    PEOPLE_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
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
    POLICY_OF_CHANGE_IN_COVERAGE_POLICY_PRE2019: [
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
};

// NOTICE: This is because in the same year data could change up to 10 times and table have to show all the data changes
export const CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES_BY_CHANGE_IN_YEARS = {
    FIRST_CHANGE: ["KDsEXYarBTu", "gOtySPsOkmn", "CnlZeapVRTA", "u50ywFZ6gum"],
    SECOND_CHANGE: ["ewpOQ5y97nj", "ueyZG15lJNe", "Dg9FyroZ53d", "pnUIywtp441"],
    THIRD_CHANGE: ["hDGqtzIFTAg", "oR85dLJrBWB", "Ak3h87SXFws", "fVrKY8v7ZRy"],
    FOURTH_CHANGE: ["Ed553tXFkcC", "GMqwcTkBm5u", "OAFiKkIj9AV", "xZjl72SoX34"],
    FIFTH_CHANGE: ["G90HxQdY44N", "GwYOC7auTo3", "VqZfgxa6KhX", "RPDIUoT8kU7"],
    SIXTH_CHANGE: ["NYOzeiIIuer", "qOJSgPcqcL2", "jRzKTIos828", "D4F1hKgVhkm"],
    SEVENTH_CHANGE: ["sbJ5LiyNmKl", "WR7QyEwmqtq", "vmfNUlnK3D3", "vWyHWGYlxGx"],
    EIGHTH_CHANGE: ["WA27bUg63Dh", "x3jxJF9DqNy", "B12VprnJrCs", "os0IgAMStfl"],
    NINTH_CHANGE: ["xGDYpRE0Vvl", "YzGXBvmFVYm", "uPUoqXkGxWx", "OE3asNfDFlf"],
    TENTH_CHANGE: ["uF05inoJDh5", "iP2LBbjXJMD", "NG7PK1qyFuN", "LzUtOANFszs"],
};

export const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES = {
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
    ],
    POLICY_OF_CHANGE_IN_COVERAGE_POLICY: [
        "mQYv2QxdflF",
        "dfWsuiDvDlR",
        "JMYOe9wMIoE",
        "tdlh9Z0uktG",
        "PyBU3BkN3oQ",
        "kUBtnGm4EKp",
        "TH73JJkBEXA",
        "gdZ63nAVakA",
        "O5Z0EpAy0HE",
        "IVVTmrOelXA",
    ],
    HEALTH_SERVICES_TARGETED_IN_CHANGE_IN_COVERAGE_POLICY: [
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
    ],
};

// NOTICE: This is because in the same year data could change up to 10 times and table have to show all the data changes
export const CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES_BY_CHANGE_IN_YEARS = {
    FIRST_CHANGE: ["xP4nCc5rpV4", "mQYv2QxdflF", "peIML3XRBaN", "CUSj5kPkJ0W"],
    SECOND_CHANGE: ["AFxIxVuvvsZ", "dfWsuiDvDlR", "FKBHFNqiFM4", "fgsOChZT1Yp"],
    THIRD_CHANGE: ["IjpUXUVF9bn", "JMYOe9wMIoE", "AZgRUJmVPNi", "M90TwNwsXjY"],
    FOURTH_CHANGE: ["Soj201VJFWL", "tdlh9Z0uktG", "jq0sGqVVTNW", "XZbHFY1652W"],
    FIFTH_CHANGE: ["JfqWVc1eCJl", "PyBU3BkN3oQ", "zvBP5xebI2D", "b5kKyrRkcHG"],
    SIXTH_CHANGE: ["CEjDnfFPHAn", "kUBtnGm4EKp", "SfaynclXRLx", "Azmt9ndZOE2"],
    SEVENTH_CHANGE: ["PRq7KFCDGWc", "TH73JJkBEXA", "QMd8Ch70DMO", "S9zr8VMFxu7"],
    EIGHTH_CHANGE: ["oVgaMvPvL3R", "gdZ63nAVakA", "zNkK3T9RC20", "DzK5t6bz3En"],
    NINTH_CHANGE: ["eohpuMxhpeT", "O5Z0EpAy0HE", "qbUvq6u68Vp", "GJ7LuLvC5NP"],
    TENTH_CHANGE: ["e4ieVLuEisR", "IVVTmrOelXA", "SLw4hji7Eqz", "l26WfNjfVSx"],
};

export class TableBuilderChangesInCoveragePolicy implements TableBuilder {
    buildColumns(params: { dataSet?: D2DataSet }): PolicyExplorerCell[] {
        const { dataSet } = params;
        const dataElementsSection = this.getDataElementsSectionForChangesInCoveragePolicy(dataSet);

        return [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
            { type: PolicyExplorerCellType.HEADER, value: PERIOD_HEADER_NAME },
            ...dataElementsSection.map(de => ({
                type: PolicyExplorerCellType.HEADER,
                value: de.description || de.formName,
            })),
        ];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        period?: string;
        references: string;
    }): PolicyExplorerCell[][] {
        const { currentRowsInTable, dataValuesByGroup, orgUnitName, period, references } = params;

        if (!period) return currentRowsInTable;

        const upToAndIncluding2019 = generateRangeOfYears(2000, 2019).map(years => years.id);

        const subcategoriesIdsByColumn = upToAndIncluding2019.includes(period)
            ? CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES
            : CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES;

        const subcategoriesIdsByChangeInTheYear = upToAndIncluding2019.includes(period)
            ? CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES_BY_CHANGE_IN_YEARS
            : CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES_BY_CHANGE_IN_YEARS;

        const rows = Object.values(subcategoriesIdsByChangeInTheYear).reduce(
            (accRows: PolicyExplorerCell[][], subcategoriesIdsInAChangeOfTheYear, index) => {
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

    private getDataElementsSectionForChangesInCoveragePolicy(dataSet?: D2DataSet) {
        const onlyFirstIdOfSubcategories = [
            ...CHANGES_IN_COVERAGE_POLICY_UP_TO_AND_INCLUDING_2019_SUBCATEGORIES_BY_CHANGE_IN_YEARS.FIRST_CHANGE,
            ...CHANGES_IN_COVERAGE_POLICY_SINCE_2020_SUBCATEGORIES_BY_CHANGE_IN_YEARS.FIRST_CHANGE,
        ];
        return this.getDataElementsSection(onlyFirstIdOfSubcategories, dataSet);
    }

    private getDataElementsSection(policyExplorerSubcategoriesIds: string[], dataSet?: D2DataSet) {
        return (
            dataSet?.sections
                .find(
                    section =>
                        section.id === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019 ||
                        section.id === CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020
                )
                ?.dataElements.filter(
                    de =>
                        (de.valueType === "LONG_TEXT" || de.valueType === "TEXT") &&
                        policyExplorerSubcategoriesIds.includes(de.id)
                ) || []
        );
    }
}
