import { Button, Typography } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import styled, { css } from "styled-components";
import { Id, Ref } from "../../../domain/entities/Ref";
import { Dimension, Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { useAppContext } from "../../contexts/app-context";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import i18n from "../../../locales";

export interface ChartProps {
    visualization: Visualization;
    countryIds?: string[];
    periods?: string[];
}

export const ChartWithPlugin: React.FC<ChartProps> = React.memo(({ visualization, countryIds, periods }) => {
    const { api, isNodeDev: isDev } = useAppContext();
    const elementId = `visualization-${visualization.id}`;

    React.useEffect(() => {
        const url = isDev ? "/dhis2" : api.baseUrl;

        const item: ReportItem = {
            id: visualization.id,
            el: elementId,
            columns: getDimensions(visualization, "columns", countryIds, periods),
            rows: getDimensions(visualization, "rows", countryIds, periods),
            filters: getDimensions(visualization, "filters", countryIds, periods),
        };

        window.chartPlugin.url = url;
        window.chartPlugin.load([item]);
    }, [visualization, api, elementId, isDev, countryIds, periods]);

    return (
        <ChartContainer>
            <DataHeader>
                <Row>
                    <Row>
                        <Typography variant="h6" color="primary">
                            {visualization?.name}
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
                <div style={{ width: "100%" }}>{visualization && <Container id={elementId}></Container>}</div>

                <Column>
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

const getDimensions = (
    visualization: Visualization,
    prop: VisualizationProp,
    countryIds?: string[],
    periods?: string[]
): ItemRef[] | undefined => {
    const existsOu = visualization[prop].some(vd => vd.id === "ou");
    const existsPe = visualization[prop].some(vd => vd.id === "pe");
    const existsDx = visualization[prop].some(vd => vd.id === "dx");

    if (existsOu || existsPe || existsDx) {
        const dimensionsOu =
            existsOu && countryIds && countryIds.length > 0
                ? [{ dimension: "ou" as const, items: countryIds?.map(countryId => ({ id: countryId })) }]
                : [];

        const dimensionsPe =
            existsPe && periods && periods.length > 0
                ? [{ dimension: "pe" as const, items: periods?.map(period => ({ id: period })) }]
                : [];

        const dimensionsDx =
            (dimensionsOu.length > 0 || dimensionsPe.length > 0) &&
            existsDx &&
            visualization.dataDimensionItems &&
            visualization.dataDimensionItems.length > 0
                ? [
                      {
                          dimension: "dx" as const,
                          items: visualization.dataDimensionItems?.map(
                              dataDimensionItem => dataDimensionItem.dataElement
                          ),
                      },
                  ]
                : [undefined];

        const dimensions = _.compact([...dimensionsOu, ...dimensionsPe, ...dimensionsDx]);

        return dimensions.length > 0 ? dimensions : undefined;
    } else {
        return undefined;
    }
};

export type VisualizationProp = "filters" | "rows" | "columns";

declare global {
    interface Window {
        chartPlugin: {
            url: string;
            username: string;
            password: string;
            load(reports: ReportItem[]): void;
        };
    }
}

interface ReportItem {
    id: Id;
    el: DOMSelectorId;
    rows?: ItemRef[];
    filters?: ItemRef[];
    columns?: ItemRef[];
}

interface ItemRef {
    dimension: Dimension;
    items: Ref[];
}

type DOMSelectorId = string;

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
        fill: #f1f9fc;
    }

    ${customCss}
`;

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
    color: grey;
`;

const Link = styled.a`
    text-decoration: none;
`;

const Column = styled.div`
    padding: 64px 30px 64px 64px;
    display: flex;
    flex-direction: column;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
