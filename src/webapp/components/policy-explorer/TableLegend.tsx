import React from "react";

import { CategoryOption } from "./category-selector/useCategorySelector";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { TableCoverageLegend } from "./TableCoverageData";
import { TableEntitlementsLegend } from "./TableEntitlementsData";

export const TableLegend = React.memo(({ category }: { category: CategoryOption }) => {
    if (category.value === CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES_APPLY) {
        return <TableCoverageLegend />;
    } else if (category.value === DATASET_ENTITLEMENTS_FOR_UNDOCUMENTED_CATEGORY) {
        return <TableEntitlementsLegend />;
    } else {
        return <></>;
    }
});
