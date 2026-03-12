import { useCallback, useEffect, useMemo, useState } from "react";

import {
    PolicyExplorer,
    PolicyExplorerCell,
    PolicyExplorerCellType,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { useAppContext } from "../../contexts/app-context";
import { Id } from "../../../domain/entities/Ref";
import { PolicyExplorerSelectableCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import { CategorySelectableOption } from "../../components/policy-explorer/category-selector/useCategorySelector";
import { Maybe } from "../../../types/utils";

type RegionalPolicyExplorerTableState = {
    tableData: PolicyExplorerCell[][] | undefined;
    hasData: boolean;
    category: CategorySelectableOption | undefined;
    isNotesDialogOpen: boolean;
    setIsNotesDialogOpen: (isOpen: boolean) => void;
    isLoading: boolean;
    onDownload: () => void;
};

export function useRegionalPolicyExplorerTable(
    countries: Id[],
    policyCategoryId: Id,
    years: string[]
): RegionalPolicyExplorerTableState {
    const { compositionRoot, countriesAndSubregions } = useAppContext();

    const [tableData, setTableData] = useState<Maybe<PolicyExplorerCell[][]>>();
    const [policyExplorerData, setPolicyExplorerData] = useState<Maybe<PolicyExplorer>>();

    const [category, setCategory] = useState<CategorySelectableOption | undefined>();
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        compositionRoot.policyExplorer.getCategories.execute(true).run(
            categories => {
                if (countries.length) {
                    const selectableCategories = categories.flatMap(category =>
                        category.type === "group" ? category.categories : [category]
                    );

                    setLoading(true);
                    const category = selectableCategories.find(cat => cat.id === policyCategoryId);

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
                        .execute(policyCategory, countries, years, countriesAndSubregions, selectableCategories, true)
                        .run(
                            policyExplorerData => {
                                setPolicyExplorerData(policyExplorerData);
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

    const hasData = useMemo(() => {
        return (
            tableData !== undefined &&
            tableData.length > 0 &&
            tableData.some(row => {
                return row.some(cell => cell.type === PolicyExplorerCellType.DATA && cell.value !== "");
            })
        );
    }, [tableData]);

    const onDownload = useCallback(() => {
        if (!tableData || !category || !policyExplorerData) return;
        compositionRoot.policyExplorer.download
            .execute(
                [
                    {
                        id: category.value,
                        name: category.text,
                        subcategories: category.subcategories.map(option => ({ id: option.value, name: option.text })),
                        description: category.description,
                        type: "selectable",
                    },
                ],
                {
                    ...policyExplorerData,
                    tables: { [category.value]: tableData },
                },
                category.text
            )
            .runAsync();
    }, [compositionRoot.policyExplorer.download, category, tableData, policyExplorerData]);

    return {
        tableData: tableData,
        hasData: hasData,
        category: category,
        isNotesDialogOpen: isNotesDialogOpen,
        setIsNotesDialogOpen: setIsNotesDialogOpen,
        isLoading: loading,
        onDownload: onDownload,
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

function buildCategoryOption(category: PolicyExplorerSelectableCategory): CategorySelectableOption {
    return {
        value: category.id,
        text: category.name,
        subcategories: category.subcategories?.map(subcategory => ({ value: subcategory.id, text: subcategory.name })),
        description: category.description,
        type: "selectable",
    };
}
