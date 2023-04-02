import { Button, Paper, TableContainer, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import InfoIcon from "@material-ui/icons/Info";
import DownloadIcon from "@material-ui/icons/CloudDownload";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters } = useIndicatorExplorer();

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

                <TableHeader>
                    <Row>
                        <Row>
                            <Typography variant="h6" color="primary">
                                {i18n.t("Share of households with catastrophic spending by consumption quintile")}
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
                </TableHeader>
                <TableContainer component={TablePaper}></TableContainer>
                <span>
                    <CreditsText variant="caption">{i18n.t("Source: ")}</CreditsText>
                    <Link href="#">
                        <Typography variant="caption">{i18n.t("Tambor and Pavlova (2020)")}</Typography>
                    </Link>
                </span>
                <br />
                <span>
                    <CreditsText variant="caption">{i18n.t("data last updated: ")}</CreditsText>
                    <CreditsText variant="caption">{i18n.t("15 June 2020")}</CreditsText>
                </span>
            </MainSection>
        </Layout>
    );
});

const MainSection = styled.div`
    background: white;
    padding: 48px 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 48px 64px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const TableHeader = styled.div`
    padding: 48px 0px;
`;

const CustomButton = styled(Button)`
    border-radius: 10px;
    padding: 0px 16px;
`;

const TablePaper = styled(Paper)`
    border-radius: 10px;
    box-shadow: none;
`;

const CreditsText = styled(Typography)`
    color: grey;
`;

const Link = styled.a`
    text-decoration: none;
`;
