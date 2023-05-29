import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ComparativeAnalysisState } from "../../../pages/resources/landing/ResourcesState";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysisState[];
}

export const ComparativeAnalysis: React.FC<CountryAnalysisProps> = React.memo(({ comparativeAnalysis }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Row>
                    <Typography variant="h4">{i18n.t("Comparative Analysis")}</Typography>
                    <ChevronRightIcon />
                </Row>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {comparativeAnalysis.map((country, index) => {
                    return (
                        <Grid key={index} item lg={3} md={3} xs={6}>
                            <Column>
                                <Image src={country.image} alt={country.text} />
                                <Theme theme={country.theme} />
                            </Column>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
});

const ItemsTitleContainer = styled.div`
    padding: 32px;
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Column = styled.div`
    padding: 16px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: start;
`;

const Image = styled.img`
    width: 160px;
    margin-bottom: 20px;
`;
