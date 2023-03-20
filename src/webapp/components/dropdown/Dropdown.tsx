import { Autocomplete } from "@material-ui/lab";
import { useMemo } from "react";
import { DropdownTextField } from "./DropdownTextField";
import { Option } from "./Option";
interface DropdownProps<T extends string = string> {
    label: string;
    options: Option<T>[];
    value?: T;
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (value?: T) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, value, placeholder, fullWidth, onChange }) => {
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
            fullWidth={fullWidth}
            multiple={false}
            id="tags-filled"
            options={options}
            value={valueOption}
            getOptionLabel={option => option?.text}
            renderInput={params => (
                <DropdownTextField {...params} variant="standard" label={label} placeholder={placeholder} />
            )}
            onChange={handleChange}
        />
    );
};
