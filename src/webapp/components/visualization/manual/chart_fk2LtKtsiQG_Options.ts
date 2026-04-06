import { getColorOfRegionByRegionId } from "../../../pages/regional-page/getColorOfRegion";
import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    qO6diSOTqhL: "Public spending on health as a share of GDP",
};

const seriesColors: Record<string, string> = {
    qO6diSOTqhL: "#00b050",
};

export const chart_fk2LtKtsiQG_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const chartSourceWithFilteredRows = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chart = comparativeColumnChartOptions({
        chartSource: chartSourceWithFilteredRows,
        seriesNames,
        seriesColors,
        currentSerieColor: currentRegion ? getColorOfRegionByRegionId(currentRegion.id) : "#c00000",
        useRegionColors: true,
    });

    return {
        ...chart,
        legend: {
            enabled: false,
        },
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: "GDP (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
