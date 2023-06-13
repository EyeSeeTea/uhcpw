import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import { ChartWithPlugin } from "../../components/chart/ChartWithPlugin";
import { Chart } from "../../components/chart/Chart";
import indicatorExplorer from "../../assets/indicator-explorer.svg";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters, visualization, analytics, onGetChart } = useIndicatorExplorer();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFilters filters={filters} onGetChart={onGetChart} />

                {visualization && !analytics && (
                    <ChartWithPlugin
                        visualization={visualization}
                        countryIds={filters.country.selected}
                        periods={filters.year.selected ? filters.year.selected : []}
                    />
                )}
                {visualization && analytics && <Chart visualization={visualization} analytics={analytics} />}
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
