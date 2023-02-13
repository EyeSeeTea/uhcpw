import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { CountryAnalysisItem } from "../../../pages/resources/ResourcesState";
import { SeeAll } from "../../see-all/SeeAll";

export interface CountryAnalysisProps {
    countryAnalysis: CountryAnalysisItem[];
}

export const CountryAnalysis: React.FC<CountryAnalysisProps> = React.memo(({ countryAnalysis }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Typography variant="h6">{i18n.t("Country analysis")}</Typography>
                <Row>
                    <Typography variant="body2">
                        {i18n.t(
                            "Explore reports on financial protection for 21 countries. Also included are reports summaries and infographics"
                        )}
                    </Typography>
                    <SeeAll textColor="blue" onClick={() => {}} />
                </Row>
            </ItemsTitleContainer>

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
        </>
    );
});

const Flag = styled.img`
    border: 2px solid #c5c3c3;
    border-radius: 10px;
`;

const ItemsTitleContainer = styled.div`
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
    justify-content: space-between;
`;
