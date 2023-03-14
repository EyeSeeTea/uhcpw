import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { TeamMember } from "../../../pages/about/AboutState";
import EmailIcon from "@material-ui/icons/Email";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

export interface NewsProps {
    team: TeamMember[];
}

export const Team: React.FC<NewsProps> = React.memo(({ team }) => {
    return (
        <>
            <ItemsTitleContainer>
                <Title>{i18n.t("Our Team")}</Title>
            </ItemsTitleContainer>

            <Grid container spacing={5}>
                {team.map((item, index) => {
                    return (
                        <Grid key={index} item lg={4} md={6} xs={12}>
                            <Center>
                                <Item>
                                    <img
                                        width="100%"
                                        src={item.image}
                                        alt={item.name}
                                        style={{ borderRadius: 10, marginBottom: 6 }}
                                    />
                                    <Row>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                {item.position}
                                            </Typography>
                                        </div>

                                        <Row>
                                            <LinkedInIcon />
                                            <Box width={4} />
                                            <EmailIcon />
                                        </Row>
                                    </Row>
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
    padding: 64px 32px 16px 32px;
`;

const Title = styled(Typography)`
    font-size: 20px;
    font-weight: normal;
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

const Item = styled.div`
    border-radius: 10px;
    padding: 16px;
    width: 450px;
    flex-direction: column;
`;
