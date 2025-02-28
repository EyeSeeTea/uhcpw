import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
    PolicyExplorer,
    PolicyExplorerCellType,
    DataOrientationByTable,
    latestAvailableYear,
} from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";

import i18n from "../../../locales";
import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { PolicyExplorerState } from "./PolicyExplorerState";
import { CategoryOption } from "../../components/policy-explorer/category-selector/CategorySelector";
import {
    PolicyExplorerCategory,
    PolicyExplorerSelectCategoryInfo,
} from "../../../domain/entities/policy-explorer/PolicyExplorerCategory";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";
import { BOSNIA_AND_HERZEGOVINA_LEVEL_4 } from "../../../data/repositories/countries/CountryD2Repository";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { AnalyticsEvent } from "../../../domain/entities/AnalyticsEvent";
import { Maybe } from "../../../types/utils";

const INITIAL_NORMAL_ORIENTED_TABLES = [
    CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
    ...Object.values(CATEGORY_BY_TYPE_OF_HEALTHCARE),
];

export const CATEGORIES_WITHOUT_SUBCATEGORIES = [
    CHANGES_IN_COVERAGE_POLICY_MERGED_CATEGORIES_ID,
    ...Object.values(CATEGORY_BY_TYPE_OF_HEALTHCARE),
];

