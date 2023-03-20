import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useMemo } from "react";
import styled from "styled-components";

export type Option<T extends string = string> = {
    value: T;
    text: string;
};

interface DropdownProps<T extends string = string> {
    label: string;
    options: Option<T>[];
    value?: T;
    placeholder?: string;
    onChange: (value?: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, value, placeholder, onChange }) => {
    const valueOption = useMemo(() => {
        return options.find(option => option.value === value);
    }, [options, value]);

    const handleChange = (
        _e: React.ChangeEvent<{}>,
        value: string | Option<string> | (string | Option<string>)[] | null
    ): void => {
        if (!Array.isArray(value)) {
            if (typeof value === "string") {
                onChange(value);
            } else {
                onChange(value?.value || undefined);
            }
        }
    };

    return (
        <Autocomplete
            multiple={false}
            id="tags-filled"
            options={options}
            value={valueOption}
            getOptionLabel={option => option?.text}
            renderInput={params => (
                <StyledTextField {...params} variant="standard" label={label} placeholder={placeholder} />
            )}
            onChange={handleChange}
        />
    );
};

const StyledTextField = styled(TextField)({
    "& label, & label.Mui-focused": {
        color: "grey",
    },
    label: {
        transform: "none",
        position: "initial",
    },
    "div.MuiInput-underline": {
        background: "#f2f9fd",
        borderRadius: "8px",
        minWidth: "200px",
        border: "1px solid #cfe9f7",
        padding: "8px 16px",
    },
    "div.MuiInput-underline:before": {
        border: "none !important",
    },
    "div.MuiInput-underline:after": {
        border: "none !important",
    },
});
