import { TextField } from "@material-ui/core";
import styled from "styled-components";

export const DropdownTextField = styled(TextField)({
    "& label, & label.Mui-focused": {
        color: "grey",
    },
    label: {
        transform: "none",
        position: "initial",
        marginTop: "3px",
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
    ".MuiAutocomplete-clearIndicator": {
        display: "none",
    },
});
