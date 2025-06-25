import { Button, ListItemText, List, ListItem } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";

import styled from "styled-components";
import i18n from "../../../locales";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
import { FullScreenDialog } from "../dialog/FullScreenDialog";
interface DropdownProps<T extends string = string> {
    label?: string;
    options: Option<T>[];
    value?: T;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T) => void;
    disabled?: boolean;
    width?: string;
    hideLabel?: boolean;
    minWidth?: string;
    fullScreen?: boolean;
}

interface ContainerProps {
    width: string;
}

type OptionLabel = {
    value: string;
    text: string;
};

export const Dropdown: React.FC<DropdownProps> = React.memo(
    ({
        label,
        options,
        value,
        placeholder,
        fullWidth,
        onChange,
        disabled = false,
        width = "100%",
        hideLabel = false,
        minWidth,
        fullScreen = false,
    }) => {
        const [valueOption, setValueOption] = useState<Option<string> | null>(null);
        const [showFullScreen, setShowFullScreen] = React.useState(false);

        useEffect(() => {
            setValueOption(options.find(option => option.value === value) || null);
        }, [options, value]);

        const handleClick = useCallback(() => {
            if (fullScreen) {
                setShowFullScreen(true);
            }
        }, [fullScreen]);

        const closeFullScreen = useCallback(() => {
            setShowFullScreen(false);
        }, []);

        const handleChange = (e: React.ChangeEvent<{}>, value: Option<string> | null): void => {
            if (!Array.isArray(value)) {
                if (typeof value === "string") {
                    onChange(value);
                } else {
                    onChange(value?.value || undefined);
                }
            }
            closeFullScreen();
        };

        const handleClear = (): void => {
            onChange(undefined);
            setValueOption(null);
        };

        const handleListItemClick = (option: Option): void => {
            onChange(option?.value || undefined);
            closeFullScreen();
        };

        return (
            <Container width={width}>
                <StyledAutocomplete
                    fullWidth={fullWidth}
                    multiple={false}
                    options={options}
                    value={valueOption || null}
                    getOptionLabel={option => (option as OptionLabel)?.text}
                    renderInput={params => (
                        <StyledDropdownTextField
                            {...params}
                            className={`${hideLabel ? "hide-label" : ""}`}
                            variant="standard"
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                            aria-label={label || placeholder || "Dropdown"}
                            minWidth={minWidth}
                        />
                    )}
                    onChange={(e, value) => handleChange(e, value as Option<string> | null)}
                    disabled={disabled}
                    onOpen={handleClick}
                />

                {value && (
                    <ClearButton
                        className="Dropdown-clear-button"
                        variant="text"
                        onClick={handleClear}
                        top={label && !hideLabel ? "0" : "-20px"}
                    >
                        {i18n.t("Clear")}
                    </ClearButton>
                )}

                {showFullScreen && (
                    <FullScreenDialog isOpen={true} onClose={closeFullScreen} title={label}>
                        <List>
                            {options.map(option => {
                                const isSelected = valueOption?.value === option.value;

                                return (
                                    <ListItem
                                        button
                                        key={option.value}
                                        selected={isSelected}
                                        onClick={() => handleListItemClick(option)}
                                    >
                                        <ListItemText primary={option.text} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </FullScreenDialog>
                )}
            </Container>
        );
    }
);

const ClearButton = styled(Button)<{ top: string }>`
    color: orange;
    text-transform: none;
    position: absolute;
    right: -15px;
    padding: 0px;
    font-weight: 400;
    top: ${props => props.top};
`;

const Container = styled.div<ContainerProps>`
    position: relative;
    width: ${props => props.width || "100%"};
`;

const StyledAutocomplete = styled(Autocomplete)`
    .MuiInputBase-root {
        border-radius: 20px !important;
    }
    .MuiAutocomplete-popupIndicator {
        margin-right: 5px;
    }
`;

const StyledDropdownTextField = styled(DropdownTextField)`
    &.hide-label {
        label {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        }
    }
`;
