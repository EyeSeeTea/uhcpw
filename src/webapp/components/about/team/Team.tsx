import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ItemPerson } from "../person/ItemPerson";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { Person } from "../../../../domain/entities/Person";

export interface TeamProps {
    team: Person[];
}

export const Team: React.FC<TeamProps> = React.memo(({ team }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Title>{i18n.t("The WHO Barcelona Office team")}</Title>
                <Subtitle>{i18n.t("Staff and consultants")}</Subtitle>
            </ItemsTitleContainer>

            <Grid container spacing={8}>
                {team.map((item, index) => {
                    return (
                        <Grid key={index} item lg={3} md={4} xs={6}>
                            <ItemPerson person={item} isExpert={false} />
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
    font-size: 35px;
`;

const Subtitle = styled(Typography)`
    font-size: 17px;
    color: ${colors.grey};
`;
