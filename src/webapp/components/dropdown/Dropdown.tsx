import { Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

import styled from "styled-components";
import i18n from "../../../locales";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
interface DropdownProps<T extends string = string> {
    label: string;
    options: Option<T>[];
    value?: T;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T) => void;
    width?: string;
}

interface ContainerProps {
    width: string;
}

export const Dropdown: React.FC<DropdownProps> = React.memo(
    ({ label, options, value, placeholder, fullWidth, onChange, width = "100%" }) => {
        const [valueOption, setValueOption] = useState<Option<string> | null>(null);

        useEffect(() => {
            setValueOption(options.find(option => option.value === value) || null);
        }, [options, value]);

        const handleChange = (_e: React.ChangeEvent<{}>, value: Option<string> | null): void => {
            if (!Array.isArray(value)) {
                if (typeof value === "string") {
                    onChange(value);
                } else {
                    onChange(value?.value || undefined);
                }
            }
        };

        const handleClear = (): void => {
            onChange(undefined);
            setValueOption(null);
        };

        return (
            <Container width={width}>
                <Autocomplete
                    fullWidth={fullWidth}
                    multiple={false}
                    id="tags-filled"
                    options={options}
                    value={valueOption || null}
                    getOptionLabel={option => option?.text}
                    renderInput={params => (
                        <DropdownTextField
                            {...params}
                            variant="standard"
                            label={label}
                            placeholder={placeholder}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                    onChange={handleChange}
                />
                {value && (
                    <ClearButton variant="text" onClick={handleClear}>
                        {i18n.t("Clear")}
                    </ClearButton>
                )}
            </Container>
        );
    }
);

const ClearButton = styled(Button)`
    color: orange;
    text-transform: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0px;
    font-weight: 400;
`;

const Container = styled.div<ContainerProps>`
    position: relative;
    width: ${props => props.width || "100%"};
`;
