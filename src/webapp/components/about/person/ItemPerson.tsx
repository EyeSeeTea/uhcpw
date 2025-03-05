import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import { PersonState } from "../../../pages/about/AboutState";

export interface ItemPersonProps {
    person: PersonState;
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
                            <NoWrapText
                                gutterBottom
                                style={{ marginBottom: "-1px", paddingRight: "5px", fontWeight: "bold" }}
                            >
                                {person.firstName}
                            </NoWrapText>
                            <NoWrapText gutterBottom style={{ fontWeight: "bold" }}>
                                {person.lastName}
                            </NoWrapText>
                        </NameContainer>
                        <div>
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => (
                                        <Text variant="body1" gutterBottom>
                                            {children}
                                        </Text>
                                    ),
                                }}
                            >
                                {person.position.replace(/\\n/g, "\n")}
                            </ReactMarkdown>
                        </div>
                        <div>
                            {person.institution && (
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => (
                                            <Text variant="body1" gutterBottom>
                                                {children}
                                            </Text>
                                        ),
                                    }}
                                >
                                    {person.institution.replace(/\\n/g, "\n")}
                                </ReactMarkdown>
                            )}
                        </div>
                        <Text variant="body1" gutterBottom>
                            {person.countryName}
                        </Text>
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
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-bottom: 6px;
    object-fit: cover;
    object-position: 50% 0%;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const NameContainer = styled.div<{ isExpert: boolean }>`
    display: flex;
    flex-direction: ${props => (props.isExpert ? "row" : "column")};
    align-items: "${props => (props.isExpert ? "flex-start" : "center")}";
`;

const Text = styled(Typography)`
    text-align: center;
    font-family: Lato;
`;

const NoWrapText = styled(Text)`
    white-space: nowrap;
`;
