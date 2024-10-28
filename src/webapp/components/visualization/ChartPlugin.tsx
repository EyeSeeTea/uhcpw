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
    visualizations: Visualization[];
    legendSets: LegendSet[];
    customizedOptions?: ChartCustomization;
    externalchartOptions?: Highcharts.Options;
    countries: Country[];
    withoutBackground?: boolean;
    isSquareChart?: boolean;
}

/**
 * ChartPlugin is a component ported with modifications from DataVisualizerApp
 * https://github.com/dhis2/data-visualizer-app/blob/dev/src/components/VisualizationPlugin/ChartPlugin.js
 */
export const ChartPlugin: React.FC<ChartPluginProps> = React.memo(
    ({
        analytics,
        visualizations,
        legendSets,
        customizedOptions,
        countries,
        externalchartOptions,
        withoutBackground = false,
        isSquareChart = false,
    }) => {
        const canvasRef = useRef<HTMLDivElement>(null);
        const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

        const renderWithAnaliticsAndCustomizations = useCallback(() => {
            const analyticsResponse: AnalyticsResponse[] = analytics.map(item => ({
                response: { ...item },
                ...item,
            }));
            const visualization = visualizations[0];
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

            const maxYAxis = visualization?.axes.find(({ type }) => type === "RANGE")?.maxValue
                ? { max: visualization?.axes.find(({ type }) => type === "RANGE")?.maxValue }
                : {};

            const xAxis = Array.isArray(originalChartOptions.xAxis)
                ? originalChartOptions.xAxis.map((item, index) => {
                      const countryXAxisCustomization = customizedOptions?.countryXAxis
                          ? customizedOptions?.countryXAxis(countries, { categories: item.categories || [] })
                          : undefined;

                      const customizedXAxis = Array.isArray(customizedOptions?.xAxis)
                          ? customizedOptions?.xAxis[index]
                          : customizedOptions?.xAxis;

                      const customization = countryXAxisCustomization || customizedXAxis;

                      const categories =
                          categoriesByOrderedByValueInSerie &&
                          categoriesByOrderedByValueInSerie.length > 0 &&
                          !item.opposite
                              ? categoriesByOrderedByValueInSerie
                              : item.categories;

                      return {
                          ...item,
                          ...customization,
                          categories:
                              customizedOptions?.renameCategoriesXAxis && categories
                                  ? customizedOptions?.renameCategoriesXAxis(categories)
                                  : categories,
                      };
                  })
                : { ...originalChartOptions.xAxis, ...customizedOptions?.xAxis };

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
                xAxis: xAxis,
                yAxis:
                    customizedOptions?.yAxis || customizedOptions?.currencyOfCountryYAxis
                        ? Array.isArray(originalChartOptions.yAxis)
                            ? originalChartOptions.yAxis.map((item, index) => {
                                  const customizedYAxis = Array.isArray(customizedOptions?.yAxis)
                                      ? customizedOptions?.yAxis[index]
                                      : customizedOptions?.yAxis || {};

                                  const currencyYAxis =
                                      customizedOptions?.currencyOfCountryYAxis && countries[0]?.currencyCode
                                          ? customizedOptions?.currencyOfCountryYAxis(countries[0]?.currencyCode)
                                          : {};

                                  return { ...item, ...customizedYAxis, ...maxYAxis, ...currencyYAxis };
                              })
                            : { ...originalChartOptions.yAxis, ...(customizedOptions?.yAxis || {}) }
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
                plotOptions: customizedOptions?.plotOptions
                    ? { ...customizedOptions?.plotOptions }
                    : {
                          series: {
                              grouping: false,
                          },
                      },
            };

            // NOTICE: This filter is because there is a bug when calling createVisualization in a line country chart with at least two countries and the first one is empty.
            const newOptionsFilteredEmptyYears =
                customizedOptions?.countrySerie ||
                (visualization?.hideEmptyRowItems === "ALL" && customizedOptions?.fixHideEmptyCategories)
                    ? filterEmptyYearsInSeries(newOptions as Highcharts.Options)
                    : newOptions;

            const newOptionsWithBreaks =
                visualization?.breakInSeries && visualization?.allowBreaksInSeries
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
        }, [analytics, countries, customizedOptions, legendSets, visualizations]);

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
            <ChartPluginContainer $isSquareChart={isSquareChart}>
                <Container $withoutBackground={withoutBackground} $isSquareChart={isSquareChart}>
                    <div ref={canvasRef} />
                    {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
                </Container>
            </ChartPluginContainer>
        );
    }
);

const ChartPluginContainer = styled.div<{
    $isSquareChart: boolean;
}>`
    display: ${props => (props.$isSquareChart ? "flex" : "block")};
    justify-content: ${props => (props.$isSquareChart ? "center" : "flex-start")};
`;

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

const Container = styled.div<{ $withoutBackground: boolean; $isSquareChart?: boolean }>`
    width: ${props => (props.$isSquareChart ? "75%" : "100%")};

    .highcharts-container * {
        font-family: "Roboto";
    }
    .highcharts-background {
        fill: ${props => (props.$withoutBackground ? "white" : "#f1f9fc")};
    }

    ${customCss}
`;
