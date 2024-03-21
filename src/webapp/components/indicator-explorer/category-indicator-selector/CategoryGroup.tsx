import React, { useCallback } from "react";
import { Box, Collapse, IconButton, Typography } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { AutocompleteRenderGroupParams } from "@material-ui/lab";
import styled from "styled-components";

export const CategoryGroup = React.memo(({ params }: { params: AutocompleteRenderGroupParams }) => {
    const [open, setOpen] = React.useState(false);

    const handleToggleExpand = useCallback(() => {
        setOpen(!open);
    }, [open]);

    return (
        <StyledBox>
            <CategoryWrapper onClick={handleToggleExpand}>
                <StyledIconButton size="small" onClick={handleToggleExpand}>
                    {open ? (
                        <ArrowDropUpIcon aria-label="collapse-icon" />
                    ) : (
                        <ArrowDropDownIcon aria-label="expand-icon" />
                    )}
                </StyledIconButton>{" "}
                <CategoryLabel onClick={handleToggleExpand}>{params.group}</CategoryLabel>
            </CategoryWrapper>
            <Collapse in={open} timeout="auto">
                {params.children}
            </Collapse>
        </StyledBox>
    );
});

const StyledIconButton = styled(IconButton)`
    svg {
        font-size: 1.1rem;
        color: black;
    }
`;

const CategoryWrapper = styled.div`
    cursor: pointer;
    display: flex;
`;

const CategoryLabel = styled(Typography)`
    padding: 8px;
    font-weight: 400;
    font-size: 1rem;
`;

const StyledBox = styled(Box)`
    padding-inline-end: 16px;
    padding-inline-start: 16px;
    &:first-child {
        padding-block-start: 8px;
    }
    &:last-child {
        padding-block-end: 8px;
    }
`;
