import { Button, ListItemText, List, ListItem, useMediaQuery } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import i18n from "../../../locales";
import { SelectedChip } from "../selected-chip/SelectedChip";
import { FullScreenDialog } from "../dialog/FullScreenDialog";

interface DropdownMultipleProps<T extends string = string> {
    label?: string;
    options: Option<T>[];
    values?: T[];
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T[]) => void;
    disabled?: boolean;
    hideLabel?: boolean;
    minWidth?: string;
    fullScreen?: boolean;
}

type OptionLabel = {
    value: string;
    text: string;
};

export const DropdownMultiple: React.FC<DropdownMultipleProps> = React.memo(
    ({
        label,
        options,
        values,
        placeholder,
        fullWidth,
        onChange,
        disabled,
        hideLabel = false,
        minWidth,
        fullScreen,
    }) => {
        const [showFullScreen, setShowFullScreen] = React.useState(false);
        const isSmallScreen = useMediaQuery("(max-width:600px)");

        const valuesOption = useMemo(() => {
            return options.filter(option => values?.includes(option.value)) || [];
        }, [options, values]);

        const handleChange = (_e: React.ChangeEvent<{}>, values: Option<string>[] | null): void => {
            onChange(values?.map(option => option.value) || undefined);
        };

        const handleClear = (): void => {
            onChange([]);
        };

        const handleClick = useCallback(() => {
            if (fullScreen) {
                setShowFullScreen(true);
            }
        }, [fullScreen]);

        const closeFullScreen = useCallback(() => {
            setShowFullScreen(false);
        }, []);

        const handleListItemClick = (option: Option): void => {
            const newValues = values?.includes(option.value)
                ? values.filter(value => value !== option.value)
                : [...(values || []), option.value];
            onChange(newValues);
            closeFullScreen();
        };

        const finalPlaceholder = valuesOption.length > 0 ? "" : placeholder;

        return (
            <Container>
                <StyledAutocomplete
                    disabled={disabled}
                    fullWidth={fullWidth}
                    multiple={true}
                    options={options}
                    value={valuesOption}
                    getOptionLabel={option => (option as OptionLabel)?.text}
                    renderInput={params => (
                        <StyledDropdownTextField
                            {...params}
                            className={`${hideLabel ? "hide-label" : ""}`}
                            variant="standard"
                            label={label}
                            placeholder={finalPlaceholder}
                            aria-label={label || placeholder || "Dropdown Multiple"}
                            InputLabelProps={{ shrink: true }}
                            minWidth={minWidth}
                            InputProps={{
                                ...params.InputProps,
                                readOnly: isSmallScreen,
                            }}
                        />
                    )}
                    renderTags={(value: unknown[], getTagProps) =>
                        value.map((option: unknown, index: number) => (
                            <SelectedChip
                                key={(option as Option).value}
                                variant="outlined"
                                label={(option as Option).text}
                                {...getTagProps({ index })}
                                deleteIcon={<CloseIcon fontSize="small" />}
                            />
                        ))
                    }
                    onChange={(e, value) => handleChange(e, value as Option<string>[] | null)}
                    onOpen={handleClick}
                />
                {(values || []).length > 0 && (
                    <ClearButton
                        variant="text"
                        onClick={handleClear}
                        disabled={disabled}
                        top={label && !hideLabel ? "0" : "-20px"}
                        right={-15}
                        className="DropdownMultiple-clear-button"
                    >
                        {i18n.t("Clear")}
                    </ClearButton>
                )}

                {showFullScreen && (
                    <FullScreenDialog isOpen={true} onClose={closeFullScreen} title={label}>
                        <List>
                            {options.map(option => {
                                const isSelected = valuesOption?.includes(option) || false;

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

const ClearButton = styled(Button)<{ top: string; right?: number }>`
    color: orange;
    text-transform: none;
    position: absolute;
    top: ${props => props.top};
    right: ${props => props.right || 0}px;
    padding: 0px;
    font-weight: 400;
`;

const Container = styled.div`
    position: relative;
    width: 100%;
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
    .MuiInputBase-input {
        caret-color: transparent;
        flex: 1;
        min-width: 0;
    }
`;
