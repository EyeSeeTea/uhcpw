import { Button, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import { Chart } from "../../components/chart/Chart";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters, visualization } = useIndicatorExplorer();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Indicator Explorer")}</Typography>
                <Typography variant="body1" style={{ maxWidth: "600px", padding: "8px 0px" }}>
                    {i18n.t(
                        "Track and compare indicators on financial hardship, unmet need for health services and spending on health"
                    )}
                </Typography>
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFilters filters={filters} />

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
                        <div style={{ width: "100%" }}>
                            {visualization && (
                                <Chart
                                    visualization={visualization}
                                    countryIds={filters.selectedCountryFilter}
                                    periods={filters.selectedYearFilter ? [filters.selectedYearFilter] : []}
                                />
                            )}
                        </div>

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
            </MainSection>
        </Layout>
    );
});

const ChartContainer = styled.div`
    margin-top: 48px;
    background: #f1f9fc;
    padding: 0px 32px 32px 32px;
`;

const MainSection = styled.div`
    background: white;
    padding: 48px 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 48px 64px;
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
