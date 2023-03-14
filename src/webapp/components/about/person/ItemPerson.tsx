import { Box, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Person } from "../../../pages/about/AboutState";
import EmailIcon from "@material-ui/icons/Email";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons//Twitter";

export interface ItemPersonProps {
    person: Person;
}

export const ItemPerson: React.FC<ItemPersonProps> = React.memo(({ person }) => {
    return (
        <Center>
            <Item>
                <img width="100%" src={person.image} alt={person.name} style={{ borderRadius: 10, marginBottom: 6 }} />
                <Row>
                    <div>
                        <Typography variant="body1" gutterBottom>
                            {person.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {person.position}
                        </Typography>
                        {
                            <Typography variant="body2" gutterBottom>
                                {person.country}
                            </Typography>
                        }
                    </div>

                    <Row>
                        <Link href={person.linkedin}>
                            <LinkedInIcon />
                        </Link>
                        <Box width={4} />
                        <Link href={person.email}>
                            <EmailIcon />
                        </Link>
                        <Box width={4} />

                        {person.twitter && (
                            <Link href={person.twitter}>
                                <TwitterIcon />
                            </Link>
                        )}
                    </Row>
                </Row>
            </Item>
        </Center>
    );
});

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

const Link = styled.a`
    color: black;
`;
