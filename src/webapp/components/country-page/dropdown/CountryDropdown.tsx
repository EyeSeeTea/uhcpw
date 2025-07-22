import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Popper, TextField, List, ListItem, ListItemText } from "@material-ui/core";

import { DropdownTextField } from "../../dropdown/DropdownTextField";
import { Option } from "../../dropdown/Option";
import { FullScreenDialog } from "../../dialog/FullScreenDialog";
import i18n from "../../../../locales";
interface CountryDropdownProps {
    label?: string;
    countryOptions: Option<string>[];
    value?: string;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: string) => void;
    width?: string;
    forceRotation?: boolean;
    fullScreen?: boolean;
}

export const CountryDropdown: React.FC<CountryDropdownProps> = React.memo(
    ({
        label,
        countryOptions,
        value,
        placeholder,
        fullWidth,
        width = "100%",
        onChange,
        forceRotation = false,
        fullScreen = false,
    }) => {
        const [valueOption, setValueOption] = useState<Option<string> | null>(null);
        const [open, setOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");

        useEffect(() => {
            setValueOption(countryOptions.find(option => option.value === value) || null);
        }, [countryOptions, value]);

        const handleChange = useCallback(
            (_event: React.ChangeEvent<{}>, value: unknown) => {
                if (value && (value as Option<string>)?.value) {
                    onChange((value as Option<string>).value);
                }
            },
            [onChange]
        );
        return (
            <Container width={width} aria-label="country-dropdown">
                <StyledAutocomplete
                    PopperComponent={props => (forceRotation ? <StyledPopper {...props} /> : <Popper {...props} />)}
                    fullWidth={fullWidth}
                    multiple={false}
                    id="country-autocomplete"
                    options={countryOptions}
                    value={valueOption || null}
                    getOptionLabel={option => (option as Option<string>)?.text}
                    renderInput={params => (
                        <DropdownTextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                ...params.InputProps,
                                readOnly: forceRotation,
                            }}
                        />
                    )}
                    onChange={handleChange}
                    open={fullScreen ? false : open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                />
                {fullScreen && open ? (
                    <FullScreenDialog
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        title={i18n.t("Select category and indicator")}
                        forceRotation={forceRotation}
                    >
                        <FullScreenContainer>
                            <StyledTextField
                                aria-label={placeholder || "Indicator selector"}
                                role={"textbox"}
                                fullWidth={fullWidth}
                                placeholder={placeholder}
                                onChange={event => setSearchTerm(event.target.value)}
                                value={searchTerm}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    "aria-label": `input ${placeholder || "Indicator selector"}`,
                                }}
                            />
                            <List>
                                {countryOptions
                                    .filter(option => option.text.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(option => (
                                        <ListItem
                                            button
                                            key={option.value}
                                            onClick={() => {
                                                onChange(option.value);
                                                setOpen(false);
                                            }}
                                        >
                                            <ListItemText primary={option.text} />
                                        </ListItem>
                                    ))}
                            </List>
                        </FullScreenContainer>
                    </FullScreenDialog>
                ) : null}
            </Container>
        );
    }
);

const Container = styled.div<{ width: string }>`
    position: relative;
    width: ${props => props.width || "100%"};
`;

const StyledAutocomplete = styled(Autocomplete)`
    div.MuiInputBase-root {
        border-radius: 20px;
    }
    .MuiAutocomplete-popupIndicator {
        margin-right: 5px;
    }
`;

const StyledPopper = styled.div`
    position: absolute;
`;

const FullScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledTextField = styled(TextField)`
    position: relative;
    label.MuiInputLabel-root {
        transform: none;
        position: initial;
        margin-top: 3px;
        color: grey;
    }

    div.MuiInputBase-root.MuiInput-underline {
        border-radius: 20px;
        color: black;
        background: #f2f9fd;
        border: 1px solid #cfe9f7;
        min-width: 200px;
        padding: 8px 16px;

        &:before,
        &:after {
            border: none;
        }
    }
    .MuiAutocomplete-clearIndicator {
        display: none;
    }
`;
