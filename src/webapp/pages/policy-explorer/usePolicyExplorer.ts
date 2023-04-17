import { useCallback, useEffect, useState } from "react";
import { PolicyExplorer } from "../../../domain/entities/PolicyExplorer";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";
import { useMultiCountryOptions } from "../../hooks/countries/useMultiCountryOptions";
import { PolicyExplorerState } from "./PolicyExplorerState";

export function usePolicyExplorer(): PolicyExplorerState {
    const { compositionRoot } = useAppContext();
    const { countryOptions, selectedCountry, onCountryChange } = useMultiCountryOptions();

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string | undefined>();

    const [initialData, setInitialData] = useState<PolicyExplorer | undefined>({ columns: [], rows: [] });
    const [data, setData] = useState<PolicyExplorer | undefined>(initialData);

    useEffect(() => {
        compositionRoot.policyExplorer.getYears.execute().run(
            years => {
                setYearsFilters(years.map(year => ({ value: year.id, text: year.id })));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    useEffect(() => {
        compositionRoot.policyExplorer.getCategories.execute().run(
            categories => {
                setCategoryFilters(categories.map(category => ({ value: category.id, text: category.name })));
            },
            () => {
                setYearsFilters([]);
            }
        );
    }, [compositionRoot.policyExplorer]);

    useEffect(() => {
        if (selectedCategoryFilter) {
            compositionRoot.policyExplorer.get
                .execute(selectedCategoryFilter, selectedCountry || [], selectedYearFilter ? [selectedYearFilter] : [])
                .run(
                    policyExplorer => {
                        setInitialData(policyExplorer);
                        setData(policyExplorer);
                    },
                    () => {
                        setInitialData(undefined);
                        setData(undefined);
                    }
                );
        } else {
            setInitialData(undefined);
            setData(undefined);
        }
    }, [compositionRoot.policyExplorer, selectedCategoryFilter, selectedCountry, selectedYearFilter]);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    const onSwitchRowColumn = useCallback(() => {
        if (!data || !initialData) return;

        if (data.columns.toString() === initialData.columns.toString()) {
            const newRows = data.columns.map((column, index) => {
                const cells = data.rows.map(row => row[index] || "");

                return [column, ...cells];
            });

            const newData = {
                columns: [],
                rows: newRows,
            };

            setData(newData);
        } else {
            setData(initialData);
        }
    }, [data, initialData]);

    return {
        filters: {
            countryFilters: countryOptions,
            selectedCountryFilter: selectedCountry,
            onChangeCountryFilter: onCountryChange,
            categoryFilters,
            selectedCategoryFilter,
            onChangeCategoryFilter,
            yearFilters,
            selectedYearFilter,
            onChangeYearFilter,
        },
        data,
        onSwitchRowColumn,
    };
}
