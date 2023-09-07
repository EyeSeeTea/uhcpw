import { useCallback, useEffect, useState } from "react";
import { PolicyExplorer, PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";

import i18n from "../../../locales";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { DataOrientation, PolicyExplorerState } from "./PolicyExplorerState";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";

export function usePolicyExplorer({
    categories,
    countriesFilter,
    yearsFilter,
}: {
    categories?: Record<string, string[]>;
    countriesFilter?: string[];
    yearsFilter?: string[];
}): PolicyExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2(countriesFilter);

    const [categoryFilters, setCategoryFilters] = useState<CategoryOption[]>([]);
    const [selectedCategoriesWithSubcategoriesFilter, setSelectedCategoriesWithSubcategoriesFilter] = useState<
        Record<string, string[]> | undefined
    >();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>([
        new Date().getFullYear().toString(),
    ]);

    const [initialDataByTable, setInitialDataByTable] = useState<PolicyExplorer | undefined>();
    const [dataByTable, setDataByTable] = useState<PolicyExplorer | undefined>();
    const [dataOrientationByTable, setDataOrientationByTable] = useState<Record<string, DataOrientation> | undefined>();

    useEffect(() => {
        setSelectedCategoriesWithSubcategoriesFilter(categories);
        if (yearsFilter) {
            setSelectedYearFilter(yearsFilter);
        }
    }, [categories, yearsFilter]);

    useEffect(() => {
        if (!countryFilter.selected?.length) {
            setInitialDataByTable(undefined);
            setDataByTable(undefined);
            setDataOrientationByTable(undefined);
        }
    }, [countryFilter.selected?.length]);

    useEffect(() => {
        compositionRoot.policyExplorer.getYears.execute().run(
            years => {
                setYearsFilters(
                    years.map(year => {
                        const isCurrentYear = new Date().getFullYear().toString() === year.id;
                        return { value: year.id, text: isCurrentYear ? i18n.t("Latest avalaible year") : year.id };
                    })
                );
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    useEffect(() => {
        compositionRoot.policyExplorer.getCategories.execute().run(
            categories => {
                setCategoryFilters(buildCategoryFilterOptions(categories));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    const onGetTable = useCallback(() => {
        if (
            selectedCategoriesWithSubcategoriesFilter &&
            Object.keys(selectedCategoriesWithSubcategoriesFilter)?.length
        ) {
            compositionRoot.policyExplorer.get
                .execute(
                    selectedCategoriesWithSubcategoriesFilter,
                    countryFilter.selected || [],
                    selectedYearFilter ? selectedYearFilter : []
                )
                .run(
                    policyExplorer => {
                        setInitialDataByTable(policyExplorer);

                        const categoriesIds = Object.keys(selectedCategoriesWithSubcategoriesFilter);
                        setDataByTable(invertAllData(policyExplorer, categoriesIds));
                        setDataOrientationByTable(getInitialDataOrientationByTable(categoriesIds));
                    },
                    () => {
                        setInitialDataByTable(undefined);
                        setDataByTable(undefined);
                        setDataOrientationByTable(undefined);
                    }
                );
        } else {
            setInitialDataByTable(undefined);
            setDataByTable(undefined);
            setDataOrientationByTable(undefined);
        }
    }, [
        compositionRoot.policyExplorer.get,
        countryFilter.selected,
        selectedCategoriesWithSubcategoriesFilter,
        selectedYearFilter,
    ]);

    const onChangeCategoryFilter = useCallback((value: Record<string, string[]> | undefined) => {
        setSelectedCategoriesWithSubcategoriesFilter(value);
        if (!value) {
            setInitialDataByTable(undefined);
            setDataByTable(undefined);
            setDataOrientationByTable(undefined);
        }
    }, []);

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    const onSwitchRowColumn = useCallback(
        (categoryId: string) => {
            const newDataorientation =
                dataOrientationByTable && dataOrientationByTable[categoryId] === "normal" ? "inverted" : "normal";
            setDataOrientationByTable({ ...dataOrientationByTable, [categoryId]: newDataorientation });

            const newData =
                newDataorientation === "inverted"
                    ? invertDataByCategoryId(dataByTable, categoryId)
                    : {
                          ...dataByTable,
                          tables: {
                              ...dataByTable?.tables,
                              [categoryId]: initialDataByTable?.tables[categoryId],
                          },
                      };

            setDataByTable(newData as PolicyExplorer);
        },
        [dataByTable, dataOrientationByTable, initialDataByTable]
    );

    const onDownload = useCallback(
        (categoryId: string) => {
            if (!dataByTable) return;

            compositionRoot.policyExplorer.download.execute(dataByTable, categoryId).runAsync();
        },
        [compositionRoot.policyExplorer, dataByTable]
    );

    return {
        filters: {
            country: countryFilter,
            category: {
                options: categoryFilters,
                selected: selectedCategoriesWithSubcategoriesFilter,
                onSelectedChange: onChangeCategoryFilter,
            },
            year: {
                options: yearFilters,
                selected: selectedYearFilter,
                onSelectedChange: onChangeYearFilter,
            },
        },
        data: dataByTable,
        dataOrientationByTable,
        onGetTable,
        onSwitchRowColumn,
        onDownload,
    };
}

function invertDataByCategoryId(
    dataByTable: PolicyExplorer | undefined,
    categoryId: string
): PolicyExplorer | undefined {
    if (!dataByTable || !categoryId) return undefined;

    const rows = dataByTable.tables[categoryId] || [];
    const columns = [...rows].shift() || [];

    const newRows = columns.map((_, index) => {
        const cells = rows.map(row => ({
            type: row[index]?.type || PolicyExplorerCellType.DATA,
            value: row[index]?.value || "",
        }));
        return [...cells];
    });

    const newData = {
        ...dataByTable,
        tables: {
            ...dataByTable.tables,
            [categoryId]: newRows,
        },
    };

    return newData;
}

function invertAllData(
    initialDataByTable: PolicyExplorer | undefined,
    selectedCategoriesIds: string[]
): PolicyExplorer | undefined {
    if (!initialDataByTable || !selectedCategoriesIds.length) return undefined;

    const data = { ...initialDataByTable };
    return selectedCategoriesIds.reduce((acc, categoryId) => {
        const rows = initialDataByTable.tables[categoryId] || [];
        const columns = [...rows].shift() || [];

        const newRows = columns.map((_, index) => {
            const cells = rows.map(row => ({
                type: row[index]?.type || PolicyExplorerCellType.DATA,
                value: row[index]?.value || "",
            }));
            return [...cells];
        });

        return {
            ...acc,
            tables: {
                ...acc.tables,
                [categoryId]: newRows,
            },
        };
    }, data);
}

function getInitialDataOrientationByTable(selectedCategoriesIds: string[]): Record<string, DataOrientation> {
    const dataOrientation = {};
    return selectedCategoriesIds.reduce(
        (acc, categoryId) => ({
            ...acc,
            [categoryId]: "inverted",
        }),
        dataOrientation
    );
}

function buildCategoryFilterOptions(categories: PolicyExplorerCategory[]): CategoryOption[] {
    return categories.map(category => ({
        value: category.id,
        text: category.name,
        subcategories: category.subcategories?.map(subcategory => ({ value: subcategory.id, text: subcategory.name })),
    }));
}
