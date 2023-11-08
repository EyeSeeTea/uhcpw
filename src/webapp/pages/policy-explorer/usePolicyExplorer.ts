import { useCallback, useEffect, useState, useMemo } from "react";
import { PolicyExplorer, PolicyExplorerCellType } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";

import i18n from "../../../locales";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { DataOrientation, PolicyExplorerState } from "./PolicyExplorerState";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import { PolicyExplorerCategory } from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";

const INITIAL_NORMAL_ORIENTED_TABLES = [
    ...Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID),
    ...Object.values(CATEGORY_BY_TYPE_OF_HEALTHCARE),
];

const CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION = [
    ...Object.values(CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID),
    ...Object.values(CATEGORY_BY_TYPE_OF_HEALTHCARE),
];

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
    }, [categories]);

    useEffect(() => {
        if (yearsFilter) {
            setSelectedYearFilter(yearsFilter);
        }
    }, [yearsFilter]);

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
                        setDataByTable(getInitialDataByTable(policyExplorer, categoriesIds));
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

    const disabledCategories = useMemo(() => {
        const isMoreThanOneCountrySelected = countryFilter?.selected?.length && countryFilter?.selected?.length > 1;
        const selectedCategories = selectedCategoriesWithSubcategoriesFilter
            ? Object.keys(selectedCategoriesWithSubcategoriesFilter)
            : [];

        const normalCategories = categoryFilters
            .map(({ value }) => value)
            .filter(category => !CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.includes(category));

        const isSomeCategoryWithSpecialVisualizationSelected = CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION.some(
            category => selectedCategories.includes(category)
        );

        if (isMoreThanOneCountrySelected && isSomeCategoryWithSpecialVisualizationSelected) {
            return normalCategories;
        }

        const isSomeNormalCategorySelected = normalCategories.some(category => selectedCategories.includes(category));

        if (isMoreThanOneCountrySelected && isSomeNormalCategorySelected) {
            return CATEGORIES_WITH_SPECIAL_COUNTRY_VISUALIZATION;
        }
        return [];
    }, [categoryFilters, countryFilter?.selected?.length, selectedCategoriesWithSubcategoriesFilter]);

    const disabledCountries = useMemo(() => {
        const selectedCategories = selectedCategoriesWithSubcategoriesFilter
            ? Object.keys(selectedCategoriesWithSubcategoriesFilter)
            : [];

        const allCategories = categoryFilters.map(({ value }) => value);
        if (
            isOneCountrySelectedAndAllCategoriesSelected(
                countryFilter?.selected?.length,
                allCategories,
                selectedCategories
            )
        ) {
            const restCountries = countryFilter.options
                .map(c => c.id)
                .filter(cId => countryFilter?.selected && !countryFilter?.selected.includes(cId));
            return restCountries;
        }
        return [];
    }, [categoryFilters, countryFilter.options, countryFilter?.selected, selectedCategoriesWithSubcategoriesFilter]);

    return {
        filters: {
            country: {
                ...countryFilter,
                disabledCountries,
            },
            category: {
                options: categoryFilters,
                selected: selectedCategoriesWithSubcategoriesFilter,
                onSelectedChange: onChangeCategoryFilter,
                disabledCategories,
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
            references: row[index]?.references || "",
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

function getInitialDataByTable(
    initialDataByTable: PolicyExplorer | undefined,
    selectedCategoriesIds: string[]
): PolicyExplorer | undefined {
    if (!initialDataByTable || !selectedCategoriesIds.length) return undefined;
    const initialInvertedCategoriesIds = selectedCategoriesIds.filter(
        categoryId => !INITIAL_NORMAL_ORIENTED_TABLES.includes(categoryId)
    );

    return initialInvertedCategoriesIds.length
        ? invertDataOfCategoriesIds(initialDataByTable, initialInvertedCategoriesIds)
        : initialDataByTable;
}

function invertDataOfCategoriesIds(
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
                references: row[index]?.references || "",
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
            [categoryId]: INITIAL_NORMAL_ORIENTED_TABLES.includes(categoryId) ? "normal" : "inverted",
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

function isOneCountrySelectedAndAllCategoriesSelected(
    totalCountrySelected: number | undefined,
    allCategories: string[],
    selectedCategories: string[]
) {
    const areAllCategoriesSelected = allCategories.every(category => selectedCategories.includes(category));

    return totalCountrySelected && totalCountrySelected === 1 && areAllCategoriesSelected;
}
