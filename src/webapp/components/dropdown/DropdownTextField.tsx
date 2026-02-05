import { TextField } from "@material-ui/core";
import styled from "styled-components";

export const DropdownTextField = styled(TextField)<{ $isDisabled?: boolean; minWidth?: string }>(props => ({
    "& label, & label.Mui-focused": {
        color: "grey",
    },
    label: {
        transform: "none",
        position: "initial",
        marginTop: "3px",
    },
    "@media (max-width: 350px)": {
        "div.MuiInputBase-root.MuiInput-underline": {
            minWidth: "100%",
        },
    },
    "div.MuiInput-underline": {
        background: "#f2f9fd",
        border: "1px solid #cfe9f7",
        borderRadius: "8px",
        minWidth: props.minWidth || "200px",
        padding: "8px 20px 8px 16px",
    },
    "div.MuiInput-underline:before": {
        border: "none !important",
    },
    "div.MuiInput-underline:after": {
        border: "none !important",
    },
    ".MuiAutocomplete-clearIndicator": {
        display: "none",
    },
    ".MuiInput-input": {
        color: props.$isDisabled ? "#8b8b8b" : undefined,
    },
}));
