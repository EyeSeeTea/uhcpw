import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Popper } from "@material-ui/core";

import { DropdownTextField } from "../../dropdown/DropdownTextField";
import { Option } from "../../dropdown/Option";
interface CountryDropdownProps {
    label?: string;
    countryOptions: Option<string>[];
    value?: string;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value: string) => void;
    width?: string;
    forceRotation?: boolean;
}

export const CountryDropdown: React.FC<CountryDropdownProps> = React.memo(
    ({ label, countryOptions, value, placeholder, fullWidth, width = "100%", onChange, forceRotation = false }) => {
        const [valueOption, setValueOption] = useState<Option<string> | null>(null);

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
                />
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
