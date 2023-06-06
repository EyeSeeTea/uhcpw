import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { colors } from "../../app/themes/dhis2.theme";
import { useIndicatorExplorerFake } from "./useIndicatorExplorerFake";
import { IndicatorExplorerFiltersFake } from "../../../components/indicator-explorer/IndicatorExplorerFiltersFake";
import { ChartFake } from "../../../components/chart/ChartFake";

export const IndicatorExplorerFakePage: React.FC = React.memo(() => {
    const { filters, chartImage, chartName, onGetChart } = useIndicatorExplorerFake();

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
                <IndicatorExplorerFiltersFake filters={filters} onGetChart={onGetChart} />

                {chartName && chartImage && (
                    <Container maxWidth="lg">
                        <ChartFake name={chartName} image={chartImage} />
                    </Container>
                )}
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

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
