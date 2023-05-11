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
                <Image src={person.image} alt={`${person.firstName} ${person.lastName}`} />
                <Row>
                    <InfoContainer>
                        <Typography variant="body1" gutterBottom style={{ marginBottom: "-1px", fontWeight: "bold" }}>
                            {person.firstName}
                        </Typography>
                        <Typography variant="body1" gutterBottom style={{ fontWeight: "bold" }}>
                            {person.lastName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {person.position}
                        </Typography>
                        {
                            <Typography variant="body2" gutterBottom>
                                {person.country}
                            </Typography>
                        }
                    </InfoContainer>

                    <SocialRow>
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
                    </SocialRow>
                </Row>
            </Item>
        </Center>
    );
});

const Center = styled.div`
    display: flex;
    position: relative;
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

const SocialRow = styled(Row)`
    position: absolute;
    right: 5px;
    bottom: 50px;
`;

const Item = styled.div`
    display: flex;
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
    align-items: center;
`;

const Link = styled.a`
    color: black;
`;

const Image = styled.img`
    width: 250px;
    height: 250px;
    border-radius: 50%;
    margin-bottom: 6px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
