import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { colors } from "../../app/themes/dhis2.theme";
import { useIndicatorExplorerFake } from "./useIndicatorExplorerFake";
import { IndicatorExplorerFiltersFake } from "../../../components/indicator-explorer/IndicatorExplorerFiltersFake";
import { ChartFake } from "../../../components/chart/ChartFake";
import indicatorExplorer from "../../../assets/indicator-explorer.svg";

export const IndicatorExplorerFakePage: React.FC = React.memo(() => {
    const { filters, chartImage, chartName, dialogInfo, onGetChart } = useIndicatorExplorerFake();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFiltersFake filters={filters} onGetChart={onGetChart} />

                {chartName && chartImage && dialogInfo && (
                    <Container maxWidth="lg">
                        <ChartFake name={chartName} image={chartImage} dialogInfo={dialogInfo} />
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
    padding: 48px 200px 48px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Image = styled.img`
    width: 160px;
    height: 160px;
`;
