import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { CountryAnalysisItem } from "../../../pages/resources/landing/ResourcesState";
import { ResourceGroup } from "../resource-group/ResourceGroup";

export interface CountryAnalysisProps {
    countryAnalysis: CountryAnalysisItem[];
}

export const CountryAnalysis: React.FC<CountryAnalysisProps> = React.memo(({ countryAnalysis }) => {
    return (
        <ResourceGroup title={i18n.t("Country Analysis")} seeAllUrl={"/resources/country-analysis"}>
            <Grid container spacing={5}>
                {countryAnalysis.map((country, index) => {
                    return (
                        <Grid key={index} item lg={2} md={4} xs={6}>
                            <Center>
                                <Flag height={100} width={150} src={country.image} />

                                <Typography variant="body2" display="block" style={{ marginTop: 8 }}>
                                    {country.name}
                                </Typography>
                            </Center>
                        </Grid>
                    );
                })}
            </Grid>
        </ResourceGroup>
    );
});

const Flag = styled.img`
    border: 2px solid #c5c3c3;
    border-radius: 10px;
`;

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
