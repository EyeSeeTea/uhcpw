import { Button, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import i18n from "../../../locales";

type HeaderAction = Readonly<{ onClick: () => void; disabled: boolean }>;

type SelectionListHeaderProps = {
    title?: string;
    selectAll?: HeaderAction;
    clear?: HeaderAction;
    isSmallScreen: boolean;
};

/* Title on the left; when the buttons do not fit next to it, they move to the next line, aligned right */
export const SelectionListHeader: React.FC<SelectionListHeaderProps> = React.memo(
    ({ title, selectAll, clear, isSmallScreen }) => (
        <Container>
            {title && <Title variant="body1">{title}</Title>}
            {selectAll || clear ? (
                <Buttons $isSmallScreen={isSmallScreen}>
                    {selectAll && (
                        <ActionButton variant="text" onClick={selectAll.onClick} disabled={selectAll.disabled}>
                            {i18n.t("Select all")}
                        </ActionButton>
                    )}
                    {clear && (
                        <ActionButton variant="text" onClick={clear.onClick} disabled={clear.disabled}>
                            {i18n.t("Clear")}
                        </ActionButton>
                    )}
                </Buttons>
            ) : null}
        </Container>
    )
);

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    column-gap: 16px;
`;

const Title = styled(Typography)`
    white-space: nowrap;
    margin-block-end: 4px;
`;

const Buttons = styled.div<{ $isSmallScreen: boolean }>`
    margin-inline-start: auto;
    padding-inline-end: ${props => (props.$isSmallScreen ? "5px" : "30px")};
    white-space: nowrap;
`;

const ActionButton = styled(Button)`
    color: orange;
    text-transform: none;
    padding: 0px;
    font-weight: 400;
`;
