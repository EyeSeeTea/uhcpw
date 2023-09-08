import { createVisualization } from "@dhis2/analytics";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useRef, useCallback, useEffect, CSSProperties, useState } from "react";
import styled, { css } from "styled-components";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";

export interface ChartPluginProps {
    analytics: Analytics[];
    visualization: Visualization;
    legendSets: LegendSet[];
    periods?: string[];
    style?: CSSProperties;
    onChartGenerated?: (visualization: any) => void;
    animation?: number;
    onToggleContextualMenu?: unknown;
}

/**
 * ChartPlugin is a component ported with modifications from DataVisualizerApp
 * https://github.com/dhis2/data-visualizer-app/blob/dev/src/components/VisualizationPlugin/ChartPlugin.js
 */
export const ChartPlugin: React.FC<ChartPluginProps> = React.memo(
    ({ analytics, visualization, legendSets, style, animation = 200 }) => {
        const canvasRef = useRef<HTMLDivElement>(null);
        const prevStyle = useRef(style);
        const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

        const renderVisualization = useCallback(
            animation => {
                const analyticsResponse = analytics.map(item => ({
                    response: { ...item },
                    ...item,
                }));

                const analyticsConfig = createVisualization(
                    analyticsResponse,
                    visualization,
                    canvasRef.current,
                    {
                        dashboard: false,
                        animation,
                        legendSets: legendSets,
                        onToggleContextualMenu: undefined,
                    },
                    undefined,
                    undefined,
                    "highcharts"
                );

                const originalChartOptions = { ...analyticsConfig.visualization.options };

                const newOptions = {
                    chart: { ...originalChartOptions.chart, events: undefined, renderTo: undefined },
                    legend: {
                        enabled: true,
                        align: "right",
                        verticalAlign: "middle",
                        layout: "vertical",
                    },
                    title: originalChartOptions.title,
                    subtitle: originalChartOptions.subtitle,
                    xAxis: originalChartOptions.xAxis,
                    yAxis: originalChartOptions.yAxis,
                    series: originalChartOptions.series,
                    lang: originalChartOptions.lang,
                    noData: originalChartOptions.noData,
                    credits: { enabled: false },
                    exporting: { enabled: false },
                };

                analyticsConfig.visualization.update({
                    legend: {
                        enabled: true,
                        align: "right",
                        verticalAlign: "middle",
                        layout: "vertical",
                    },
                    series: newOptions.series?.map(serie => ({ ...serie, color: "lightblue" })),
                });

                // TODO: This is a workaround, if to update chart we have problems
                setChartOptions({
                    ...newOptions,
                    series: newOptions.series?.map(serie => ({ ...serie, color: "lightblue" })),
                } as Highcharts.Options);
                //analyticsConfig.visualization.destroy();
                //canvasRef.current?.remove();

                // if (onChartGenerated) {
                //     if (isSingleValue(visualization.type)) {
                //         onChartGenerated(visualizationConfig.visualization);
                //     } else {
                //         onChartGenerated(
                //             visualizationConfig.visualization.getSVGForExport({
                //                 sourceHeight: 768,
                //                 sourceWidth: 1024,
                //             })
                //         );
                //     }
                // }
            },
            [analytics, legendSets, visualization]
        );

        useEffect(() => {
            renderVisualization(animation);
        }, [animation, renderVisualization]);

        // useEffect(() => {
        //     if (renderCounter !== prevRenderCounter.current) {
        //         renderVisualization(0);
        //         prevRenderCounter.current = renderCounter;
        //     }

        //     /* eslint-disable-next-line react-hooks/exhaustive-deps */
        // }, [renderCounter]);

        useEffect(() => {
            if (style?.width !== prevStyle.current?.width || style?.height !== prevStyle.current?.height) {
                renderVisualization(0);
                prevStyle.current = style;
            }

            /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, [style]);

        return (
            <div>
                <div ref={canvasRef} style={style} />
                <Container style={{ width: "100%", marginTop: "100px" }}>
                    <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Container>
            </div>
        );
    }
);

const customCss = css`
    .highcharts-grid-line {
        //opacity: 0;
    }
`;

const Container = styled.div`
    .highcharts-container * {
        font-family: "Roboto";
    }
    .highcharts-background {
        //fill: #f1f9fc;
    }

    ${customCss}
`;
