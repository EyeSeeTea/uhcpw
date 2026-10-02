import { Backdrop, CircularProgress, Container, Grid, GridSize, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { Layout } from "../../../components/layout/Layout";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
import { useResourcesByType } from "./useResourcesByType";
import { ResourceItem } from "../../../components/resources/common/ResourceItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import mapBackground from "../../../assets/map-background.jpg";
import { ScrollToTopButton } from "../../../components/scroll-to-top-button/ScrollToTopButton";
import { useAppContext } from "../../../contexts/app-context";
import { normalizeRegionName, parseCountryOrRegionParamToName } from "../../../utils/formatCountryOrRegionParamName";
import { findThemeFromParam } from "../../../utils/formatResourcesThemeParamName";

type ResourcesByTypePageProps = {
    paging?: boolean;
};

export const ResourcesByTypePage: React.FC<ResourcesByTypePageProps> = React.memo(({ paging = true }) => {
    const { sendEvent } = useAnalytics();
    const { themes, countries } = useAppContext();

    const {
        category,
        countriesOrTheme,
        countries: countriesInParams,
    } = useParams<{
        category: string;
        countriesOrTheme?: string;
        countries?: string;
    }>();

    const isSmallScreen = useIsSmallScreen();

    const filterInParams = useMemo(() => {
        const foundTheme = countriesOrTheme ? findThemeFromParam(themes, countriesOrTheme) : undefined;

        const hasThemeInPath = !!(countriesOrTheme && foundTheme);
        // NOTICE: use theme name to filter resources by theme in ResourceRepository get()
        const theme = hasThemeInPath ? foundTheme?.name : undefined;

        const maybeCountries = !hasThemeInPath ? countriesOrTheme : countriesInParams;
        const countryNames = maybeCountries
            ? maybeCountries
                  .split("-")
                  .map(countryName => normalizeRegionName(parseCountryOrRegionParamToName(countryName)))
            : [];

        const countryIdsInFilter = countries
            .filter(country => countryNames.includes(normalizeRegionName(country.name)))
            .map(country => country.id);

        return {
            country: countryIdsInFilter.length > 0 ? countryIdsInFilter : undefined,
            theme: theme,
        };
    }, [countries, countriesInParams, countriesOrTheme, themes]);

    const { loading, title, filters, items, onGetResources, hasMore, loadingMore, loadingRef } = useResourcesByType({
        category,
        countriesFilter: filterInParams.country,
        themeFilter: filterInParams.theme,
        paging,
    });

    React.useEffect(() => {
        sendEvent({ name: "resource_kind_page_view", pageTitle: "Resources", category: category });
    }, [sendEvent, category]);

    return (
        <Layout>
            <TitleAndSearchContainer>
                <TitleContainer>
                    <Title variant="h3">{title}</Title>
                </TitleContainer>

                <SearchContainer>
                    <SearchInput value={filters.search.term} onChange={filters.search.onTermChange} />
                </SearchContainer>
            </TitleAndSearchContainer>

            <Content>
                {isSmallScreen && <ScrollToTopButton />}
                <ResourcesContainer maxWidth="xl">
                    <FiltersContainer>
                        <ResourcesFilters filters={filters} onGetResources={onGetResources} />
                    </FiltersContainer>

                    {
                        <StyledGridContainer spacing={2} container direction="row">
                            {items &&
                                items.map((item, index) => {
                                    const sizes = getSizes(item);
                                    return (
                                        <StyledGridItem
                                            key={index}
                                            item
                                            lg={sizes.lg}
                                            md={sizes.md}
                                            sm={sizes.sm}
                                            xs={sizes.xs}
                                        >
                                            <ResourceItem resource={item} analyticsPageTitle="Resources" />
                                        </StyledGridItem>
                                    );
                                })}
                            {hasMore && (
                                <Grid item xs={12} ref={loadingRef}>
                                    <LoadingContainer>{loadingMore && <CircularProgress size={24} />}</LoadingContainer>
                                </Grid>
                            )}
                        </StyledGridContainer>
                    }
                </ResourcesContainer>

                <Backdrop open={loading} style={{ color: "#fff", zIndex: 1001 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            </Content>
        </Layout>
    );
});

const getSizes = (resource: Resource): { lg: GridSize; md: GridSize; sm: GridSize; xs: GridSize } => {
    switch (resource.kind) {
        case "comparative-analysis":
            return { lg: 2, md: 3, sm: 6, xs: 12 };
        case "country-analysis":
            return { lg: 2, md: 3, sm: 6, xs: 12 };
        case "news":
            return { lg: 4, md: 6, sm: 6, xs: 12 };
        case "multimedia":
            return { lg: 4, md: 6, sm: 6, xs: 12 };
    }
};

const Content = styled.div`
    background: white;
    min-height: 100vh;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        position: relative;
    }
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 200px 24px 64px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
        padding-inline: 32px;
        padding-block: 48px;
    }
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;

const FiltersContainer = styled.div`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
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

const StyledGridContainer = styled(Grid)`
    padding-block: 32px;
    padding-inline: 64px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-inline: 32px;
        background: ${colors.carouselBackground};
        width: calc(100% + 8px);
    }
`;

const StyledGridItem = styled(Grid)`
    justify-items: "flex-start";
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        justify-items: "center";
    }
`;

const TitleAndSearchContainer = styled.div`
    position: relative;
    width: 100%;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    height: 60px;
`;
