import { Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Option } from "../../dropdown/Option";

import styled from "styled-components";
import i18n from "../../../../locales";
import { CountryOption } from "../../country-selector/CountrySelector";
import { DropdownTextField } from "../../dropdown/DropdownTextField";
interface DropdownProps<T extends string = string> {
    label?: string;
    options: CountryOption[];
    value?: T;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T) => void;
    width?: string;
}

interface ContainerProps {
    width: string;
}

export const CountryDropdown: React.FC<DropdownProps> = React.memo(
    ({ label, options, value, placeholder, fullWidth, onChange, width = "100%" }) => {
        const [valueOption, setValueOption] = useState<CountryOption | null>(null);

        useEffect(() => {
            setValueOption(options.find(option => option.id === value) || null);
        }, [options, value]);

        const handleChange = (e: React.ChangeEvent<{}>, value: Option<string> | null): void => {
            if (!Array.isArray(value)) {
                if (typeof value === "string") {
                    onChange(value);
                } else {
                    onChange(value?.value || undefined);
                }
            }
        };

        return (
            <Container width={width}>
                <StyledAutocomplete
                    fullWidth={fullWidth}
                    multiple={false}
                    id="tags-filled"
                    options={options}
                    value={valueOption || null}
                    getOptionLabel={option => (option as CountryOption)?.name}
                    renderInput={params => (
                        <DropdownTextField
                            {...params}
                            variant="standard"
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                    onChange={(e, value) => {}}
                />
            </Container>
        );
    }
);

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
