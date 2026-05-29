import { MARKER_RADIUS } from "../customization/chartConstants";
import { baseLegend } from "../customization/legends/baseLegend";
import { ChartSource } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";
import { mapToWhoCountryCode } from "../../../../data/repositories/countries/mapToWhoCountryData";
import { Id } from "../../../../domain/entities/Ref";
import { filterRowsByCommonLastAvailableYearInTwoDataIds } from "../../../../data/repositories/indicator-explorer/utils/lastAvailableYearHelpers";
import {
    buildXAxisCategories,
    splitColumnRowsBy99,
    splitScatterRows,
} from "../../../../data/export/data-chart-builder/chart_IXF2wBMnwpa_helpers";

const POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE = "TKq3zGVr1vj";
const POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT = "BAuD3jhIXTY";

const seriesNames: Record<string, string> = {
    CGk1OOt70Dz_residence: "Population covered (residence)",
    CGk1OOt70Dz_payment: "Population covered (payment of contributions)",
    WmOGqGcov4f: "Households with catastrophic health spending",
};

const seriesColors: Record<string, string> = {
    CGk1OOt70Dz_residence: "#0070c0",
    CGk1OOt70Dz_payment: "#c00000",
    WmOGqGcov4f: "#ffffff",
};

export const chart_IXF2wBMnwpa_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = {
        ...chartSource,
        analyticsResponse: {
            ...chartSource.analyticsResponse,
            rows: filterRowsByCommonLastAvailableYearInTwoDataIds({
                rows: chartSource.analyticsResponse.rows,
                dataId1: "CGk1OOt70Dz",
                dataId2: "WmOGqGcov4f",
                isUpTo2019: chartSource.isLatestCOVID19 || false,
                maxYearToFilterBy: chartSource.maxYearToFilterBy,
            }),
        },
    };

    const scatterRows = chartSourceWithFilteredRowsByLAY.analyticsResponse.rows.filter(row => row[0] === "WmOGqGcov4f");

    const columnRows = getColumnRows(chartSourceWithFilteredRowsByLAY);

    const { columnRowsLowerThan99, columnRowsGreaterOrEqual99 } = splitColumnRowsBy99(columnRows);

    const { scatterLowerThan99, scatterGreaterOrEqual99 } = splitScatterRows({
        scatterRows,
        columnRowsLowerThan99,
        columnRowsGreaterOrEqual99,
    });

    const categories = buildXAxisCategories({
        scatterLowerThan99,
        columnRowsLowerThan99,
        scatterGreaterOrEqual99,
        columnRowsGreaterOrEqual99,
    });

    const separatorIndex = categories.findIndex(category => category === null);
    const hasLower = columnRowsLowerThan99.length > 0;
    const hasGreater = columnRowsGreaterOrEqual99.length > 0;

    const hasGap = hasLower && hasGreater;

    const singleTitleText =
        hasGreater && !hasLower
            ? "Population coverage > 99%"
            : !hasGreater && hasLower
            ? "Population coverage < 99%"
            : "";

    const series = [
        {
            id: "CGk1OOt70Dz_residence",
            type: "column",
            name: seriesNames.CGk1OOt70Dz_residence,
            color: seriesColors.CGk1OOt70Dz_residence,
            data: buildSeriesData({
                chartSource: chartSource,
                categories: categories,
                rows: [...columnRowsGreaterOrEqual99, ...columnRowsLowerThan99],
                dataElementId: POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE,
            }),
        },
        {
            id: "CGk1OOt70Dz_payment",
            type: "column",
            name: seriesNames.CGk1OOt70Dz_payment,
            color: seriesColors.CGk1OOt70Dz_payment,
            data: buildSeriesData({
                chartSource: chartSource,
                categories: categories,
                rows: [...columnRowsGreaterOrEqual99, ...columnRowsLowerThan99],
                dataElementId: POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT,
            }),
        },
        {
            id: "WmOGqGcov4f",
            type: "scatter",
            name: seriesNames.WmOGqGcov4f,
            color: seriesColors.WmOGqGcov4f,
            yAxis: 1,
            data: buildSeriesData({
                chartSource: chartSource,
                categories: categories,
                rows: [...scatterGreaterOrEqual99, ...scatterLowerThan99],
            }),
        },
    ];

    return {
        ...baseChartOptions,
        title: hasGap
            ? { text: null }
            : {
                  text: singleTitleText,
                  align: "center",
                  style: { fontSize: "13px" },
              },
        xAxis: {
            categories: categories.map(category => {
                if (!category) return "";

                const [countryId = "", year = ""] = category.split("-");

                const countryLabel = countryId
                    ? mapToWhoCountryCode(chartSource.analyticsResponse.metaData.items[countryId]?.code || "")
                    : countryId;
                return `${countryLabel} ${year}`;
            }),
            labels: {
                rotation: -90,
            },
        },
        yAxis: [
            {
                title: {
                    text: "Population covered (%)",
                    style: { fontSize: "13px" },
                },
                max: 100,
                min: 0,
            },
            {
                min: 0,
                title: {
                    text: "Households with catastrophic health spending (%)",
                    style: { fontSize: "13px" },
                    rotation: 270,
                    x: 15,
                },
                opposite: true,
            },
        ],
        legend: {
            ...baseLegend,
            width: 250,
            itemStyle: { ...baseLegend.itemStyle, whiteSpace: "normal", textOverflow: "none" },
        },
        series: series,
        plotOptions: {
            column: {
                grouping: false,
            },
            scatter: {
                marker: {
                    symbol: "circle",
                    radius: MARKER_RADIUS,
                    lineWidth: 0.5,
                    lineColor: "#666",
                },
            },
        },
        chart: {
            marginTop: 30,
            events: {
                render: function (this: Highcharts.Chart & { customTitlesGroup?: Highcharts.SVGElement }) {
                    if (!hasGap) {
                        this.customTitlesGroup?.destroy();

                        const centerX = this.plotLeft + this.plotWidth / 2;
                        this.title?.attr({ x: centerX });

                        return;
                    }

                    if (!this.customTitlesGroup) {
                        this.customTitlesGroup = this.renderer.g("custom-titles").add();
                    } else {
                        this.customTitlesGroup.destroy();
                        this.customTitlesGroup = this.renderer.g("custom-titles").add();
                    }

                    const firstRight = separatorIndex + 1;
                    const lastRight = categories.length - 1;
                    const firstLeft = 0;
                    const lastLeft = separatorIndex - 1;

                    const getBarBounds = (catIndex: number): [number, number] | null => {
                        for (const s of this.series) {
                            if (s.type !== "column") continue;
                            const p = s.points && s.points[catIndex];
                            if (p && p.shapeArgs) {
                                const left = this.plotLeft + p.shapeArgs.x;
                                const right = left + p.shapeArgs.width;
                                return [left, right];
                            }
                        }
                        return null;
                    };

                    const leftFirstBounds = getBarBounds(firstLeft);
                    const leftLastBounds = getBarBounds(lastLeft);
                    const rightFirstBounds = getBarBounds(firstRight);
                    const rightLastBounds = getBarBounds(lastRight);

                    if (!leftFirstBounds || !leftLastBounds || !rightFirstBounds || !rightLastBounds) return;

                    const leftGroupLeft = leftFirstBounds[0];
                    const leftGroupRight = leftLastBounds[1];

                    const rightGroupLeft = rightFirstBounds[0];
                    const rightGroupRight = rightLastBounds[1];

                    const centerLeft = (leftGroupLeft + leftGroupRight) / 2;
                    const centerRight = (rightGroupLeft + rightGroupRight) / 2;

                    const y = Math.max(12, this.plotTop - 20);

                    this.renderer
                        .text("Population coverage > 99%", centerLeft, y)
                        .attr({ align: "center" })
                        .css({ fontSize: "13px", color: "#000" })
                        .add(this.customTitlesGroup);

                    this.renderer
                        .text("Population coverage < 99%", centerRight, y)
                        .attr({ align: "center" })
                        .css({ fontSize: "13px", color: "#000" })
                        .add(this.customTitlesGroup);
                },
            },
        },
        tooltip: {
            useHTML: false,
            headerFormat: "{point.key}<br/>",
            pointFormat: "{series.name}: <b>{point.y} %</b>",
        },
    } as Highcharts.Options;
};

