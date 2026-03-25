import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

import { colors } from "../../pages/app/themes/dhis2.theme";

export const createMarkdownComponents = (redirectWithExternalLink?: React.MouseEventHandler<HTMLAnchorElement>) => ({
    p: ({ children }: { children: React.ReactNode & React.ReactNode[] }) => (
        <Paragraph variant="body1" gutterBottom>
            {children}
        </Paragraph>
    ),
    li: ({ children, ...props }: { children: React.ReactNode & React.ReactNode[] }) => (
        <StyledLi {...props}>{children} </StyledLi>
    ),
    ul: ({ children, ...props }: { children: React.ReactNode & React.ReactNode[] }) => (
        <StyledUl {...props}>{children}</StyledUl>
    ),
    a: ({ ...props }) => (
        <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
            {props.children}
        </TextLink>
    ),
});

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 16px;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    line-height: 1.43;
    color: ${colors.black};
    font-size: 16px;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    color: ${colors.black};
    font-size: 16px;
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    font-size: 16px;
    &:hover {
        text-decoration: underline;
    }
`;
