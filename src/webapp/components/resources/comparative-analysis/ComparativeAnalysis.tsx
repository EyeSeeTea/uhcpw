import { Box, Card, Grid, Typography } from "@material-ui/core";
import { Divider } from "material-ui";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ComparativeAnalysisState } from "../../../pages/resources/ResourcesState";
import { SeeAll } from "../../see-all/SeeAll";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysisState[];
}

export const ComparativeAnalysis: React.FC<CountryAnalysisProps> = React.memo(({ comparativeAnalysis }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Typography variant="h6" color="textSecondary">
                    {i18n.t("Comparative Analysis")}
                </Typography>
                <Row>
                    <Typography variant="body2" color="textSecondary" style={{ maxWidth: "700px" }}>
                        {i18n.t(
                            "Find reports across the following thematic areas: financial protection, resilience and financial sustainability, voluntary health insurance, spending on health."
                        )}
                    </Typography>
                    <SeeAll textColor="white" onClick={() => {}} />
                </Row>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {comparativeAnalysis.map((country, index) => {
                    return (
                        <Grid key={index} item md={4} xs={6}>
                            <Center>
                                <Item elevation={0}>
                                    <ItemRow>
                                        <img src={country.image} alt={country.text} />
                                        <Column>
                                            <Typography variant="body2">{country.text}</Typography>
                                            <Tag>
                                                <Typography variant="body2">{country.tag}</Typography>
                                            </Tag>
                                            <Box flexGrow={1} />

                                            <div style={{ width: "100%" }}>
                                                <Divider />
                                                <Row>
                                                    <Typography>{country.year}</Typography>
                                                    <Typography color="primary">{country.language}</Typography>
                                                </Row>
                                            </div>
                                        </Column>
                                    </ItemRow>
                                </Item>
                            </Center>
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

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Column = styled.div`
    padding: 16px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: start;
`;

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    width: 450px;
    flex-direction: column;
    background: #f8f8f8;
`;

const ItemRow = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const Tag = styled.div`
    border-radius: 8px;
    background: #c6e2f1;
    color: #174587;
    padding: 8px 16px;
    margin-top: 8px;
    display: inline-block;
`;
