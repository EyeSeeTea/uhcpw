import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export interface SectionHeaderProps {
    text: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ text }) => {
    return (
        <Header>
            <Title variant="h4">{text}</Title>
        </Header>
    );
};

const Header = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
`;

const Title = styled(Typography)`
    color: #fe8c4f;
    font-weight: bold;
`;
