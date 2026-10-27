import { Typography } from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import React from "react";
import styled, { css } from "styled-components";
import { colors } from "../../pages/app/themes/dhis2.theme";

export type VideoPillVariant = "light" | "filled";

type VideoPillProps = {
    label: string;
    variant?: VideoPillVariant;
};

export const VideoPillLink: React.FC<VideoPillProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
    label,
    variant = "light",
    ...anchorProps
}) => (
    <PillLink $variant={variant} {...anchorProps}>
        <VideoPillContent label={label} variant={variant} />
    </PillLink>
);

export const VideoPillButton: React.FC<VideoPillProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    label,
    variant = "light",
    ...buttonProps
}) => (
    <PillButton type="button" $variant={variant} {...buttonProps}>
        <VideoPillContent label={label} variant={variant} />
    </PillButton>
);

const VideoPillContent: React.FC<Required<VideoPillProps>> = ({ label, variant }) => (
    <>
        <PlayCircleFilledIcon style={{ color: pillColors[variant].text }} />
        <Typography>{label}</Typography>
    </>
);

const pillColors: Readonly<Record<VideoPillVariant, Readonly<{ background: string; text: string; hover: string }>>> = {
    light: { background: colors.white, text: colors.accentPrimary, hover: colors.greyLight },
    filled: { background: colors.accentPrimary, text: colors.white, hover: colors.accentPrimaryDark },
};

type PillStyleProps = { $variant: VideoPillVariant };

const pillStyles = css<PillStyleProps>`
    display: flex;
    align-items: center;
    gap: 5px;
    text-align: start;
    width: fit-content;
    text-decoration: none;
    background-color: ${props => pillColors[props.$variant].background};
    padding: 5px 15px;
    color: ${props => pillColors[props.$variant].text};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${props => pillColors[props.$variant].hover};
    }
`;

const PillLink = styled.a<PillStyleProps>`
    ${pillStyles}
`;

const PillButton = styled.button<PillStyleProps>`
    ${pillStyles}
    border: none;
    cursor: pointer;
    font: inherit;
`;
