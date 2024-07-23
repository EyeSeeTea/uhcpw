import { AnalyticsResponse, createVisualization } from "@dhis2/analytics";
import Highcharts, { PointOptionsObject, SeriesColumnOptions } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useRef, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Country } from "../../../domain/entities/Country";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { ChartCustomization } from "./customization/types";
import { filterEmptyYearsInSeries, getCategories, getSeriesChart } from "./utils";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { addBreaksInSeries } from "./addBreaksInSeries";

export interface ChartPluginProps {
    analytics: Analytics[];
    visualization: Visualization;
    legendSets: LegendSet[];
    customizedOptions?: ChartCustomization;
    externalchartOptions?: Highcharts.Options;
    countries: Country[];
    withoutBackground?: boolean;
}

/**
 * ChartPlugin is a component ported with modifications from DataVisualizerApp
 * https://github.com/dhis2/data-visualizer-app/blob/dev/src/components/VisualizationPlugin/ChartPlugin.js
 */
export const ChartPlugin: React.FC<ChartPluginProps> = React.memo(
    ({
        analytics,
        visualization,
        legendSets,
        customizedOptions,
        countries,
        externalchartOptions,
        withoutBackground = false,
    }) => {
        const canvasRef = useRef<HTMLDivElement>(null);
        const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

        const renderWithAnaliticsAndCustomizations = useCallback(() => {
            const analyticsResponse: AnalyticsResponse[] = analytics.map(item => ({
                response: { ...item },
                ...item,
            }));

            const analyticsConfig = createVisualization(
                analyticsResponse,
                visualization,
                canvasRef.current,
                {
                    dashboard: false,
                    animation: 200,
                    legendSets: legendSets,
                    onToggleContextualMenu: undefined,
                },
                undefined,
                undefined,
                "highcharts"
            );

            const originalChartOptions = { ...analyticsConfig.visualization.options };

            const series = getSeriesChart(
                originalChartOptions.series,
                customizedOptions?.series,
                customizedOptions?.sortLegendByLastDataPoint,
                customizedOptions?.hideLegendIfNoData
            );

            const orderedByValueInSerie = customizedOptions?.sortSerieData
                ? customizedOptions?.sortSerieData(
                      series as SeriesColumnOptions[],
                      getCategories(originalChartOptions.xAxis)
                  )
                : series;

            const categoriesByOrderedByValueInSerie = customizedOptions?.sortSerieData
                ? (orderedByValueInSerie as SeriesColumnOptions[])[0]?.data?.map(
                      item => (item as PointOptionsObject).name || ""
                  )
                : undefined;

            const maxYAxis = visualization.axes.find(({ type }) => type === "RANGE")?.maxValue
                ? { max: visualization.axes.find(({ type }) => type === "RANGE")?.maxValue }
                : {};

            const newOptions = {
                chart: {
                    ...originalChartOptions.chart,
                    events: customizedOptions?.chart?.events ? { ...customizedOptions?.chart?.events } : undefined,
                    renderTo: undefined,
                },

                legend: {
                    ...originalChartOptions.legend,
                    ...customizedOptions?.legend,
                },
                title: { ...originalChartOptions.title, ...customizedOptions?.title },
                subtitle: { ...originalChartOptions.subtitle, ...customizedOptions?.subtitle },
                xAxis: Array.isArray(originalChartOptions.xAxis)
                    ? originalChartOptions.xAxis.map((item, index) => {
                          const countryXAxisCustomization = customizedOptions?.countryXAxis
                              ? customizedOptions?.countryXAxis(countries, { categories: item.categories || [] })
                              : undefined;

                          const customizedXAxis = Array.isArray(customizedOptions?.xAxis)
                              ? customizedOptions?.xAxis[index]
                              : customizedOptions?.xAxis;

                          const customization = countryXAxisCustomization || customizedXAxis;

                          return {
                              ...item,
                              ...customization,
                              categories:
                                  categoriesByOrderedByValueInSerie && categoriesByOrderedByValueInSerie.length > 0
                                      ? categoriesByOrderedByValueInSerie
                                      : item.categories,
                          };
                      })
                    : { ...originalChartOptions.xAxis, ...customizedOptions?.xAxis },

                yAxis: customizedOptions?.yAxis
                    ? Array.isArray(originalChartOptions.yAxis)
                        ? originalChartOptions.yAxis.map((item, index) => {
                              const customizedYAxis = Array.isArray(customizedOptions?.yAxis)
                                  ? customizedOptions?.yAxis[index]
                                  : customizedOptions?.yAxis;

                              return { ...item, ...customizedYAxis, ...maxYAxis };
                          })
                        : { ...originalChartOptions.yAxis, ...customizedOptions?.yAxis }
                    : originalChartOptions.yAxis,

                series: orderedByValueInSerie?.map(serie => {
                    const countrySerieCustomization = customizedOptions?.countrySerie
                        ? customizedOptions?.countrySerie(countries, { id: serie.id || "", name: serie.name || "" })
                        : undefined;

                    const serieCustomization = customizedOptions?.series?.find(
                        customSerie => serie.id === customSerie.id
                    );

                    const allSeriesCustomization = customizedOptions?.allSeries;

                    const customization = countrySerieCustomization || serieCustomization || allSeriesCustomization;

                    return customization ? { ...serie, ...customization } : serie;
                }),
                lang: originalChartOptions.lang,
                noData: originalChartOptions.noData,
                credits: { enabled: false },
                exporting: { enabled: false },
                plotOptions: {
                    series: {
                        grouping: false,
                    },
                },
            };

            // NOTICE: This filter is because there is a bug when calling createVisualization in a line country chart with at least two countries and the first one is empty.
            const newOptionsFilteredEmptyYears = customizedOptions?.countrySerie
                ? filterEmptyYearsInSeries(newOptions as Highcharts.Options)
                : newOptions;

            const newOptionsWithBreaks =
                visualization.breakInSeries && visualization.allowBreaksInSeries
                    ? addBreaksInSeries(
                          newOptionsFilteredEmptyYears as Highcharts.Options,
                          visualization.breakInSeries,
                          countries,
                          !!customizedOptions?.countrySerie
                      )
                    : newOptionsFilteredEmptyYears;

            setChartOptions({
                ...(newOptionsWithBreaks as Highcharts.Options),
            });
            analyticsConfig.visualization.destroy();
            canvasRef.current?.remove();
        }, [analytics, countries, customizedOptions, legendSets, visualization]);

        const renderFromExternalOptions = useCallback(() => {
            setChartOptions(externalchartOptions);

            canvasRef.current?.remove();
        }, [externalchartOptions]);

        const renderVisualization = useCallback(() => {
            if (externalchartOptions) {
                renderFromExternalOptions();
            } else {
                renderWithAnaliticsAndCustomizations();
            }
        }, [externalchartOptions, renderFromExternalOptions, renderWithAnaliticsAndCustomizations]);

        useEffect(() => {
            renderVisualization();
        }, [renderVisualization]);

        return (
            <div>
                <Container style={{ width: "100%" }} $withoutBackground={withoutBackground}>
                    <div ref={canvasRef} />
                    {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
                </Container>
            </div>
        );
    }
);

const customCss = css`
    .highcharts-grid-line {
        //opacity: 0;
    }

    .highcharts-axis-labels text {
        color: ${colors.chartContent} !important;
        fill: ${colors.chartContent} !important;
    }

    .highcharts-axis-title {
        color: ${colors.chartContent} !important;
        fill: ${colors.chartContent} !important;
    }
`;

const Container = styled.div<{ $withoutBackground: boolean }>`
    .highcharts-container * {
        font-family: "Roboto";
    }
    .highcharts-background {
        fill: ${props => (props.$withoutBackground ? "white" : "#f1f9fc")};
    }

    ${customCss}
`;
