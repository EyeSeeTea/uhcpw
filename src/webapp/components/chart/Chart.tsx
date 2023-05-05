import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import _ from "lodash";
import styled from "styled-components";
import { Box, Button, Typography } from "@material-ui/core";
import i18n from "../../../locales";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { Visualization } from "../../../domain/entities/Visualization";
import { Analytics } from "../../../domain/entities/Analytics";

interface ChartProps {
    visualization: Visualization;
    analytics: Analytics;
}

const orders: Record<string, number> = {
    Richest: 1,
    "4th": 2,
    "3rd": 3,
    "2nd": 4,
    Poorest: 5,
};

const colors: Record<string, string> = {
    Richest: "#DCEDF9",
    "4th": "#C2E3F5",
    "3rd": "#79C3E8",
    "2nd": "#018bd6",
    Poorest: "#0360A6",
};

export const Chart: React.FC<ChartProps> = React.memo(({ visualization, analytics }) => {
    const chartData = useMemo(() => {
        const rawData = analytics.rows.map(row => {
            const serieId = row[0] || "";

            const serieName = serieId ? analytics.metaData.items[serieId]?.name || "" : "";

            return { serie: serieName, category: row[1] || "", value: row[2] || "" };
        });

        const dataGroups = _(rawData)
            .groupBy(item => item.serie)
            .value();

        const series = _(
            Object.keys(dataGroups).map(group => {
                const data = _(dataGroups[group] || [])
                    .orderBy("category", "asc")
                    .map(({ value }) => +value)
                    .value();

                return {
                    type: "column",
                    name: group,
                    color: colors[group] || "000",
                    data,
                };
            })
        )
            .sortBy(serie => orders[serie.name])
            .value();

        return { series, categories: _.uniq(rawData.map(({ category }) => category)) };
    }, []);

    return (
        <ChartContainer>
            <DataHeader>
                <Row>
                    <Row>
                        <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                            {visualization.name}
                        </Typography>
                        <Button>
                            <InfoIcon color="primary" />
                        </Button>
                    </Row>
                    <Row>
                        <CustomButton
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            color="primary"
                            style={{ marginLeft: 20 }}
                        >
                            {i18n.t("Download")}
                        </CustomButton>
                    </Row>
                </Row>
            </DataHeader>
            <Row>
                <div style={{ width: "100%" }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions(chartData.categories, chartData.series)}
                    />
                </div>

                <Column>
                    {Object.keys(colors).map(legend => {
                        return (
                            <Row key={legend} justifyContent={"start"} marginBottom={"8px"}>
                                <Box width={15} height={15} bgcolor={colors[legend]} borderColor={"red"} />
                                <Box width={5} />
                                <Typography variant="caption">{legend}</Typography>
                            </Row>
                        );
                    })}
                    <br />
                    <span>
                        <CreditsText variant="caption">{i18n.t("Source: ")}</CreditsText>
                        <Link href="#">
                            <Typography variant="caption">{i18n.t("Tambor and Pavlova (2020)")}</Typography>
                        </Link>
                    </span>
                    <br />
                    <span>
                        <CreditsText variant="caption">{i18n.t("Last updated: ")}</CreditsText>
                        <CreditsText variant="caption">{i18n.t("15 June 2020")}</CreditsText>
                    </span>
                </Column>
            </Row>
        </ChartContainer>
    );
});

function chartOptions(categories: string[], series: any[]): Highcharts.Options {
    return {
        chart: {
            type: "column",
            backgroundColor: "#f1f9fc",
            margin: 70,
            height: 500,
        },
        title: {
            text: "",
            align: "center",
        },
        xAxis: {
            categories,
        },
        yAxis: {
            min: 0,
            title: {
                text: "Households %",
                style: {
                    fontWeight: "bold",
                },
            },
            gridLineWidth: 0,
            stackLabels: {
                enabled: false,
            },
        },
        legend: {
            enabled: false,
            align: "center",
            verticalAlign: "bottom",
            y: 15,
        },
        tooltip: {
            headerFormat: "<b>{point.x}</b><br/>",
            pointFormat: "{series.name}: {point.y}<br/>",
        },
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
        series,
        credits: {
            enabled: false,
        },
    };
}

const ChartContainer = styled.div`
    margin-top: 48px;
    background: #f1f9fc;
    padding: 0px 32px 32px 32px;
`;

const DataHeader = styled.div`
    padding: 48px 0px;
`;

const CustomButton = styled(Button)`
    border-radius: 10px;
    padding: 0px 16px;
`;

const CreditsText = styled(Typography)`
    color: black;
`;

const Link = styled.a`
    text-decoration: none;
`;

const Column = styled.div`
    padding: 64px 30px 64px 64px;
    display: flex;
    flex-direction: column;
`;

const Row = styled.div<{ justifyContent?: string; marginBottom?: string }>`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.justifyContent || "space-between"}};
    margin-bottom: ${props => props.marginBottom || "0px"}};
`;
