import { isSingleValue, createVisualization } from "@dhis2/analytics";
import React, { useRef, useCallback, useEffect, CSSProperties } from "react";
import styled, { css } from "styled-components";
import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";

export interface ChartPluginProps {
    analytics: Analytics[];
    visualization: Visualization;
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
    ({ analytics, visualization, style, animation = 200, onToggleContextualMenu }) => {
        const canvasRef = useRef(null);
        const prevStyle = useRef(style);
        //const prevRenderCounter = useRef(undefined);

        const renderVisualization = useCallback(
            animation => {
                const analyticsResponse = analytics.map(item => ({
                    response: { ...item },
                    ...item,
                }));

                createVisualization(
                    analyticsResponse,
                    visualization,
                    canvasRef.current,
                    {
                        dashboard: false,
                        animation,
                        legendSets: [],
                        onToggleContextualMenu,
                    },
                    undefined,
                    undefined,
                    isSingleValue(visualization.type) ? "dhis" : "highcharts" // output format
                );

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
            [analytics, onToggleContextualMenu, visualization]
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

        return <Container ref={canvasRef} style={style} />;
    }
);

const customCss = css`
    .highcharts-grid-line {
        opacity: 0;
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
