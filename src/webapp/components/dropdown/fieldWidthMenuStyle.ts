import React from "react";

const MENU_PADDING = "16px";

export function getFieldWidthMenuStyle(fieldWidth: number | undefined): Readonly<React.CSSProperties> {
    return { width: fieldWidth, padding: MENU_PADDING, boxSizing: "border-box" };
}
