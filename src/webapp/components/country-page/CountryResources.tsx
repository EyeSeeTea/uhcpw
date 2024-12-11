import React, { useCallback } from "react";
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

export const CountryResources: React.FC<{ countryId: string }> = ({ countryId }) => {
    const history = useHistory();
    const { loading, countryAnalysisResource, comparativeAnalysisResources } = useCountryResources(countryId);

    const redirectCountryId =
        countryId === FEDERACIJA_BOSNE_I_HERCEGOVINE || countryId === REPUBLICA_SERPSKA
            ? BOSNIA_AND_HERZEGOVINA_LEVEL_4
            : countryId;

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
                                onClick={() => onArrowClick(`/resources/country-analysis?country=${redirectCountryId}`)}
                            />
                        </Fab>
                    </Row>
                    <Grid container spacing={5}>
                        {countryAnalysisResource.map((resource, i) => {
                            return (
                                <Grid key={`country-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}

            {comparativeAnalysisResources?.length ? (
                <ResourcesSection aria-label="comparative-resources">
                    <Row>
                        <Typography variant="h6">{i18n.t("Comparative analysis")}</Typography>
                        <Fab
                            aria-label="Go to comparative analysis resources"
                            color="primary"
                            size="small"
                            style={{ boxShadow: "none", transform: "scale(0.7)" }}
                        >
                            <ChevronRightSharpIcon
                                onClick={() =>
                                    onArrowClick(`/resources/comparative-analysis?country=${redirectCountryId}`)
                                }
                            />
                        </Fab>
                    </Row>
                    <Grid container spacing={5}>
                        {comparativeAnalysisResources.map((resource, i) => {
                            return (
                                <Grid key={`comparative-analysis-${i}`} item xs={6} md={4} lg={3} xl={2}>
                                    <ResourceItem resource={resource} analyticsPageTitle="Country page" />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                        <CircularProgress color="primary" />
                    </Backdrop>
                </ResourcesSection>
            ) : null}
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px 40px 60px;
    max-width: 80%;
`;

const ResourcesSection = styled.div`
    margin-block-start: 50px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-block-end: 25px;
    gap: 2px;
`;
