import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Person } from "../../../pages/about/AboutState";
import { ItemPerson } from "../person/ItemPerson";

export interface ExpertsNetworkProps {
    members: Person[];
}

export const ExpertsNetwork: React.FC<ExpertsNetworkProps> = React.memo(({ members }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Title>{i18n.t("Experts network")}</Title>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {members.map((item, index) => {
                    return (
                        <Grid key={index} item lg={4} md={6} xs={12}>
                            <ItemPerson person={item} />
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
});

const ItemsTitleContainer = styled.div`
    padding: 64px 32px 16px 32px;
`;

const Title = styled(Typography)`
    font-size: 20px;
    font-weight: normal;
`;
