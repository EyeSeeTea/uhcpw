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

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters, visualization, analytics } = useIndicatorExplorer();

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

                {visualization && (
                    <ChartWithPlugin
                        visualization={visualization}
                        countryIds={filters.selectedCountryFilter}
                        periods={filters.selectedYearFilter ? [filters.selectedYearFilter] : []}
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
    padding: 48px 64px;
`;
