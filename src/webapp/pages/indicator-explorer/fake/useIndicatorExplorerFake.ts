import { useCallback, useState } from "react";
import { Option } from "../../../components/dropdown/Option";
import { IndicatorExplorerFakeState } from "./IndicatorExplorerFakeState";
import React from "react";
import { useMultiCountryOptionsFake } from "../../../common/hooks/countries/useMultiCountryOptionsFake";
import { categoriesConfig, CategoryConfig } from "./categoriesConfig";

type DialogInfoType = {
    title?: string;
    infoNotes: string[];
    sourceName: string;
    sourceLink: string;
};

export function useIndicatorExplorerFake(): IndicatorExplorerFakeState {
    const countryFilter = useMultiCountryOptionsFake(undefined, ["DVnpk4xiXGJ", "AjeCGGb8H76", "KwgjnBBpe5b"], 1);

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [chartImage, setChartImage] = useState<string | undefined>();
    const [chartNotes, setChartNotes] = useState<DialogInfoType>();

    const [categoryConfig, setCategoryConfig] = useState<CategoryConfig | undefined>();

    React.useEffect(() => {
        const categoryOptions = Object.keys(categoriesConfig).map(key => ({ value: key, text: key }));

        setCategoryFilters(categoryOptions);
    }, []);

    React.useEffect(() => {
        if (categoryConfig?.metadata.filterByCountry && countryFilter.selected?.length === 0) {
            setChartImage(undefined);
        }
    }, [categoryConfig?.metadata.filterByCountry, countryFilter]);

    const onChangeCategoryFilter = useCallback(
        (value: string | undefined) => {
            setSelectedCategoryFilter(value);

            if (value) {
                setCategoryConfig(categoriesConfig[value]);
            } else {
                setCategoryConfig(undefined);
            }

            countryFilter.onSelectedChange([]);
            setChartImage(undefined);
        },
        [countryFilter]
    );

    const onGetChart = useCallback(() => {
        if (selectedCategoryFilter) {
            if (categoryConfig?.metadata.filterByCountry) {
                const categoryCharts = categoryConfig?.data || [];

                const countryChart = categoryCharts.filter(
                    chart => countryFilter.selected && countryFilter.selected.includes(chart.countryId || "")
                );

                setChartImage(countryChart[0]?.image || undefined);
                setChartNotes(countryChart[0]?.dialogInfo || undefined);
            } else {
                const categoryCharts = categoryConfig?.data || [];

                setChartImage(categoryCharts[0]?.image || undefined);
                setChartNotes(categoryCharts[0]?.dialogInfo || undefined);
            }
        }
    }, [
        categoryConfig?.data,
        categoryConfig?.metadata.filterByCountry,
        countryFilter.selected,
        selectedCategoryFilter,
    ]);

    return {
        filters: {
            country: { ...countryFilter, visible: categoryConfig?.metadata.filterByCountry || false },
            category: {
                options: categoryFilters,
                selected: selectedCategoryFilter,
                onSelectedChange: onChangeCategoryFilter,
            },
        },
        chartName: categoryConfig?.metadata.chartName || "",
        chartImage,
        dialogInfo: chartNotes,
        onGetChart,
    };
}
