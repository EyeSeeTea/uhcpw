import { Dropdown } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";

export const SelectDropdown = styled(Dropdown)`
    .muioutlinedinput-notchedoutline: {
        border: 0;
    }
    label {
        transform: none;
        position: initial;
    }
    div[role="button"] {
        background: #f8f8f8;
        border-radius: 8px;
        min-width: 200px;
        border: 1px solid #d6d3d3;
        padding-left: 16px;
    }
    div[data-cy="Category"]:before {
        border: none !important;
    }
    div[data-cy="Theme"]:before {
        border: none !important;
    }
    div[data-cy="Countries"]:before {
        border: none !important;
    }
    div[data-cy="Year"]:before {
        border: none !important;
    }
    .Mui-focused:after {
        border: none;
    }
`;
