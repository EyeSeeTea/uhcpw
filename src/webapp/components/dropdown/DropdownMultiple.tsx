import { Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useMemo } from "react";
import styled from "styled-components";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import i18n from "../../../locales";
import { SelectedChip } from "../selected-chip/SelectedChip";

interface DropdownMultipleProps<T extends string = string> {
    label: string;
    options: Option<T>[];
    values?: T[];
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T[]) => void;
}

export const DropdownMultiple: React.FC<DropdownMultipleProps> = React.memo(
    ({ label, options, values, placeholder, fullWidth, onChange }) => {
        const valuesOption = useMemo(() => {
            return options.filter(option => values?.includes(option.value)) || [];
        }, [options, values]);

        const handleChange = (_e: React.ChangeEvent<{}>, values: Option<string>[] | null): void => {
            onChange(values?.map(option => option.value) || undefined);
        };

        const handleClear = (): void => {
            onChange([]);
        };

        return (
            <Container>
                <Autocomplete
                    fullWidth={fullWidth}
                    multiple={true}
                    options={options}
                    value={valuesOption}
                    getOptionLabel={option => option?.text}
                    renderInput={params => (
                        <DropdownTextField {...params} variant="standard" label={label} placeholder={placeholder} />
                    )}
                    renderTags={(value: Option[], getTagProps) =>
                        value.map((option: Option, index: number) => (
                            <SelectedChip
                                key={option.value}
                                variant="outlined"
                                label={option.text}
                                {...getTagProps({ index })}
                                deleteIcon={<CloseIcon fontSize="small" />}
                            />
                        ))
                    }
                    onChange={handleChange}
                />
                {(values || []).length > 0 && (
                    <ClearButton variant="text" onClick={handleClear}>
                        {i18n.t("Clear all")}
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

const Container = styled.div`
    position: relative;
    width: 100%;
`;
