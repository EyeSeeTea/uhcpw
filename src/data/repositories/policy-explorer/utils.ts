import { isCellTypedData, PolicyExplorerCell } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { HealthCoverage } from "../../../domain/entities/HealthCoverage";

const healthCoverageValueMap: Record<HealthCoverage, string> = {
    yes: "⬤",
    no: "",
    varies: "◐",
    notCovered: "🅧",
};

export function mapCellToExportedValue(cell: PolicyExplorerCell) {
    if (isCellTypedData(cell)) {
        switch (cell.dataType) {
            case "coverage":
                return healthCoverageValueMap[cell.value] || "";
        }
    } else {
        return cell.value;
    }
}
