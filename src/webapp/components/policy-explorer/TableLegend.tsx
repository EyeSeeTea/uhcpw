import React from "react";

import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { TableCoverageLegend } from "./TableCoverageData";
import { TableEntitlementsLegend } from "./TableEntitlementsData";
import { Id } from "../../../domain/entities/Ref";

export const TableLegend = React.memo(({ categoryId }: { categoryId: Id }) => {
    if (categoryId === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY) {
        return <TableCoverageLegend />;
    } else if (categoryId === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY) {
        return <TableEntitlementsLegend />;
    } else {
        return <></>;
    }
});
