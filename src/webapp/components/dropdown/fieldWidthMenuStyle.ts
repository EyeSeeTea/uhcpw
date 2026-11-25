import React from "react";

const MENU_PADDING = "16px";

export function getFieldWidthMenuStyle(field: HTMLElement | null): Readonly<React.CSSProperties> {
    return { width: field?.clientWidth, padding: MENU_PADDING, boxSizing: "border-box" };
}
