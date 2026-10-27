import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled, { css } from "styled-components";

import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ExplainerVideoButton } from "../../../components/explainer-video/ExplainerVideoButton";
import { useExplainer } from "../../../components/explainer-video/useExplainer";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import { colors } from "../../app/themes/dhis2.theme";
import { useResources } from "./useResources";
import SearchInput from "../../../components/search-input/SearchInput";
import { ResourcesListBySection } from "./ResourcesListBySection";
import { LandingResources } from "./LandingResources";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import mapBackground from "../../../assets/map-background.jpg";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { MobileLandingResources } from "./MobileLandingResources";

export const ResourcesPage: React.FC = React.memo(() => {
    const { filters, landingResources, resourcesBySection, onGetResources } = useResources();
    const { sendPageView } = useAnalytics();
    const isSmallScreen = useIsSmallScreen();
    const explainer = useExplainer("resources");

    React.useEffect(() => {
        sendPageView({ title: "Resources" });
    }, [sendPageView]);

    return (
        <Layout>
            <TitleAndSearchContainer>
                <TitleContainer $hasExplainer={explainer !== undefined}>
                    <Typography variant="h3">{i18n.t("Resources")}</Typography>
                    {explainer && <ExplainerVideoButton explainer={explainer} smallScreenVariant="light" />}
                </TitleContainer>

                <SearchContainer>
                    <SearchInput
                        value={filters.search.term}
                        onChange={filters.search.onTermChange}
                        placeholder={i18n.t("Search all publications")}
                    />
                </SearchContainer>
            </TitleAndSearchContainer>

            <ResourcesContainer maxWidth="xl">
                <StyledGrid container>
                    <FiltersContainer>
                        <ResourcesFilters
                            filters={filters}
                            onGetResources={onGetResources}
                            disabledCountryFilter
                            disabledYearFilter
                            isAllResourcesPage
                        />
                    </FiltersContainer>

                    {!filters.search.term &&
                        !filters.theme.selected &&
                        !!landingResources &&
                        (isSmallScreen ? (
                            <MobileLandingResources resources={landingResources} />
                        ) : (
                            <LandingResources resources={landingResources} />
                        ))}

                    {(!!filters.search.term || !!filters.theme.selected) && !!resourcesBySection && (
                        <ResourcesListBySection
                            resourcesBySection={resourcesBySection}
                            themeSelected={filters.theme.selected}
                            isSmallScreen={isSmallScreen}
                            hasSearchTerm={!!filters.search.term}
                        />
                    )}
                </StyledGrid>
            </ResourcesContainer>
        </Layout>
    );
});

const TitleContainer = styled.div<{ $hasExplainer: boolean }>`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px 32px;
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 64px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
        padding-inline: 32px;
        padding-block: 48px;
        /* NOTICE: on small screens, without an explainer video the title keeps its layout from before the button */
        ${props =>
            !props.$hasExplainer &&
            css`
                display: block;
            `}
    }
`;

const TitleAndSearchContainer = styled.div`
    position: relative;
    width: 100%;
`;

const FiltersContainer = styled.div`
    width: 100%;
    padding-block-start: 64px;
    padding-block-end: 32px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-block-start: 32px;
        padding-inline: 32px;
    }
`;

const ResourcesContainer = styled(Container)`
    padding: 0;
`;

const SearchContainer = styled.div`
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 70%;
    width: 442px;
    z-index: 1;
`;

const StyledGrid = styled(Grid)`
    padding-block-end: 32px;
    padding-inline: 64px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 0;
        padding-block-end: 0;
    }
`;
