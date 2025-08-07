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

export const CountryResources: React.FC<{ countryIds: Id[] }> = ({ countryIds }) => {
    const history = useHistory();
    const { loading, countryAnalysisResource, comparativeAnalysisResources } = useCountryResources(countryIds);

    const redirectCountryIds = useMemo(() => {
        return countryIds
            .map(id => {
                return id === FEDERACIJA_BOSNE_I_HERCEGOVINE || id === REPUBLICA_SERPSKA
                    ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
                    : id;
            })
            .join(",");
    }, [countryIds]);

    const onArrowClick = useCallback(
        (link: string) => {
            history.push(link);
        },
        [history]
    );

    return (
        <Container aria-label="country-page-resources">
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
            {countryAnalysisResource?.length ? (
                <ResourcesSection aria-label="country-resources">
                    <Row>
                        <Typography variant="h6">{i18n.t("Country or area analysis")}</Typography>
                        <Fab
                            aria-label="Go to country or area analysis resources"
                            color="primary"
                            size="small"
                            style={{ boxShadow: "none", transform: "scale(0.7)" }}
                        >
                            <ChevronRightSharpIcon
                                onClick={() =>
                                    onArrowClick(`/resources/country-analysis?country=${redirectCountryIds}`)
                                }
                            />
                        </Fab>
                    </Row>
                    <StyledGridContainer container spacing={5}>
                        {countryAnalysisResource.map((resource, i) => {
                            return (
                                <StyledGridItem key={`country-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </StyledGridItem>
                            );
                        })}
                    </StyledGridContainer>
                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}

            {comparativeAnalysisResources?.length ? (
                <ResourcesSection aria-label="comparative-resources">
                    <RowWithMargin>
                        <Typography variant="h6">{i18n.t("Comparative analysis")}</Typography>
                        <Fab
                            aria-label="Go to comparative analysis resources"
                            color="primary"
                            size="small"
                            style={{ boxShadow: "none", transform: "scale(0.7)" }}
                        >
                            <ChevronRightSharpIcon
                                onClick={() =>
                                    onArrowClick(`/resources/comparative-analysis?country=${redirectCountryIds}`)
                                }
                            />
                        </Fab>
                    </RowWithMargin>
                    <StyledGridContainer container spacing={5}>
                        {comparativeAnalysisResources.map((resource, i) => {
                            return (
                                <StyledGridItem key={`comparative-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </StyledGridItem>
                            );
                        })}
                    </StyledGridContainer>
                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px;
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

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    padding-inline-start: 60px;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
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

const RowWithMargin = styled(Row)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-start: 30px;
    }
`;
