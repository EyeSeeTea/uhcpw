import { Box, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { TeamMember } from "../../../pages/about/AboutState";
import EmailIcon from "@material-ui/icons/Email";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

export interface ItemTeamProps {
    member: TeamMember;
}

export const ItemTeam: React.FC<ItemTeamProps> = React.memo(({ member }) => {
    return (
        <Center>
            <Item>
                <img width="100%" src={member.image} alt={member.name} style={{ borderRadius: 10, marginBottom: 6 }} />
                <Row>
                    <div>
                        <Typography variant="body1" gutterBottom>
                            {member.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {member.position}
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
    );
});

const ItemsTitleContainer = styled.div`
    padding: 64px 32px 16px 32px;
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
