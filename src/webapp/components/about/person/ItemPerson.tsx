import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Person } from "../../../pages/about/AboutState";

export interface ItemPersonProps {
    person: Person;
    isExpert: boolean;
}

export const ItemPerson: React.FC<ItemPersonProps> = React.memo(({ person, isExpert }) => {
    return (
        <Center role="listitem">
            <Item>
                <Image src={person.image} alt={`${person.firstName} ${person.lastName}`} />
                <Row>
                    <InfoContainer>
                        <NameContainer isExpert={isExpert}>
                            <Typography
                                variant="body1"
                                gutterBottom
                                style={{ marginBottom: "-1px", paddingRight: "5px", fontWeight: 500 }}
                            >
                                {person.firstName}
                            </Typography>
                            <Typography variant="body1" gutterBottom style={{ fontWeight: 500 }}>
                                {person.lastName}
                            </Typography>
                        </NameContainer>
                        <Typography variant="body2" gutterBottom>
                            {person.position}
                        </Typography>
                        {
                            <Typography variant="body2" gutterBottom>
                                {person.country}
                            </Typography>
                        }
                    </InfoContainer>
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

const Item = styled.div`
    display: flex;
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
    align-items: center;
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

const NameContainer = styled.div<{ isExpert: boolean }>`
    display: flex;
    flex-direction: ${props => (props.isExpert ? "row" : "column")};
`;
