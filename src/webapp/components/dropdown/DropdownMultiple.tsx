import { Chip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useMemo } from "react";
import styled from "styled-components";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
import CloseIcon from "@material-ui/icons/Close";

interface DropdownMultipleProps<T extends string = string> {
    label: string;
    options: Option<T>[];
    values?: T[];
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T[]) => void;
}

export const DropdownMultiple: React.FC<DropdownMultipleProps> = ({
    label,
    options,
    values,
    placeholder,
    fullWidth,
    onChange,
}) => {
    const valuesOption = useMemo(() => {
        return options.filter(option => values?.includes(option.value));
    }, [options, values]);

    const handleChange = (_e: React.ChangeEvent<{}>, values: Option<string>[] | null): void => {
        onChange(values?.map(option => option.value) || undefined);
    };

    return (
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
                    <StyledChip
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
    );
};

export const StyledChip = styled(Chip)`
    border-radius: 8px;
    background: #cfe9f7;
    border: none;
    margin: 1px;
`;