const yearFilters: Option[] = [
    { value: "2023", text: "2023" },
    { value: "2024", text: "2024" },
    { value: latestAvailableYear, text: i18n.t("Latest avalaible year") },
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
    const { compositionRoot, countriesAndRegions } = useAppContext();
    const { sendEvent } = useAnalytics();

    const countryFilter = useMultiCountryOptionsV2({ selectedCountries: countriesFilter, showSubRegions: true });
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [policyExplorerCategories, setPolicyExplorerCategories] = useState<PolicyExplorerCategory[]>([]);
    const [categoryFilters, setCategoryFilters] = useState<CategoryOption[]>([]);
    const [selectCategoryInfo, setSelectCategoryInfo] = useState<PolicyExplorerSelectCategoryInfo | undefined>(
        undefined
    );
    const [selectedCategoriesWithSubcategoriesFilter, setSelectedCategoriesWithSubcategoriesFilter] = useState<
        Record<string, string[]> | undefined
    >();

    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>([latestAvailableYear]);

    const [initialDataByTable, setInitialDataByTable] = useState<PolicyExplorer | undefined>();
    const [dataByTable, setDataByTable] = useState<PolicyExplorer | undefined>();
    const [dataOrientationByTable, setDataOrientationByTable] = useState<DataOrientationByTable | undefined>();

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
        compositionRoot.policyExplorer.getCategories.execute().run(
            categories => {
                setPolicyExplorerCategories(categories);
                setCategoryFilters(buildCategoryFilterOptions(categories));
            },
            () => {
                setCategoryFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    useEffect(() => {
        compositionRoot.policyExplorer.getSelectCategoryInfo.execute().run(
            info => {
                setSelectCategoryInfo(info);
            },
            error => {
                setSelectCategoryInfo(undefined);
                setErrorMessage(error);
            }
        );
    }, [compositionRoot.policyExplorer]);

    const sendAnalyticsEvents = useCallback(() => {
        if (!selectedCategoriesWithSubcategoriesFilter || !countryFilter.selected || !selectedYearFilter) return;

        const categoriesIds = Object.keys(selectedCategoriesWithSubcategoriesFilter);
        const subcategoryIds = Object.values(selectedCategoriesWithSubcategoriesFilter).flat();

        const allCountriesSelected =
            countryFilter.selected?.length ===
            countriesAndRegions.filter(({ id }) => id !== BOSNIA_AND_HERZEGOVINA_LEVEL_4).length;

        const year = selectedYearFilter.sort().reverse()[0] ?? "(not set)";

        sendEvent({
            name: "policy_explorer_summary",
            numberOfCategories: categoriesIds.length,
            numberOfSubcategories: subcategoryIds.length,
            allCountriesSelected: allCountriesSelected,
            numberOfCountries: countryFilter.selected.length,
            year: year, // most recent year selected, but policy explorer as for now only accepts one year
        });

        const selectedCountriesNames = countryFilter.selected
            .map(countryId => countriesAndRegions.find(country => country.id === countryId)?.name)
            .filter((x): x is string => Boolean(x));

        const bulkEvents = generateBulkAnalyticsEvents({
            selectedCategoriesWithSubcategoriesFilter,
            policyExplorerCategories,
            allCountriesSelected,
            selectedCountriesNames,
            year,
        });

        /* GA4 has no way support for sending events in bulk, but maybe this "technology" info might suggest that should live only in "data" */
        bulkEvents.forEach(event => sendEvent(event));
    }, [
        countriesAndRegions,
        countryFilter.selected,
        policyExplorerCategories,
        selectedCategoriesWithSubcategoriesFilter,
        selectedYearFilter,
        sendEvent,
    ]);

    const onGetTable = useCallback(() => {
        if (
            selectedCategoriesWithSubcategoriesFilter &&
            Object.keys(selectedCategoriesWithSubcategoriesFilter)?.length &&
            countryFilter.selected?.length
        ) {
            compositionRoot.policyExplorer.get
                .execute(
                    selectedCategoriesWithSubcategoriesFilter,
                    countryFilter.selected,
                    selectedYearFilter ? selectedYearFilter : [],
                    countriesAndRegions,
                    policyExplorerCategories
                )
                .run(
                    policyExplorer => {
                        setInitialDataByTable(policyExplorer);

                        const categoriesIds = Object.keys(selectedCategoriesWithSubcategoriesFilter);
                        setDataByTable(getInitialDataByTable(policyExplorer, categoriesIds));
                        setDataOrientationByTable(getInitialDataOrientationByTable(categoriesIds));

                        sendAnalyticsEvents();
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
        selectedCategoriesWithSubcategoriesFilter,
        countryFilter.selected,
        compositionRoot.policyExplorer.get,
        selectedYearFilter,
        countriesAndRegions,
        policyExplorerCategories,
        sendAnalyticsEvents,
    ]);

    const onChangeCategoryFilter = useCallback((value: Record<string, string[]> | undefined) => {
        setSelectedCategoriesWithSubcategoriesFilter(value);
        if (!value) {
            setInitialDataByTable(undefined);
            setDataByTable(undefined);
            setDataOrientationByTable(undefined);
        }
    }, []);

    const onChangeYearFilter = useCallback(
        (value: string[] | undefined) => {
            if (value?.length && value?.length > 1) {
                const values = value.filter(value => !selectedYearFilter?.includes(value));
                setSelectedYearFilter(values);
            } else {
                setSelectedYearFilter(value);
            }
        },
        [selectedYearFilter]
    );

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

    const onDownload = useCallback(() => {
        if (!initialDataByTable || !selectedCategoriesWithSubcategoriesFilter) return;
        const categoriesIds = Object.keys(selectedCategoriesWithSubcategoriesFilter);
        const data = getInitialDataByTable(initialDataByTable, categoriesIds);
        if (!data) return;

        sendEvent({
            name: "file_download",
            pageTitle: "Policy Explorer",
            contentType: "csv",
            contentGroup: "policy",
            contentId: undefined,
        });
        compositionRoot.policyExplorer.download.execute(policyExplorerCategories, data).runAsync();
    }, [
        initialDataByTable,
        selectedCategoriesWithSubcategoriesFilter,
        sendEvent,
        compositionRoot.policyExplorer.download,
        policyExplorerCategories,
    ]);

    return {
        filters: {
            country: {
                ...countryFilter,
                disabledCountries: [BOSNIA_AND_HERZEGOVINA_LEVEL_4],
                showSubRegions: true,
                defaultExpandedCountries: [BOSNIA_AND_HERZEGOVINA_LEVEL_4],
            },
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
        selectCategoryInfo,
        errorMessage,
    };
}

function generateBulkAnalyticsEvents(args: {
    selectedCategoriesWithSubcategoriesFilter: Record<string, string[]>;
    policyExplorerCategories: PolicyExplorerCategory[];
    allCountriesSelected: boolean;
    selectedCountriesNames: string[];
    year: string;
}): AnalyticsEvent[] {
    const {
        selectedCategoriesWithSubcategoriesFilter,
        policyExplorerCategories,
        allCountriesSelected,
        selectedCountriesNames,
        year,
    } = args;

    return _(selectedCategoriesWithSubcategoriesFilter)
        .toPairs()
        .map(([key, value]): Maybe<[category: string, subcategories: string[]]> => {
            const category = policyExplorerCategories.find(category => category.id === key);
            if (!category) return undefined;

            const subcategories = category.subcategories
                .filter(subcategory => value.includes(subcategory.id))
                .map(subcategory => subcategory.name);

            return [
                category.name,
                value.length === category.subcategories.length ? ["All subcategories"] : subcategories,
            ];
        })
        .compact()
        .flatMap(
            ([category, subcategories]): Array<[category: string, subcategory: string]> =>
                subcategories.map(subcategory => [category, subcategory])
        )
        .flatMap(([category, subcategory]): Array<[category: string, subcategory: string, country: string]> => {
            if (allCountriesSelected) {
                return [[category, subcategory, "All countries and areas"]];
            } else {
                return selectedCountriesNames.map(country => [category, subcategory, country]);
            }
        })
        .map(
            ([category, subcategory, country]): AnalyticsEvent => ({
                name: "policy_explorer_category",
                category: category,
                subcategory: subcategory,
                country: country,
                year: year,
            })
        )
        .value();
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

function getInitialDataOrientationByTable(selectedCategoriesIds: string[]): DataOrientationByTable {
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
        description: category.description,
    }));
}
