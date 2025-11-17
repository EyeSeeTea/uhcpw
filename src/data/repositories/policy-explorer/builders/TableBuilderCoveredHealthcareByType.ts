import { DataValueSetsDataValue } from "@eyeseetea/d2-api/api";
import { TableBuilder } from "./TableBuilder";
import {
    PolicyExplorerCell,
    PolicyExplorerCellData,
    PolicyExplorerCellHeader,
    PolicyExplorerCellType,
} from "../../../../domain/entities/policy-explorer/PolicyExplorer";
import { COUNTRY_HEADER_NAME } from "../PolicyExplorerD2Repository";
import { Id } from "../../../../domain/entities/Ref";
import { Maybe } from "../../../../types/utils";
import { HealthCareType } from "./TableBuilderByTypeOfHealthcare";

export const USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS: Record<HealthCareType, Id> = {
    "Primary care visits": "q2Q3iwrGu0O",
    "Outpatient specialist visits": "O4qsWEa3bS6",
    "Emergency care": "qcw1buhHOjf",
    "Outpatient prescribed medicines": "HaEiHOCH79S",
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
    UNKNOWN_3: "varies",
    DEFAULT: "no",
} as const;
type ValueMapKey = keyof typeof valueMap;
const isValueMapKey = (v: string): v is ValueMapKey => v in valueMap;

export class TableBuilderCoveredHealthcareByType implements TableBuilder {
    buildColumns(_: Parameters<TableBuilder["buildColumns"]>[0]): PolicyExplorerCell[] {
        const columnsDataElementSectionIds = USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS;

        const commonColumns: PolicyExplorerCellHeader[] = [
            { type: PolicyExplorerCellType.HEADER, value: COUNTRY_HEADER_NAME },
        ];

        const restColumns = Object.entries(columnsDataElementSectionIds).map<PolicyExplorerCellHeader>(
            ([columnName, _dataElementIds]) => ({
                type: PolicyExplorerCellType.HEADER,
                value: columnName,
            })
        );

        return [...commonColumns, ...restColumns];
    }

    buildRows(params: {
        currentRowsInTable: PolicyExplorerCell[][];
        policyExplorerCategoryId: string;
        policyExplorerSubcategoriesIds: string[];
        dataValuesByGroup: DataValueSetsDataValue[];
        orgUnitName: string;
        references: string;
    }): PolicyExplorerCell[][] {
        const { policyExplorerSubcategoriesIds, dataValuesByGroup, orgUnitName, references, currentRowsInTable } =
            params;

        const orgUnitCell: PolicyExplorerCellData = {
            type: PolicyExplorerCellType.DATA,
            value: orgUnitName,
        };

        const restCellsInRow: PolicyExplorerCellData[] = Object.values(
            USER_CHARGES_APPLY_BY_TYPE_OF_HEALTHCARE_DATA_ELEMENT_SECTION_IDS
        )
            .filter(dataElementId => policyExplorerSubcategoriesIds.includes(dataElementId))
            .map(dataElementIdInColumn => {
                const dataValue = dataValuesByGroup.find(dv => dv.dataElement === dataElementIdInColumn);
                const value = dataValue?.value;
                return {
                    type: PolicyExplorerCellType.DATA,
                    value: value && isValueMapKey(value) ? valueMap[value] : valueMap.DEFAULT,
                    references,
                    dataType: "coverage",
                };
            });

        const row = [orgUnitCell, ...restCellsInRow];

        return [...currentRowsInTable, row];
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
