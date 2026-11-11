import React from "react";
import { Button } from "@material-ui/core";
import { Components } from "react-markdown";
import styled from "styled-components";

import { colors } from "../../pages/app/themes/dhis2.theme";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";

type ButtonItemProps = {
    href?: string;
    children: React.ReactNode;
};

const ButtonItem: React.FC<ButtonItemProps> = ({ href, children }) => {
    const { redirectWithExternalLink } = useAnalytics();

    return (
        <a href={href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
            <StyledButton>{children}</StyledButton>
        </a>
    );
};

export const countrySummaryMarkdownComponents: Readonly<Components> = {
    a: ({ href, children }) => <ButtonItem href={href}>{children}</ButtonItem>,
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    ul: ({ children }) => <List>{children}</List>,
};

const Paragraph = styled.p`
    margin-block: 0;

    > a {
        display: inline-block;
        margin-block-start: 16px;
    }
`;

const List = styled.ul`
    margin-block: 0;
`;

const StyledButton = styled(Button)`
    background-color: white;
    opacity: 1;
    padding: 5px 30px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;
