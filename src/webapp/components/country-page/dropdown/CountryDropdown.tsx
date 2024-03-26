import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

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
}

export const CountryDropdown: React.FC<CountryDropdownProps> = React.memo(
    ({ label, countryOptions, value, placeholder, fullWidth, width = "100%", onChange }) => {
        const [valueOption, setValueOption] = useState<Option<string> | null>(null);

        useEffect(() => {
            setValueOption(countryOptions.find(option => option.value === value) || null);
        }, [countryOptions, value]);

        return (
            <Container width={width} aria-label="country-dropdown">
                <StyledAutocomplete
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
                        />
                    )}
                    onChange={(_, value) => onChange((value as Option<string>).value)}
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
