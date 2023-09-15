import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import React, { useRef } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import { ChartPlugin } from "./ChartPlugin";
import { useChartData } from "./useChartData";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
interface VisualizationPluginProps {
    visualizationId: string;
    years: string[];
    countries: string[];
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(
    ({ visualizationId, years, countries }) => {
        const chartData = useChartData(visualizationId, years, countries);
        const ref = useRef<HTMLDivElement>(null);
        //const [isOpen, setIsOpen] = useState(false);

        const handleDownload = React.useCallback(() => {
            if (ref.current && chartData.kind === "Loaded")
                downloadHtmlElement(ref.current, chartData.visualization.name, {
                    backgroundColor: "#f1f9fc",
                    exclusionClasses: ["download-button", "info-button"],
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [chartData.kind, chartData]);

        return chartData.kind === "Loaded" && chartData.analytics.rows.length > 0 ? (
            <Container ref={ref}>
                <DataHeader>
                    <Row>
                        <Row>
                            <Typography variant="h6" color="textPrimary" style={{ marginLeft: 20 }}>
                                {chartData.visualization.name}
                            </Typography>
                            {/* <Button onClick={() => setIsOpen(true)}> */}
                            <Button>
                                <CustomInfoIcon color="primary" className="info-button" htmlColor="#185698" />
                            </Button>
                        </Row>

                        <Row>
                            <DownloadButton
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                color="primary"
                                style={{ marginLeft: 20 }}
                                onClick={handleDownload}
                                className="download-button"
                            >
                                <Typography>{i18n.t("Download")}</Typography>
                            </DownloadButton>
                        </Row>
                    </Row>
                </DataHeader>

                <ChartPlugin
                    analytics={[chartData.analytics]}
                    visualization={chartData.visualization}
                    legendSets={chartData.legendSets}
                    customization={chartData.customization}
                />
                <Box height={32} />

                {/* <NotesDialog isOpen={isOpen} setIsOpen={setIsOpen} dialogInfo={dialogInfo} /> */}
            </Container>
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

const Container = styled.div`
    margin-top: 48px;
    background: #f1f9fc;
    padding: 0px 32px 32px 32px;
`;

const DataHeader = styled.div`
    padding: 48px 0px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: center;
`;

const DownloadButton = styled(Button)`
    border-radius: 20px;
    padding: 0px 32px;
    height: 42px;
    background: #185698;
    text-transform: initial;
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CustomInfoIcon = styled(InfoIcon)`
    color: #185698;
`;
