import { useCallback, useState } from "react";
import { Option } from "../../../components/dropdown/Option";
import { IndicatorExplorerFakeState } from "./IndicatorExplorerFakeState";
import React from "react";
import { useMultiCountryOptionsFake } from "../../../common/hooks/countries/useMultiCountryOptionsFake";

export function useIndicatorExplorerFake(): IndicatorExplorerFakeState {
    const countryFilter = useMultiCountryOptionsFake(undefined, ["DVnpk4xiXGJ", "AjeCGGb8H76", "KwgjnBBpe5b"]);

    const [categoryFilters, setCategoryFilters] = useState<Option[]>([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>();

    const [chartImage, setChartImage] = useState<string | undefined>();

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
            } else {
                const categoryCharts = categoryConfig?.data || [];

                setChartImage(categoryCharts[0]?.image || undefined);
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
        onGetChart,
    };
}

/**
 * ESP = DVnpk4xiXGJ
 * BUL = AjeCGGb8H76
 * BEL = KwgjnBBpe5b
 */

type CategoryConfig = {
    metadata: { filterByCountry: boolean; chartName: string };
    data: ChartData[];
};

type ChartData = {
    countryId?: string;
    image: string;
};

const categoriesConfig: Record<string, CategoryConfig> = {
    "Financial Hardship: Households with catastrophic health spending by consumption quintile": {
        metadata: {
            filterByCountry: true,
            chartName: "Households with catastrophic health spending by consumption quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.highcharts.com%2Fforum%2Fviewtopic.php%3Ft%3D30042&psig=AOvVaw2IlYDDR1LCgSMxUCeghk2X&ust=1686049947503000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCIDOl9P_q_8CFQAAAAAdAAAAABAb",
            },
            {
                countryId: "AjeCGGb8H76",
                image: "https://phppot.com/wp-content/uploads/2017/02/highcharts-compare-data-using-column-chart.png",
            },
            {
                countryId: "KwgjnBBpe5b",
                image: "https://static.packt-cdn.com/products/9781783983964/graphics/3964OS_02_06.jpg",
            },
        ],
    },
    "Comparative charts: Households with catastrophic health spending, 2019 or latest available year before COVID-19": {
        metadata: {
            filterByCountry: false,
            chartName: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
        },
        data: [
            {
                image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.highcharts.com%2Fdemo&psig=AOvVaw2IlYDDR1LCgSMxUCeghk2X&ust=1686049947503000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCIDOl9P_q_8CFQAAAAAdAAAAABAt",
            },
        ],
    },
};
