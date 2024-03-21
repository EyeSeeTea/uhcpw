import React, { useCallback } from "react";
import { Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import {
    TreeItem,
    TreeView,
    Autocomplete,
    AutocompleteCloseReason,
    AutocompleteInputChangeReason,
} from "@material-ui/lab";
import styled from "styled-components";

import i18n from "../../../../locales";
import { DropdownTextField } from "../../dropdown/DropdownTextField";
import { IndicatorOption } from "../../../pages/indicator-explorer/IndicatorExplorerState";

interface IndicatorSelectorProps {
    label?: string;
    options: IndicatorOption[];
    selectedValue?: string | undefined;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: string | undefined) => void;
    width?: string;
}

export const IndicatorSelector = React.memo(
    ({ label, options, selectedValue, placeholder, fullWidth, onChange, width = "100%" }: IndicatorSelectorProps) => {
        const [open, setOpen] = React.useState<boolean>(false);
        const [selectedOption, setSelectedOption] = React.useState<IndicatorOption | null>(null);
        const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);
        const [inputValue, setInputValue] = React.useState("");

        React.useEffect(() => {
            setSelectedOption(options.find(option => option.value === selectedValue) || null);
        }, [options, selectedValue]);

        const handleChange = useCallback(
            (_event: React.ChangeEvent<{}>, value: unknown) => {
                onChange((value as IndicatorOption)?.value || undefined);
            },
            [onChange]
        );

        const handleClear = useCallback(() => {
            onChange(undefined);
            setSelectedOption(null);
        }, [onChange]);

        const handleClose = React.useCallback((event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
            const isClickingOutsidePanel = reason === "blur" && !(event as React.MouseEvent)?.relatedTarget;
            if (isClickingOutsidePanel || reason !== "blur") {
                setOpen(false);
                setExpandedCategories([]);
            }
        }, []);

        const handleOpen = React.useCallback((_event: React.ChangeEvent<{}>) => {
            setOpen(true);
        }, []);

        const handleExpandCategory = useCallback((_event: React.ChangeEvent<{}>, nodeIds: string[]) => {
            setExpandedCategories(nodeIds);
        }, []);

        const handleInputChange = useCallback(
            (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
                // NOTICE: This is to avoid that when we have search text in the input and also expanding/collapsing categories, the input is not reset.
                const isExpandingOrCollapsingCategory = event?.type === "blur" && reason === "reset";
                if (!isExpandingOrCollapsingCategory) {
                    setInputValue(value);
                }
            },
            []
        );

        return (
            <Container width={width}>
                <StyledAutocomplete
                    fullWidth={fullWidth}
                    multiple={false}
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    options={options}
                    groupBy={option => (option as IndicatorOption).category}
                    getOptionLabel={option => {
                        return `${(option as IndicatorOption).category}: ${(
                            option as IndicatorOption
                        ).text.toLowerCase()}`;
                    }}
                    value={selectedOption || null}
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    renderInput={props => (
                        <DropdownTextField
                            {...props}
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                    renderGroup={props => (
                        <StyledTreeView
                            expanded={expandedCategories}
                            onNodeToggle={handleExpandCategory}
                            defaultCollapseIcon={<ArrowDropUpIcon aria-label="collapse-icon" />}
                            defaultExpandIcon={<ArrowDropDownIcon aria-label="expand-icon" />}
                        >
                            <StyledTreeItem nodeId={props.group} label={props.group}>
                                {props.children}
                            </StyledTreeItem>
                        </StyledTreeView>
                    )}
                    renderOption={option => (option as IndicatorOption).text}
                />
                {selectedValue ? (
                    <ClearButton variant="text" onClick={handleClear}>
                        {i18n.t("Clear")}
                    </ClearButton>
                ) : null}
            </Container>
        );
    }
);

const ClearButton = styled(Button)`
    color: orange;
    text-transform: none;
    position: absolute;
    right: 0;
    padding: 0;
    font-weight: 400;
    top: 0;
`;

const Container = styled.div<{ width: string }>`
    position: relative;
    width: ${props => props.width || "100%"};
`;

const StyledAutocomplete = styled(Autocomplete)`
    div.MuiInputBase-root {
        border-radius: 20px;
    }
    .MuiAutocomplete-popupIndicator {
        margin-inline-end: 5px;
    }
`;

const StyledTreeItem = styled(TreeItem)`
    .MuiTreeItem-label {
        padding: 8px;
        font-weight: 400;
        font-size: 1rem;
    }
`;

const StyledTreeView = styled(TreeView)`
    padding-inline-end: 16px;
    padding-inline-start: 16px;
    &:first-child {
        padding-block-start: 8px;
    }
    &:last-child {
        padding-block-end: 8px;
    }
`;
