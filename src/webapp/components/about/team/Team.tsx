import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ItemPerson } from "../person/ItemPerson";
import { PersonState } from "../../../pages/about/AboutState";

export interface TeamProps {
    team: PersonState[];
}

export const Team: React.FC<TeamProps> = React.memo(({ team }) => {
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.only("xs"));
    return (
        <>
            <ItemsTitleContainer>
                <Title variant="h3">{i18n.t("The WHO Barcelona Office team")}</Title>
                <Subtitle variant="h5">{i18n.t("Staff and consultants")}</Subtitle>
            </ItemsTitleContainer>

            <Grid container spacing={6}>
                {team.map((item, index) => {
                    return (
                        <Grid key={index} item xs={6} sm={6} md>
                            <ItemPerson person={item} isExpert={false} isSmallImage={isXsScreen} />
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
    font-weight: 500;
`;

const Subtitle = styled(Typography)`
    color: rgba(36, 38, 38, 0.7);
    margin-top: 10px;
`;
