import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import bubblePattern from "../../../assets/bubble-pattern.svg";

export interface SectionHeaderProps {
    header: string;
    subheader?: string;
    isBackgroundOnRight?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ header, subheader, isBackgroundOnRight }) => {
    return (
        <Header isBackgroundOnRight={isBackgroundOnRight}>
            <Title variant="h3">{header}</Title>
            {subheader && <SubTitle variant="h5">{subheader}</SubTitle>}
        </Header>
    );
};

const Header = styled.div<{ isBackgroundOnRight?: boolean }>`
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    background-image: ${props => props.isBackgroundOnRight !== undefined && `url(${bubblePattern})`};
    background-repeat: no-repeat;
    background-position: ${props => (props.isBackgroundOnRight ? "right" : "-200px")};
    padding: 40px 0px;
`;

const Title = styled(Typography)`
    font-weight: 500;
`;

const SubTitle = styled(Typography)`
    color: dimgrey;
    font-weight: 400;
    margin-top: 10px;
`;
