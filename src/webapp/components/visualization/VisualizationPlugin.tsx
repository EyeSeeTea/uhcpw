import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { ChartPlugin } from "./ChartPlugin";
import { useChartData } from "./useChartData";

interface VisualizationPluginProps {
    visualizationId: string;
    years: string[];
    countries: string[];
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(
    ({ visualizationId, years, countries }) => {
        const chartData = useChartData(visualizationId, years, countries);

        return chartData.kind === "Loaded" && chartData.analytics.rows.length > 0 ? (
            <ChartPlugin
                analytics={[chartData.analytics]}
                visualization={chartData.visualization}
                legendSets={chartData.legendSets}
            />
        ) : // <Chart visualization={chartData.visualization} analytics={chartData.analytics} />
        chartData.kind === "Loaded" && chartData.analytics.rows.length === 0 ? (
            <Center>
                <Typography variant="subtitle1">{i18n.t("There may be no data")}</Typography>
            </Center>
        ) : chartData.kind === "Error" ? (
            <Center>
                <Typography variant="subtitle1">{chartData.message}</Typography>
            </Center>
        ) : (
            <Center>
                <CircularProgress />
            </Center>
        );
    }
);

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