function getColumnRows(chartSource: ChartSource): Array<string[]> {
    return chartSource.analyticsResponse.rows.filter(row => {
        if (row[0] !== "CGk1OOt70Dz") return false;

        const countryId = row[1];
        const year = row[2];

        const relevantElementsForRow = (chartSource.policyExplorerChartData || [])
            .filter(item => item.country === countryId && item.period === year && item.value === true)
            .map(item => item.dataElement);

        const hasResidenceForRow = relevantElementsForRow.includes(POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_RESIDENCE);
        const hasPaymentForRow = relevantElementsForRow.includes(POPULATION_COVERAGE_BASIS_FOR_ENTITLEMENT_PAYMENT);

        return hasResidenceForRow || hasPaymentForRow;
    });
}

function buildSeriesData(params: {
    chartSource: ChartSource;
    categories: Array<string | null>;
    rows: Array<string[]>;
    dataElementId?: Id;
}): Array<{ name: string; y: number | null } | null> {
    const { categories, chartSource, dataElementId, rows } = params;

    return categories.map(category => {
        if (!category) return null;

        const [countryId = "", year = ""] = category.split("-");

        const row = rows.find(row => {
            return row[1] === countryId && row[2] === year;
        });

        const yearLabel = row ? row[2] || "" : "";
        const value = row ? (row[3] ? +row[3] : 0) : 0;

        const countryLabel = countryId
            ? mapToWhoCountryCode(chartSource.analyticsResponse.metaData.items[countryId]?.code || "")
            : countryId;

        const relevantElements = dataElementId
            ? (chartSource.policyExplorerChartData || [])
                  .filter(item => item.country === countryId && item.period === year && item.value === true)
                  .map(item => item.dataElement)
            : [];

        const valueY = dataElementId ? (relevantElements.includes(dataElementId) ? value : null) : value;

        return {
            name: `${countryLabel} ${yearLabel}`,
            y: valueY,
        };
    });
}
