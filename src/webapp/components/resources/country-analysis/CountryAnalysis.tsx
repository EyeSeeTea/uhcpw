import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { CountryAnalysisItem } from "../../../pages/resources/landing/ResourcesState";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";

export interface CountryAnalysisProps {
    countryAnalysis: CountryAnalysisItem[];
}

export const CountryAnalysis: React.FC<CountryAnalysisProps> = React.memo(({ countryAnalysis }) => {
    return (
        <>
            <Container>
                <Row>
                    <Typography variant="h4">{i18n.t("Country analysis")}</Typography>
                    <ChevronRightIcon />
                </Row>
                <Grid container spacing={2} style={{ marginTop: 15 }}>
                    {countryAnalysis.map((country, index) => {
                        return (
                            <Grid key={index} item lg={2} md={4} xs={6}>
                                <Center>
                                    <Flag height={55} width={90} src={country.image} />
                                </Center>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </>
    );
});

const Flag = styled.img`
    border: 0.5px solid #c5c3c3;
`;

const Container = styled.div`
    padding: 32px;
`;

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
