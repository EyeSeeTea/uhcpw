import { InputAdornment } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React from "react";

type DropdownArrowAdornmentProps = {
    expanded: boolean;
    ariaLabel?: string;
};

const ARROW_ADORNMENT_STYLE: Readonly<React.CSSProperties> = {
    top: "calc(50% - 12px)",
    right: -7,
    position: "absolute",
    height: "24px",
};

const ARROW_ICON_STYLE: Readonly<React.CSSProperties> = { cursor: "pointer" };

export const DropdownArrowAdornment: React.FC<DropdownArrowAdornmentProps> = React.memo(({ expanded, ariaLabel }) => (
    <InputAdornment position="start" aria-label={ariaLabel} style={ARROW_ADORNMENT_STYLE}>
        {expanded ? (
            <ArrowDropUpIcon htmlColor="black" style={ARROW_ICON_STYLE} />
        ) : (
            <ArrowDropDownIcon htmlColor="black" style={ARROW_ICON_STYLE} />
        )}
    </InputAdornment>
));
