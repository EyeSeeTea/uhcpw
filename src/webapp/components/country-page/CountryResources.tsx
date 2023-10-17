import { Backdrop, CircularProgress, Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import i18n from "../../../locales";
import { ChevronRightIcon } from "../icons/ChevronRightIcon";
import { useCountryResources } from "../../pages/country/useCountryResources";
import React from "react";
import { ResourceItem } from "../resources/common/ResourceItem";

export const CountryResources: React.FC<{ countryId: string }> = ({ countryId }) => {
    const { loading, items } = useCountryResources(countryId);

    return (
        <Container aria-label="country-page-resources">
            <Row>
                <Typography variant="h3">{i18n.t("Country resources")}</Typography>
                <ChevronRightIcon link="/resources" />
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
    align-items: center;
    margin-bottom: 25px;
`;
