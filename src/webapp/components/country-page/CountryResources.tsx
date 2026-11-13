import React, { useCallback, useMemo } from "react";
import { Backdrop, CircularProgress, Fab, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";

import i18n from "../../../locales";
import { useCountryResources } from "../../pages/country/useCountryResources";
import { ResourceItem } from "../resources/common/ResourceItem";
import {
    FEDERACIJA_BOSNE_I_HERCEGOVINE,
    REPUBLICA_SERPSKA,
    BOSNIA_AND_HERZEGOVINA_LEVEL_4,
} from "../../../data/repositories/countries/CountryD2Repository";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../../pages/app/themes/dhis2.theme";
import { Id } from "../../../domain/entities/Ref";
import { useAppContext } from "../../contexts/app-context";
import { formatCountryOrRegionParamName, joinCountries } from "../../utils/formatCountryOrRegionParamName";

export type CountryResourcesProps = {
    countryIds: Id[];
    isRegionalPage?: boolean;
};

export const CountryResources: React.FC<CountryResourcesProps> = ({ countryIds, isRegionalPage = false }) => {
    const history = useHistory();
    const { loading, countryAnalysisResource, comparativeAnalysisResources } = useCountryResources(countryIds);
    const { countries } = useAppContext();

    const countryNamesParams = useMemo(() => {
        const ids = countryIds.map(id => {
            return id === FEDERACIJA_BOSNE_I_HERCEGOVINE || id === REPUBLICA_SERPSKA
                ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
                : id;
        });

        const countryNamesInParams = countries
            .filter(country => ids.includes(country.id))
            .map(country => formatCountryOrRegionParamName(country.name));

        return joinCountries(countryNamesInParams);
    }, [countryIds, countries]);

    const onArrowClick = useCallback(
        (link: string) => {
            history.push(link);
        },
        [history]
    );

    return (
        <Container aria-label="country-page-resources" isRegionalPage={isRegionalPage}>
            {isRegionalPage ? null : (
                <Row>
                    <Typography variant="h5">{i18n.t("Resources")}</Typography>

                    <Fab
                        aria-label="Go to resources"
                        color="primary"
                        size="small"
                        style={{ boxShadow: "none", transform: "scale(0.7)" }}
                    >
                        <ChevronRightSharpIcon onClick={() => onArrowClick("/resources")} />
                    </Fab>
                </Row>
            )}

            {countryAnalysisResource?.length ? (
                <ResourcesSection aria-label="country-resources">
                    <FirstRowWithMargin $isRegionalPage={isRegionalPage}>
                        <StyledTypography variant="h6">{i18n.t("Country or area analysis")}</StyledTypography>

                        <Fab
                            aria-label="Go to country or area analysis resources"
                            color="primary"
                            size="small"
                            style={{ boxShadow: "none", transform: "scale(0.7)" }}
                        >
                            <ChevronRightSharpIcon
                                onClick={() => onArrowClick(`/resources/country-analysis/${countryNamesParams}`)}
                            />
                        </Fab>
                    </FirstRowWithMargin>

                    <StyledGridContainer container spacing={5}>
                        {countryAnalysisResource.map((resource, i) => {
                            return (
                                <StyledGridItem key={`country-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </StyledGridItem>
                            );
                        })}
                    </StyledGridContainer>

                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1001 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}

            {comparativeAnalysisResources?.length ? (
                <ResourcesSection aria-label="comparative-resources">
                    <SecondRowWithMargin $isRegionalPage={isRegionalPage}>
                        <StyledTypography variant="h6">{i18n.t("Comparative analysis")}</StyledTypography>

                        <Fab
                            aria-label="Go to comparative analysis resources"
                            color="primary"
                            size="small"
                            style={{ boxShadow: "none", transform: "scale(0.7)" }}
                        >
                            <ChevronRightSharpIcon
                                onClick={() => onArrowClick(`/resources/comparative-analysis/${countryNamesParams}`)}
                            />
                        </Fab>
                    </SecondRowWithMargin>

                    <StyledGridContainer container spacing={5}>
                        {comparativeAnalysisResources.map((resource, i) => {
                            return (
                                <StyledGridItem key={`comparative-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </StyledGridItem>
                            );
                        })}
                    </StyledGridContainer>

                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1001 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}
        </Container>
    );
};

const Container = styled.div<{ isRegionalPage?: boolean }>`
    width: 100%;
    padding: ${props => (props.isRegionalPage ? "0 0 40px 0" : "40px 0px")};
    max-width: 80%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
        padding: 30px 0px;
    }
`;

const ResourcesSection = styled.div`
    margin-block-start: 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-start: 0;
    }
`;

const Row = styled.div<{ $isRegionalPage?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    padding-inline-start: 60px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
        padding-inline-start: ${props => (props.$isRegionalPage ? "32px" : "16px")};
    }
`;

const StyledGridContainer = styled(Grid)`
    padding-inline-start: 60px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${colors.carouselBackground};
        padding-inline-start: 20px;
        width: calc(100% + 20px);
    }
`;

const StyledGridItem = styled(Grid)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 20px;
    }
`;

const SecondRowWithMargin = styled(Row)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block: 30px;
    }
`;

const FirstRowWithMargin = styled(Row)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-end: 30px;
        margin-block-start: 10px;
    }
`;

const StyledTypography = styled(Typography)`
    color: ${colors.black};
`;
