import CircleIcon from "@material-ui/icons/Brightness1";
import { SvgIcon } from "material-ui";
import React from "react";

const DEFAULT_COLOR = "#000";

export function FullCircleIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return <CircleIcon htmlColor={color} />;
}

export function HalfCircleIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return (
        <SvgIcon viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20V2z" fill={color} />
            <path d="M12 2v20a10 10 0 000-20z" fill="none" stroke={color} />
        </SvgIcon>
    );
}

export function CircleXIcon({ color = DEFAULT_COLOR }: { color?: string }) {
    return (
        <SvgIcon viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={color} />
            <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </SvgIcon>
    );
}
