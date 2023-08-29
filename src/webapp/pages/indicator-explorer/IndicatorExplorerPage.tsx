import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import indicatorExplorer from "../../assets/indicator-explorer.svg";
import ChartWithAnalytics from "../../components/chart/ChartWithAnalytics";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters, visualization, analytics, onGetChart } = useIndicatorExplorer();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFilters filters={filters} onGetChart={onGetChart} />

                {/* {visualization && analytics && (
                    <ChartWithPlugin
                        visualization={visualization}
                        countryIds={filters.country.selected}
                        periods={filters.year.selected ? filters.year.selected : []}
                    />
  
                )}
                {{visualization && analytics && <Chart visualization={visualization} analytics={analytics} />} } */}
                {visualization && analytics && analytics.rows.length > 0 && (
                    <ChartWithAnalytics
                        responses={[analytics]}
                        extraOptions={{ dashboard: false }}
                        legendSets={[]}
                        visualization={visualization}
                        style={{
                            alignItems: "flex-start",
                            display: "flex",
                            height: "100%",
                            justifyContent: "flex-start",
                        }}
                        animation={200}
                    />
                )}
                {analytics && analytics.rows.length === 0 && (
                    <Center>
                        <Typography variant="subtitle1">{i18n.t("There may be no data")}</Typography>
                    </Center>
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

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
