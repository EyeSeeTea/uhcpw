import { Typography } from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import React from "react";
import styled, { css } from "styled-components";
import { colors } from "../../pages/app/themes/dhis2.theme";

type VideoPillProps = {
    label: string;
};

export const VideoPillLink: React.FC<VideoPillProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
    label,
    ...anchorProps
}) => (
    <PillLink {...anchorProps}>
        <VideoPillContent label={label} />
    </PillLink>
);

export const VideoPillButton: React.FC<VideoPillProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    label,
    ...buttonProps
}) => (
    <PillButton type="button" {...buttonProps}>
        <VideoPillContent label={label} />
    </PillButton>
);

const VideoPillContent: React.FC<VideoPillProps> = ({ label }) => (
    <>
        <PlayCircleFilledIcon style={{ color: colors.accentPrimary }} />
        <Typography>{label}</Typography>
    </>
);

const pillStyles = css`
    display: flex;
    gap: 5px;
    width: fit-content;
    text-decoration: none;
    background-color: white;
    padding: 5px 15px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;

const PillLink = styled.a`
    ${pillStyles}
`;

const PillButton = styled.button`
    ${pillStyles}
    border: none;
    cursor: pointer;
    font: inherit;
`;
