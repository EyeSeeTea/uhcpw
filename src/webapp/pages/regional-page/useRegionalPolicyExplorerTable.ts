import { useEffect, useState } from "react";

import { PolicyExplorerCell, PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { CategoryOption } from "../../components/policy-explorer/category-selector/useCategorySelector";

type RegionalPolicyExplorerTableState = {
    tableData: PolicyExplorerCell[][] | undefined;
    category: CategoryOption | undefined;
    isNotesDialogOpen: boolean;
    setIsNotesDialogOpen: (isOpen: boolean) => void;
    isLoading: boolean;
};

export function useRegionalPolicyExplorerTable(
    countries: Id[],
    policyCategoryId: Id,
    years: string[]
): RegionalPolicyExplorerTableState {
    const { compositionRoot, countriesAndSubregions } = useAppContext();

    const [tableData, setTableData] = useState<PolicyExplorerCell[][] | undefined>();
    const [category, setCategory] = useState<CategoryOption | undefined>();
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        compositionRoot.policyExplorer.getCategories.execute().run(
            categories => {
                if (countries.length) {
                    setLoading(true);
                    const category = categories.find(cat => cat.id === policyCategoryId);

                    if (!category) {
                        setCategory(undefined);
                        setTableData(undefined);
                        setLoading(false);
                        return;
                    }

                    setCategory(buildCategoryOption(category));

                    const categoriesIds = category.subcategories.map(subcat => subcat.id);
                    const policyCategory = {
                        [policyCategoryId]: categoriesIds,
                    };

                    compositionRoot.policyExplorer.get
                        .execute(policyCategory, countries, years, countriesAndSubregions, categories)
                        .run(
                            policyExplorerData => {
                                setTableData(invertTableData(policyExplorerData.tables[policyCategoryId]));
                                setLoading(false);
                            },
                            () => {
                                setTableData(undefined);
                                setLoading(false);
                            }
                        );
                } else {
                    setTableData(undefined);
                }
            },
            e => {
                console.error("Error fetching policy explorer data", e);
            }
        );
    }, [
        compositionRoot.policyExplorer.get,
        compositionRoot.policyExplorer.getCategories,
        countries,
        countriesAndSubregions,
        policyCategoryId,
        years,
    ]);

    return {
        tableData: tableData,
        category: category,
        isNotesDialogOpen: isNotesDialogOpen,
        setIsNotesDialogOpen: setIsNotesDialogOpen,
        isLoading: loading,
    };
}

function invertTableData(tableData: PolicyExplorerCell[][] | undefined): PolicyExplorerCell[][] | undefined {
    if (!tableData) {
        return undefined;
    }

    const columns = [...tableData].shift() || [];

    const newRows = columns.map((_, index) => {
        const cells = tableData.map(row => {
            const cell = row[index];
            if (!cell) {
                return {
                    type: PolicyExplorerCellType.DATA,
                    value: "",
                    references: "",
                };
            }
            return cell;
        });
        return cells;
    });

    return newRows;
}

function buildCategoryOption(category: PolicyExplorerCategory): CategoryOption {
    return {
        value: category.id,
        text: category.name,
        subcategories: category.subcategories?.map(subcategory => ({ value: subcategory.id, text: subcategory.name })),
        description: category.description,
    };
}
