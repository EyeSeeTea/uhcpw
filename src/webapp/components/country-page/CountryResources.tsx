import React, { useCallback } from "react";
import { Backdrop, CircularProgress, Fab, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import ChevronRightSharpIcon from "@material-ui/icons/ChevronRightSharp";

import i18n from "../../../locales";
import { useCountryResources } from "../../pages/country/useCountryResources";
import { ResourceItem } from "../resources/common/ResourceItem";

export const CountryResources: React.FC<{ countryId: string }> = ({ countryId }) => {
    const history = useHistory();
    const { loading, items } = useCountryResources(countryId);

    const onArrowClick = useCallback(() => {
        history.push("/resources");
    }, [history]);

    return (
        <Container aria-label="country-page-resources">
            <Row>
                <Typography variant="h5">{i18n.t("Country resources")}</Typography>
                <Fab
                    aria-label="Go to resources"
                    color="primary"
                    size="small"
                    style={{ boxShadow: "none", transform: "scale(0.7)" }}
                >
                    <ChevronRightSharpIcon onClick={onArrowClick} />
                </Fab>
            </Row>
            <Grid container spacing={5}>
                {items &&
                    items.map((resource, i) => {
                        return (
                            <Grid key={i} item xs={6} md={4} lg={3} xl={2}>
                                <ResourceItem resource={resource} />
                            </Grid>
                        );
                    })}
            </Grid>
            <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                <CircularProgress color="primary" />
            </Backdrop>
        </Container>
    );
};

const Container = styled.div`
    padding: 40px 0px 40px 60px;
    max-width: 80%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-block-end: 25px;
    gap: 2px;
`;
