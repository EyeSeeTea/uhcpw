import { useCallback, useEffect, useState } from "react";
import { PolicyExplorer } from "../../../domain/entities/policy-explorer/PolicyExplorer";
import { Option } from "../../components/dropdown/Option";
import { useAppContext } from "../../contexts/app-context";

import { useMultiCountryOptionsV2 } from "../../common/hooks/countries/useMultiCountryOptionsV2";
import { DataOrientation, PolicyExplorerState } from "./PolicyExplorerState";

export function usePolicyExplorer(): PolicyExplorerState {
    const { compositionRoot } = useAppContext();
    const countryFilter = useMultiCountryOptionsV2();

    const [categoryFilters, setCategoryFilters] = useState<Option<string>[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [yearFilters, setYearsFilters] = useState<Option[]>([]);
    const [selectedYearFilter, setSelectedYearFilter] = useState<string[] | undefined>();

    const [initialData, setInitialData] = useState<PolicyExplorer | undefined>({ rows: [] });
    const [data, setData] = useState<PolicyExplorer | undefined>(initialData);
    const [dataOrientation, setDataOrientation] = useState<DataOrientation>("normal");

    useEffect(() => {
        setData(dataOrientation === "inverted" ? invertData(initialData) : initialData);
    }, [dataOrientation, initialData]);

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
                .execute(
                    selectedCategoryFilter,
                    countryFilter.selected || [],
                    selectedYearFilter ? selectedYearFilter : []
                )
                .run(
                    policyExplorer => {
                        setInitialData(policyExplorer);
                        setDataOrientation("inverted");
                    },
                    () => {
                        setInitialData(undefined);
                    }
                );
        } else {
            setInitialData(undefined);
            setData(undefined);
        }
    }, [compositionRoot.policyExplorer, selectedCategoryFilter, countryFilter.selected, selectedYearFilter]);

    const onChangeCategoryFilter = useCallback((value: string | undefined) => {
        setSelectedCategoryFilter(value);
    }, []);

    const onChangeYearFilter = useCallback((value: string[] | undefined) => {
        setSelectedYearFilter(value);
    }, []);

    const onSwitchRowColumn = useCallback(() => {
        setDataOrientation(dataOrientation === "normal" ? "inverted" : "normal");
    }, [dataOrientation]);

    const onDownload = useCallback(() => {
        if (!data) return;

        compositionRoot.policyExplorer.download.execute(data).runAsync();
    }, [compositionRoot.policyExplorer, data]);

    return {
        filters: {
            country: countryFilter,
            category: {
                options: categoryFilters,
                selected: selectedCategoryFilter,
                onSelectedChange: onChangeCategoryFilter,
            },
            year: {
                options: yearFilters,
                selected: selectedYearFilter,
                onSelectedChange: onChangeYearFilter,
            },
        },
        data,
        dataOrientation,
        onSwitchRowColumn,
        onDownload,
    };
}

function invertData(initialData: PolicyExplorer | undefined): PolicyExplorer | undefined {
    if (!initialData) return undefined;

    const columns = [...initialData.rows].shift() || [];

    const newRows = columns.map((_, index) => {
        const cells = initialData.rows.map(row => row[index] || "");

        return [...cells];
    });

    const newData = {
        rows: newRows,
    };

    return newData;
}
