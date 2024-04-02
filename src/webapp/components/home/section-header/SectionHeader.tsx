import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import bubblePattern from "../../../assets/bubble-pattern.svg";
import { ChevronRightIcon } from "../../icons/ChevronRightIcon";
import { NavLink } from "react-router-dom";

export interface SectionHeaderProps {
    header: string;
    subheader?: string;
    isBackgroundOnRight?: boolean;
    hasArrowIcon?: boolean;
    tag?: string;
    link?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    header,
    subheader,
    isBackgroundOnRight,
    hasArrowIcon,
    tag,
    link,
}) => {
    return (
        <Header isBackgroundOnRight={isBackgroundOnRight} hasSubheader={!!subheader}>
            <Row>
                {link ? (
                    <Title variant="h3">
                        <Link to={link}>{header}</Link>
                    </Title>
                ) : (
                    <Title variant="h3">{header}</Title>
                )}
                {tag && (
                    <TagContainer>
                        <Tag>
                            <Typography>{tag}</Typography>
                        </Tag>
                    </TagContainer>
                )}
                {hasArrowIcon && <ChevronRightIcon />}
            </Row>
            {subheader && <SubTitle variant="h5">{subheader}</SubTitle>}
        </Header>
    );
};

const Header = styled.div<{ isBackgroundOnRight?: boolean; hasSubheader?: boolean }>`
    height: ${props => (props.hasSubheader ? "150px" : "80px")};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    background-image: ${props => props.isBackgroundOnRight !== undefined && `url(${bubblePattern})`};
    background-repeat: no-repeat;
    background-position: ${props => (props.isBackgroundOnRight ? "right" : "-200px")};
    padding: ${props => (props.hasSubheader ? "40px" : "55px")} 0px 0px;
`;

const Title = styled(Typography)`
    font-weight: 500;
`;

const Link = styled(NavLink)`
    text-transform: none;
    text-decoration: none;
    color: inherit;
`;

const SubTitle = styled(Typography)`
    color: dimgrey;
    font-weight: 400;
    margin-top: 10px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TagContainer = styled.div`
    margin-left: 15px;
`;

const Tag = styled.div`
    display: flex;
    justify-content: center;
    min-width: 100px;
    background-color: #4fad56;
    color: white;
    border-radius: 30px;
    padding: 5px 10px;
`;
