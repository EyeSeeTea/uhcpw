import { Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import indicatorExplorer from "../../assets/indicator-explorer.svg";
import { VisualizationPlugin } from "../../components/visualization/VisualizationPlugin";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { EmptyContent } from "../../components/indicator-explorer/EmptyContent";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const { filters, onGet, showVisualization, globalMessage, selectCategoryInfo, errorMessage } =
        useIndicatorExplorer();
    const snackbar = useSnackbar();

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else if (globalMessage?.type === "info") {
            snackbar.info(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    useEffect(() => {
        if (errorMessage) {
            snackbar.error(i18n.t(errorMessage));
        }
    }, [errorMessage, snackbar]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFilters filters={filters} onGetChart={onGet} />

                {showVisualization && filters.indicators.selected ? (
                    <VisualizationPlugin
                        visualizationId={filters.indicators.selected}
                        years={filters.year.selected || []}
                        countries={filters.country.selected || []}
                    />
                ) : (
                    <EmptyContent info={selectCategoryInfo} />
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
