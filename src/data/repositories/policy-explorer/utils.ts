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

const healthCoverageValueMap: Record<HealthCoverage, string> = {
    yes: "⬤",
    no: "",
    varies: "🌓",
    notCovered: "🅧",
};

const entitlementsValueMap: Record<Entitlements, string> = {
    most: "⬤",
    none: "",
    some: "🌓",
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

export function getTableLegends(category: Maybe<PolicyExplorerCategory>) {
    if (category?.id === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY) {
        return [
            `⬤ - ${i18n.t("User charges are applied")}`,
            `🌓 - ${i18n.t("Care not covered for most people")}`,
            `🅧 - ${i18n.t("Care not covered")}`,
        ];
    } else if (category?.id === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY) {
        return [`⬤ - ${i18n.t("Most undocumented migrants")}`, `🌓 - ${i18n.t("Some undocumented migrants")}`];
    } else {
        return [];
    }
}
