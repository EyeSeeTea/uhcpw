import React, { RefObject } from "react";

import { isCellTypedData, PolicyExplorerCell } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { TableTextData } from "./TableTextData";
import { TableCoverageData } from "./TableCoverageData";
import { TableEntitlementsData } from "./TableEntitlementsData";

type PolicyExplorerTableValueProps = {
    cell: PolicyExplorerCell;
    referencesRef?: RefObject<HTMLDivElement>;
};
export const PolicyExplorerTableValue = React.memo(({ cell, referencesRef }: PolicyExplorerTableValueProps) => {
    if (isCellTypedData(cell)) {
        switch (cell.dataType) {
            case "coverage":
                return <TableCoverageData cell={cell} />;
            case "entitlements":
                return <TableEntitlementsData cell={cell} />;
        }
    }
    return <TableTextData cell={cell} referencesRef={referencesRef} />;
});
