import { isCellTypedData, PolicyExplorerCell } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { HealthCoverage } from "../../../domain/entities/policy-explorer/HealthCoverage";
import i18n from "../../../locales";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { Maybe } from "../../../types/utils";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "./PolicyExplorerCategoryD2Repository";
import { Entitlements } from "../../../domain/entities/policy-explorer/Entitlements";
import { Tab } from "../../export/exportToCSV";

const healthCoverageValueMap: Record<HealthCoverage, string> = {
    yes: "⬤",
    no: "",
    varies: "◐",
    notCovered: "🅧",
    none: "",
};

const entitlementsValueMap: Record<Entitlements, string> = {
    most: "⬤",
    none: "",
    some: "◐",
};

export function mapCellToExportedValue(cell: PolicyExplorerCell) {
    if (isCellTypedData(cell)) {
        switch (cell.dataType) {
            case "coverage":
                return healthCoverageValueMap[cell.value] || "";
            case "entitlements":
                return entitlementsValueMap[cell.value] || "";
        }
    } else {
        return cell.value;
    }
}

export function getTableLegends(category: Maybe<PolicyExplorerCategory>): Maybe<Tab["legendsRow"]> {
    if (category?.id === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY) {
        return {
            legends: [
                {
                    legend: [
                        {
                            text: "⬤",
                            styles: {
                                fontColor: "929293",
                                fontSize: 11,
                            },
                        },
                        {
                            text: ` - ${i18n.t("User charges are applied")}`,
                        },
                    ],
                },
                {
                    legend: [
                        {
                            text: "◐",
                            styles: {
                                fontColor: "929293",
                                fontSize: 13,
                            },
                        },
                        {
                            text: ` - ${i18n.t("Care not covered for most people")}`,
                        },
                    ],
                },
                {
                    legend: [
                        {
                            text: "🅧",
                            styles: {
                                fontColor: "929293",
                                fontSize: 12,
                            },
                        },
                        {
                            text: ` - ${i18n.t("Care not covered")}`,
                        },
                    ],
                },
            ],
        };
    } else if (category?.id === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY) {
        return {
            legends: [
                {
                    legend: [
                        {
                            text: "⬤",
                            styles: {
                                fontColor: "0460a7",
                            },
                        },
                        {
                            text: ` - ${i18n.t("Most undocumented migrants")}`,
                        },
                    ],
                },
                {
                    legend: [
                        {
                            text: "◐",
                            styles: {
                                fontColor: "0460a7",
                                fontSize: 14,
                            },
                        },
                        {
                            text: ` - ${i18n.t("Some undocumented migrants")}`,
                        },
                    ],
                },
            ],
        };
    } else {
        return undefined;
    }
}

export function getTabType(category: Maybe<PolicyExplorerCategory>) {
    if (category?.id === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY) {
        return "coverage";
    } else if (category?.id === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY) {
        return "entitlements";
    } else {
        return "text";
    }
}
