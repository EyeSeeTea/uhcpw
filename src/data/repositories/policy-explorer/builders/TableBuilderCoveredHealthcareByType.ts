import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import {
    PolicyExplorerCell,
    PolicyExplorerCellHeader,
    PolicyExplorerCellType,
    PolicyExplorerCellCoverage,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { Id } from "../../../../domain/entities/Ref";
import { Maybe } from "../../../../types/utils";
import { PolicyExplorerSelectableCategory } from "../../../../domain/entities/policy-explorer/PolicyExplorerCategory";

type HealthCareType =
    | "Primary care visits"
    | "Outpatient specialist visits"
    | "Emergency care"
    | "Outpatient medicines"
    | "Medical products"
    | "Diagnostics tests"
    | "Dental care visits"
    | "Dental care treatment"
    | "Inpatient care"
    | "Inpatient medicines";

export const USER_CHARGES_APPLY_TYPES_OF_HEALTH_CARE: HealthCareType[] = [
    "Primary care visits",
    "Outpatient specialist visits",
    "Emergency care",
    "Outpatient medicines",
    "Medical products",
    "Diagnostics tests",
    "Dental care visits",
    "Dental care treatment",
    "Inpatient care",
    "Inpatient medicines",
];

export const USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS: Record<HealthCareType, Id> = {
    "Primary care visits": "q2Q3iwrGu0O",
    "Outpatient specialist visits": "O4qsWEa3bS6",
    "Emergency care": "qcw1buhHOjf",
    "Outpatient medicines": "HaEiHOCH79S",
    "Medical products": "Wie0b5v1MvN",
    "Diagnostics tests": "uoyYFskbl1n",
    "Dental care visits": "C0s9QXe5V1q",
    "Dental care treatment": "WGeiJg8qs8l",
    "Inpatient care": "GWwXTTIKpHv",
    "Inpatient medicines": "G4K6dugnvys",
};

const valueMap = {
    YES_3: "yes",
    NO_3: "no",
    NOT_COVERED: "notCovered",
    VARIES: "varies",
    DEFAULT: "none",
} as const;
type ValueMapKey = keyof typeof valueMap;
const isValueMapKey = (v: string): v is ValueMapKey => v in valueMap;

export class TableBuilderCoveredHealthcareByType implements TableBuilder {
    buildColumns(params: {
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        programCategories?: PolicyExplorerSelectableCategory[];
    }): PolicyExplorerCellHeader[] {
        const { policyExplorerSubcategoriesIds } = params;

        const commonColumns: PolicyExplorerCellHeader[] = [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
        ];

        const restColumns = Object.entries(USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS)
            .filter(([_column, dataElementId]) => policyExplorerSubcategoriesIds.includes(dataElementId))
            .map<PolicyExplorerCellHeader>(([columnName, _dataElementId]) => ({
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
    }): PolicyExplorerCell[][] {
        const {
            policyExplorerSubcategoriesIds,
            dataValuesByGroup,
            orgUnitName,
            period,
            references,
            currentRowsInTable,
        } = params;

        const orgUnitCell = {
            type: PolicyExplorerCellType.DATA,
            value: [orgUnitName, period].join(" "),
        };

        const restCellsInRow: PolicyExplorerCellCoverage[] = Object.entries(
            USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS
        )
            .filter(([_column, dataElementId]) => policyExplorerSubcategoriesIds.includes(dataElementId))
            .map(([column, dataElementId]) => {
                const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementId);
                const value = dataValue?.value;
                return {
                    type: PolicyExplorerCellType.DATA,
                    value: value && isValueMapKey(value) ? valueMap[value] : valueMap.DEFAULT,
                    references,
                    dataType: "coverage",
                    columnName: column || "",
                };
            });

        if (restCellsInRow.every(cell => cell.value === valueMap.DEFAULT)) return [...currentRowsInTable];
        else return [...currentRowsInTable, [orgUnitCell, ...restCellsInRow]];
    }

    static fillSubcategories(subcategoriesSelected: Maybe<string[]>) {
        return Object.entries(USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS).reduce(
            (accSubcategories, subcategories) => {
                const [typeOfHealthCare, subcategoriesOfHealthCareId] = subcategories;
                return subcategoriesSelected?.includes(typeOfHealthCare)
                    ? [...accSubcategories, subcategoriesOfHealthCareId]
                    : accSubcategories;
            },
            [] as string[]
        );
    }
}
